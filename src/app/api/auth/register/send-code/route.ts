import { NextResponse } from "next/server";
import { EmailVerificationTemplate } from "@/lib/email-template/emailVerification";
import { render } from "@react-email/render";
import { getSupabase } from "@/lib/cs"; // Importar configuración de Supabase
import { Resend } from "resend";
import { randomInt } from "crypto";

// 🔐 Instancia del servicio Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, method = "email" } = await req.json();
    console.log("📨 Solicitud recibida para enviar código a:", email, "vía:", method);

    if (!email || !["email", "sms"].includes(method)) {
      console.warn("⚠️ Parámetros inválidos:", { email, method });
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    // 🔎 Buscar el usuario por email
    const supabase = getSupabase();
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.warn("❌ Usuario no encontrado para email:", email, userError);
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const user_id = user.id;
    console.log("🔍 ID del usuario encontrado:", user_id);

    // 🔢 Generar código de 6 dígitos
    const code = String(randomInt(100000, 999999));
    console.log("🔐 Código generado:", code);

    // 🧹 Eliminar códigos anteriores del mismo tipo
    const { error: deleteError } = await supabase
      .from("verification_codes")
      .delete()
      .eq("user_id", user_id)
      .eq("method", method);
    if (deleteError) {
      console.warn("⚠️ Error al limpiar códigos anteriores:", deleteError);
    } else {
      console.log("🧽 Códigos anteriores eliminados correctamente");
    }

    // 💾 Guardar el nuevo código
    const { error: insertError } = await supabase
      .from("verification_codes")
      .insert([
        {
          user_id,
          code,
          method,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutos
        },
      ]);

    if (insertError) {
      console.error("❌ Error al guardar el código en la BD:", insertError);
      return NextResponse.json({ error: "Error al guardar el código" }, { status: 500 });
    }

    console.log("✅ Código guardado en BD para el usuario:", user_id);

    // ✉️ Enviar el código por correo usando template
    if (method === "email") {
      const emailHtml = await render(
        EmailVerificationTemplate({
          code: code,
          userName: "Usuario",
        }),
        { pretty: true }
      );

      console.log("🧪 HTML generado para el correo:\n", emailHtml);

      try {
        await resend.emails.send({
          from: "noreply@tiendadeportivamurano.cl",
          to: email,
          subject: "Tu código de verificación",
          html: emailHtml,
        });

        console.log("📤 Correo enviado correctamente a:", email);
      } catch (sendErr) {
        console.error("❌ Error al enviar correo con Resend:", sendErr);
        return NextResponse.json({ error: "Error al enviar el correo" }, { status: 500 });
      }
    }

    return NextResponse.json({ message: `Código enviado correctamente a ${email}` }, { status: 200 });

  } catch (error) {
    console.error("🔥 Error inesperado en send-code:", error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}
