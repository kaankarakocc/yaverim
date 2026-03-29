import { auth }        from "@/auth";
import { redirect }    from "next/navigation";
import type { Metadata } from "next";
import { AccountDashboard } from "./AccountDashboard";

export const metadata: Metadata = {
  title: "Hesabım",
  description: "Kayıtlı analizlerinizi ve premium planlarınızı yönetin.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  let session;
  try {
    session = await auth();
  } catch {
    redirect("/login?callbackUrl=/account");
  }
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return <AccountDashboard user={session.user} />;
}
