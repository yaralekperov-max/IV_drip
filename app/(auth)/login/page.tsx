import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/modules/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  // Уже вошёл — сразу в кабинет.
  const session = await getSession();
  if (session) redirect("/portal");

  return (
    <div className="ambient min-h-screen">
      <div className="relative z-[1] flex min-h-screen flex-col items-center justify-center px-5 py-16">
        <LoginForm />
        <Link href="/" className="mt-8 text-[13px] text-ink-dim transition-colors hover:text-gold">
          ← На главную
        </Link>
      </div>
    </div>
  );
}
