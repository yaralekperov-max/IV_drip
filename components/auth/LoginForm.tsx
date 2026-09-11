"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

type Mode = "login" | "register";
type Step = "phone" | "code";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("phone");

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [consent1, setConsent1] = useState(true);
  const [consent2, setConsent2] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const canRegister = mode === "login" || (name.trim() && consent1 && consent2);

  async function requestCode() {
    setError(null);
    if (mode === "register" && !canRegister) {
      setError("Заполните имя и подтвердите согласия");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name: mode === "register" ? name : undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error === "bad_phone" ? "Проверьте номер телефона" : "Не удалось отправить код");
        return;
      }
      setDevCode(data.devCode ?? null);
      setStep("code");
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, name: mode === "register" ? name : undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error === "mismatch" ? "Неверный код" : "Код истёк или недействителен");
        return;
      }
      router.push("/portal");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-7">
        <h1 className="mb-1.5 font-display text-[30px] font-light text-ink">
          Вход в <em className="italic text-gold-light">личный кабинет</em>
        </h1>
        <p className="text-[15px] font-light text-ink-muted">
          Вход по коду из SMS. Медданные под контролем врача, только в РФ.
        </p>
      </div>

      <div className="rounded-[18px] border border-line-soft bg-panel p-[26px]">
        <h3 className="mb-5 text-base font-medium text-ink">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h3>

        {step === "phone" ? (
          <>
            <Field label="Номер телефона">
              <input
                type="tel"
                inputMode="tel"
                autoFocus
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 ··· ··· ·· ··"
                className={inputCls}
              />
            </Field>

            {mode === "register" && (
              <>
                <Field label="Имя">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться"
                    className={inputCls}
                  />
                </Field>
                <Consent checked={consent1} onToggle={() => setConsent1((v) => !v)}>
                  Принимаю <a className="text-gold">договор-оферту</a> и{" "}
                  <a className="text-gold">политику конфиденциальности</a>
                </Consent>
                <Consent checked={consent2} onToggle={() => setConsent2((v) => !v)}>
                  Согласен на обработку <b className="font-medium text-ink">персональных данных</b>{" "}
                  (152-ФЗ)
                </Consent>
              </>
            )}

            {error && <p className="mb-3 text-[13px] text-status-neg">{error}</p>}

            <button onClick={requestCode} disabled={loading} className={btnCls}>
              {loading ? "Отправляем…" : mode === "login" ? "Получить код" : "Зарегистрироваться"}
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-[13px] text-ink-muted">
              Код отправлен на <b className="text-ink">{phone}</b>.{" "}
              <span
                className="cursor-pointer text-gold hover:opacity-70"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setError(null);
                }}
              >
                Изменить
              </span>
            </p>
            {devCode && (
              <p className="mb-4 rounded-lg border border-dashed border-line bg-bg-2 px-3 py-2 text-[12px] text-ink-muted">
                Демо (SMS не подключена): код <b className="font-display text-gold-light">{devCode}</b>
              </p>
            )}
            <Field label="Код из SMS">
              <input
                inputMode="numeric"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="····"
                className={cn(inputCls, "tracking-[0.5em]")}
              />
            </Field>
            {error && <p className="mb-3 text-[13px] text-status-neg">{error}</p>}
            <button onClick={verify} disabled={loading || code.length !== 4} className={btnCls}>
              {loading ? "Проверяем…" : "Войти"}
            </button>
          </>
        )}

        {step === "phone" && (
          <p className="mt-4 text-center text-[13px] text-ink-muted">
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <span
              className="cursor-pointer text-gold hover:opacity-70"
              onClick={() => {
                setMode((m) => (m === "login" ? "register" : "login"));
                setError(null);
              }}
            >
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-[10px] border border-line-soft bg-bg-2 px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-dim focus:border-gold";
const btnCls =
  "mt-1.5 w-full rounded-full bg-gold py-3.5 text-[14px] font-medium text-bg transition-all hover:bg-gold-light disabled:pointer-events-none disabled:opacity-40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-[18px]">
      <label className="mb-[7px] block text-[12.5px] text-ink-muted">{label}</label>
      {children}
    </div>
  );
}

function Consent({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "mb-3.5 flex cursor-pointer items-start gap-3 rounded-xl border bg-bg-2 p-4 transition-colors",
        checked ? "border-gold" : "border-line-soft hover:border-line",
      )}
    >
      <div
        className={cn(
          "flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md border text-[13px] text-bg transition-all",
          checked ? "border-gold bg-gold" : "border-line",
        )}
      >
        {checked && "✓"}
      </div>
      <div className="text-[13px] font-light leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}
