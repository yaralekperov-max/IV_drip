"use client";

import { useMemo, useRef, useState } from "react";
import type { MarkerHistory } from "@/lib/content/biomarker-history";

/**
 * График динамики одного биомаркера во времени.
 *
 * Одна серия → легенда не нужна (её называет заголовок карточки). Значения продублированы
 * строками «было → стало» под графиком, поэтому тултип ничего не «запирает».
 * Спеки марок: линия 2px, маркеры ≥8px с кольцом фона, hairline-сетка, заливка ~10%.
 */

const W = 340;
const H = 150;
const PAD_L = 38;
const PAD_R = 16;
const PAD_T = 14;
const PAD_B = 24;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

// Цвета берём из дизайн-системы VENA (tailwind.config).
const GOLD = "#C9A86A";
const GOLD_LIGHT = "#E3C78D";
const SURFACE = "#13241D"; // panel — фон карточки, им же кольцо вокруг маркеров
const GRID = "rgba(242,239,232,0.08)";
const INK_DIM = "#6E7C73";
const INK = "#F2EFE8";
const POS = "#7FB88A";

/** Округляет шаг до «красивого» числа (1/2/5 × 10^k). */
function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const frac = raw / base;
  const nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return nice * base;
}

function ticksForStep(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
    out.push(Number(v.toFixed(6)));
  }
  return out;
}

/**
 * Деления оси Y — всегда круглые числа. Если с исходным шагом их получилось мало,
 * дробим шаг, пока не наберётся 2–5 делений (иначе на оси оставались «сырые» 56.95).
 */
function buildTicks(min: number, max: number): number[] {
  let step = niceStep((max - min) / 3);
  let ticks = ticksForStep(min, max, step);
  let guard = 0;
  while (ticks.length < 2 && guard++ < 4) {
    step = step / 2;
    ticks = ticksForStep(min, max, step);
  }
  return ticks.slice(0, 5);
}

