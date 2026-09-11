import { Reveal } from "./Reveal";
import { SectionHeading, Accent } from "./SectionHeading";
import { StepsGrid, type Step } from "./StepsGrid";

const STEPS: Step[] = [
  {
    num: "Время",
    title: "Не выпадаете из дня",
    text: "Капаетесь во время работы, звонков или дома. Час на себя — без единой минуты из графика.",
  },
  {
    num: "Приватность",
    title: "Только вы и врач",
    text: "Никаких очередей и общих залов. Процедура проходит в вашем пространстве, комфортно и тихо.",
  },
  {
    num: "Скорость",
    title: "Приедем к удобному часу",
    text: "Записываетесь — бригада приезжает в назначенное время. Удобно, как сервис, надёжно, как медицина.",
  },
];

export function WhyVisitSection() {
  return (
    <section id="why-visit" className="bg-bg-2 px-6 py-[130px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <SectionHeading eyebrow="Почему выезд">
            В клинику ехать не нужно.
            <br />
            <Accent>Мы приедем сами.</Accent>
          </SectionHeading>
        </Reveal>
        <Reveal>
          <StepsGrid steps={STEPS} />
        </Reveal>
      </div>
    </section>
  );
}
