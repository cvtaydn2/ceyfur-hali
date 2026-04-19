import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/admin-auth";
import { updateAdminPassword, getPasswordLastUpdated } from "@/lib/admin-settings";
import { writeAuditLog } from "@/lib/audit-log";

export const dynamic = "force-dynamic";

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const lastUpdated = await getPasswordLastUpdated();
    return NextResponse.json({ success: true, lastUpdated });
  } catch (error) {
    console.error("[admin/settings/password] GET hatası:", error);
    return NextResponse.json(
      { success: false, message: "Bilgi alınamadı." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { newPassword, confirmPassword } = await request.json();

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { success: false, message: "Yeni şifre gerekli." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Şifreler eşleşmiyor." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "Şifre en az 8 karakter olmalıdır." },
        { status: 400 }
      );
    }

    await updateAdminPassword(newPassword);

    await writeAuditLog({
      action: "content_update",
      entityType: "auth",
      entityId: "admin_password",
      metadata: { action: "password_changed" },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Şifre başarıyla güncellendi.",
    });
  } catch (error: unknown) {
    console.error("[admin/settings/password] PATCH hatası:", error);
    const message = error instanceof Error ? error.message : "Şifre güncellenemedi.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