export function TrendChart({ history }: { history: MarkerHistory }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const geom = useMemo(() => {
    const pts = history.points;
    const times = pts.map((p) => new Date(p.date).getTime());
    const t0 = Math.min(...times);
    const t1 = Math.max(...times);
    const span = t1 - t0 || 1;

    const values = pts.map((p) => p.value);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    // Нижнюю границу нормы включаем в область (полезный контекст), верхнюю — нет:
    // она часто далеко вверху и «сплющила» бы серию. Полосу нормы обрежем по области.
    const rawMin = Math.min(dataMin, history.refMin ?? dataMin);
    const rawMax = dataMax;
    const padding = (rawMax - rawMin || Math.abs(rawMax) || 1) * 0.15;
    const yMin = rawMin - padding;
    const yMax = rawMax + padding;

    const x = (t: number) => PAD_L + ((t - t0) / span) * PLOT_W;
    const y = (v: number) =>
      PAD_T + PLOT_H - ((v - yMin) / (yMax - yMin || 1)) * PLOT_H;

    const coords = pts.map((p, i) => ({ x: x(times[i]), y: y(p.value), p }));
    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
    const area =
      `${line} L${coords[coords.length - 1].x.toFixed(1)},${(PAD_T + PLOT_H).toFixed(1)}` +
      ` L${coords[0].x.toFixed(1)},${(PAD_T + PLOT_H).toFixed(1)} Z`;

    const clamp = (v: number) => Math.max(PAD_T, Math.min(PAD_T + PLOT_H, v));
    const bandTop = history.refMax !== undefined ? clamp(y(history.refMax)) : PAD_T;
    const bandBottom = history.refMin !== undefined ? clamp(y(history.refMin)) : PAD_T + PLOT_H;

    return { coords, line, area, ticks: buildTicks(yMin, yMax), y, bandTop, bandBottom };
  }, [history]);

  const last = geom.coords[geom.coords.length - 1];

  function pick(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const svgX = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestDist = Infinity;
    geom.coords.forEach((c, i) => {
      const d = Math.abs(c.x - svgX);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = active === null ? 0 : Math.min(geom.coords.length - 1, Math.max(0, active + dir));
      setActive(next);
    } else if (e.key === "Escape") {
      setActive(null);
    }
  }

  const activePoint = active !== null ? geom.coords[active] : null;

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        aria-label={`Динамика «${history.name}»: ${history.points
          .map((p) => `${p.label} — ${p.value} ${history.unit}`)
          .join(", ")}`}
      >
        {/* полоса нормы */}
        {(history.refMin !== undefined || history.refMax !== undefined) && (
          <rect
            x={PAD_L}
            y={geom.bandTop}
            width={PLOT_W}
            height={Math.max(0, geom.bandBottom - geom.bandTop)}
            fill={POS}
            opacity={0.07}
          />
        )}

        {/* сетка + подписи оси Y */}
        {geom.ticks.map((t) => {
          const yy = geom.y(t);
          if (yy < PAD_T - 0.5 || yy > PAD_T + PLOT_H + 0.5) return null;
          return (
            <g key={t}>
              <line x1={PAD_L} y1={yy} x2={PAD_L + PLOT_W} y2={yy} stroke={GRID} strokeWidth={1} />
              <text
                x={PAD_L - 6}
                y={yy + 3}
                textAnchor="end"
                fontSize={9}
                fill={INK_DIM}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* заливка под линией */}
        <path d={geom.area} fill={GOLD} opacity={0.1} />

        {/* линия */}
        <path
          d={geom.line}
          fill="none"
          stroke={GOLD}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* кроссхэир */}
        {activePoint && (
          <line
            x1={activePoint.x}
            y1={PAD_T}
            x2={activePoint.x}
            y2={PAD_T + PLOT_H}
            stroke={GOLD}
            strokeWidth={1}
            opacity={0.45}
          />
        )}

        {/* маркеры: кольцо цветом фона, чтобы читались поверх линии */}
        {geom.coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={active === i ? 5.5 : 4}
            fill={i === geom.coords.length - 1 ? GOLD_LIGHT : GOLD}
            stroke={SURFACE}
            strokeWidth={2}
          />
        ))}

        {/* подпись только у последней точки (не число на каждой) */}
        <text
          x={last.x}
          y={last.y - 11}
          textAnchor={last.x > PAD_L + PLOT_W - 26 ? "end" : "middle"}
          fontSize={11}
          fill={INK}
          fontWeight={500}
        >
          {last.p.value}
        </text>

        {/* подписи оси X: крайние прижимаем к краям, чтобы текст не обрезался */}
        {geom.coords.map((c, i) => (
          <text
            key={i}
            x={c.x}
            y={H - 7}
            textAnchor={i === 0 ? "start" : i === geom.coords.length - 1 ? "end" : "middle"}
            fontSize={9}
            fill={INK_DIM}
          >
            {c.p.label}
          </text>
        ))}

        {/* прозрачный слой захвата курсора */}
        <rect
          x={PAD_L}
          y={PAD_T}
          width={PLOT_W}
          height={PLOT_H}
          fill="transparent"
          onPointerMove={(e) => pick(e.clientX)}
          onPointerLeave={() => setActive(null)}
        />
      </svg>

      {/* тултип: значение ведёт, подпись следует */}
      {activePoint && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-bg-2 px-2.5 py-1.5 shadow-soft"
          style={{
            left: `${(activePoint.x / W) * 100}%`,
            top: `${(activePoint.y / H) * 100}%`,
            marginTop: -10,
          }}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-0.5 w-3 rounded-full" style={{ background: GOLD }} />
            <b className="font-display text-[14px] text-ink">
              {activePoint.p.value}
              <span className="ml-1 text-[10px] font-normal text-ink-muted">{history.unit}</span>
            </b>
          </div>
          <div className="mt-0.5 whitespace-nowrap text-[10.5px] text-ink-dim">{activePoint.p.label}</div>
        </div>
      )}
    </div>
  );
}
