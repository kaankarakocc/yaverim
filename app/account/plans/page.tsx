import { auth }        from "@/auth";
import { redirect }    from "next/navigation";
import type { Metadata } from "next";
import { PlansPageClient } from "./PlansPageClient";

export const metadata: Metadata = {
  title: "Kayıtlı Planlar",
  description: "Geçmiş analizleriniz ve kayıtlı planlarınız.",
  robots: { index: false, follow: false },
};

export default async function PlansPage() {
  let session;
  try {
    session = await auth();
  } catch {
    redirect("/login?callbackUrl=/account/plans");
  }
  if (!session?.user) redirect("/login?callbackUrl=/account/plans");

  return <PlansPageClient user={session.user} />;
}
