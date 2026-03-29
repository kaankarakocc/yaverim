/**
 * /admin/tools/new — Quick tool addition form
 *
 * Generates the TypeScript seed entry to copy-paste into data/seed/tools.ts
 * until the DB layer is live. Once Prisma is connected, this form will write
 * directly to the Tool table instead.
 */
import type { Metadata } from "next";
import { NewToolFormClient } from "./NewToolFormClient";

export const metadata: Metadata = {
  title: "Admin — Yeni Araç Ekle",
  robots: { index: false, follow: false },
};

export default function NewToolPage() {
  return <NewToolFormClient />;
}
