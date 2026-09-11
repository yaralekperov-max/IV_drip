import { Reveal } from "./Reveal";
import { SectionHeading, Accent } from "./SectionHeading";
import { StepsGrid, type Step } from "./StepsGrid";

const STEPS: Step[] = [
  {
    num: "Усвоение",
    title: "Почти 100%, минуя ЖКТ",
    text: "Витамины и нутриенты попадают сразу в кровь. От таблетки усваивается лишь часть — остальное организм не получает.",
  },
  {
    num: "Скорость",
    title: "Эффект — в тот же день",
    text: "Не «накопительная польза когда-нибудь». Прилив сил и ясность многие чувствуют уже после первого визита.",
  },
  {
    num: "Точность",
    title: "Состав под вашу задачу",
    text: "Не универсальная баночка с полки, а протокол под вашу цель — энергия, восстановление, иммунитет.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-bg-2 px-6 py-[130px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <SectionHeading eyebrow="Почему капельница">
            Таблетка теряется в пути.
            <br />
            <Accent>Доставка — нет.</Accent>
          </SectionHeading>
        </Reveal>
        <Reveal>
          <StepsGrid steps={STEPS} />
        </Reveal>
      </div>
    </section>
  );
}
