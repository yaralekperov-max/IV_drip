"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { PCard, CardHead, Row, ScreenHeader, PLink } from "@/components/portal/ui";
import { ToggleRow } from "@/components/portal/Toggle";

export default function ProfilePage() {
  const toast = useToast();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <ScreenHeader title="Профиль" accent="и настройки" />
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <PCard>
            <CardHead title="Личные данные" />
            <ProfileField label="Имя" defaultValue="Александр Морозов" />
            <ProfileField label="Телефон" defaultValue="+7 916 ··· ·· 02" />
            <ProfileField label="Email" defaultValue="alex@example.com" />
            <button
              onClick={() => toast.show("Данные сохранены")}
              className="rounded-full bg-gold px-6 py-3 text-[14px] font-medium text-bg transition-colors hover:bg-gold-light"
            >
              Сохранить
            </button>
          </PCard>
          <PCard>
            <CardHead
              title="Мои адреса"
              action={<PLink onClick={() => toast.show("Демо: добавление адреса")}>+ Добавить</PLink>}
            />
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">🏠 Дом</h4>
                <p className="text-[12.5px] text-ink-dim">Пресненская наб., 12, кв. 45</p>
              </div>
              <PLink>Изменить</PLink>
            </Row>
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">🏢 Офис</h4>
                <p className="text-[12.5px] text-ink-dim">Москва-Сити, башня Федерация</p>
              </div>
              <PLink>Изменить</PLink>
            </Row>
          </PCard>
        </div>
        <div>
          <PCard>
            <CardHead title="Уведомления" />
            <ToggleRow label="Пуш о статусе визита" defaultOn />
            <ToggleRow label="SMS-напоминания" defaultOn />
            <ToggleRow label="Напоминания о повторной записи" defaultOn />
            <ToggleRow label="Акции и спецпредложения" />
          </PCard>
          <PCard>
            <CardHead title="Безопасность" />
            <Row>
              <div className="flex-grow">
                <h4 className="text-[14px] font-medium text-ink">Сменить способ входа</h4>
                <p className="text-[12.5px] text-ink-dim">по коду из SMS</p>
              </div>
              <PLink>→</PLink>
            </Row>
            <Row>
              <button onClick={logout} className="flex-grow text-left">
                <h4 className="text-[14px] font-medium text-status-neg">Выйти из аккаунта</h4>
              </button>
            </Row>
          </PCard>
        </div>
      </div>
    </>
  );
}

function ProfileField({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="mb-[18px]">
      <label className="mb-[7px] block text-[12.5px] text-ink-muted">{label}</label>
      <input
        defaultValue={defaultValue}
        className="w-full rounded-[10px] border border-line-soft bg-bg-2 px-4 py-3 text-[14px] text-ink outline-none focus:border-gold"
      />
    </div>
  );
}
