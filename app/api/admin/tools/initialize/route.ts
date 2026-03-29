/**
 * POST /api/admin/tools/initialize
 *
 * One-time migration: writes data/seed/tools.ts → data/tools.json.
 * After this runs successfully, data/seed/tools.ts becomes dead code.
 * Safe to call again (re-seeds from scratch, overwrites existing JSON).
 *
 * Protected by the same /admin/** middleware guard.
 */
import { NextResponse }         from "next/server";
import { TOOLS }                from "@/data/seed/tools";
import { initializeFromSeed, isInitialized } from "@/lib/tools/store";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const alreadyDone = isInitialized();
    const { count }   = initializeFromSeed(TOOLS);

    return NextResponse.json({
      success: true,
      count,
      message: alreadyDone
        ? `data/tools.json güncellendi — ${count} araç.`
        : `data/tools.json oluşturuldu — ${count} araç seed'den aktarıldı.`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    initialized: isInitialized(),
    message: isInitialized()
      ? "tools.json mevcut ve kullanılıyor."
      : "tools.json bulunamadı. POST /api/admin/tools/initialize ile migrate et.",
  });
}
