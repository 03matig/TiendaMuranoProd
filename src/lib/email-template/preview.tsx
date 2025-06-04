// src/lib/email-template/preview.ts
// ⚠️ Este archivo es solo para desarrollo y pruebas locales.

require("ts-node").register({
  transpileOnly: true,
  compilerOptions: { module: "commonjs" },
});

const { EmailVerificationTemplate } = require("./emailVerification");
const { render } = require("@react-email/render");
const fs = require("fs");
const path = require("path");

async function main() {
  const html = await render(
    EmailVerificationTemplate({
      code: "123456",
      userName: "Usuario de Prueba"
    })
  );

  const outputPath = path.join(__dirname, "emailPreviewOFICIAL.html");
  fs.writeFileSync(outputPath, html, "utf8");

  console.log("✅ Archivo generado en:", outputPath);
}

main().catch(console.error);
