import { redirect } from "next/navigation";
import { getSession } from "@/lib/modules/auth/session";
import { PortalShell } from "@/components/portal/PortalShell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="ambient min-h-screen">
      <PortalShell userName={session.name}>{children}</PortalShell>
    </div>
  );
}
