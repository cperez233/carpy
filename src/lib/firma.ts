/*!
 * carpy · Diseño y desarrollo: Cristian Pérez · https://cristianperez.me
 * Hecho con editorial-ui (skill de Cristian Pérez).
 */

export const autor = { nombre: "Cristian Pérez", url: "https://cristianperez.me" } as const;

/**
 * Firma invisible: el texto de autoria codificado en caracteres de ancho cero
 * (U+200B = 0, U+200C = 1, entre U+2060). No se ve ni ocupa espacio, pero viaja
 * con el texto si alguien copia el pie de pagina. Es deterministica, asi que el
 * HTML del servidor y el del cliente coinciden.
 */
function zeroWidth(text: string): string {
  const bits = [...new TextEncoder().encode(text)].map((b) => b.toString(2).padStart(8, "0")).join("");
  return "⁠" + bits.replace(/0/g, "​").replace(/1/g, "‌") + "⁠";
}

export const firmaInvisible = zeroWidth(`${autor.nombre} · ${autor.url}`);

/** Lee una firma de ancho cero de vuelta a texto (para comprobar autoria). */
export function leerFirma(text: string): string | null {
  const m = text.match(/⁠([​‌]+)⁠/);
  if (!m) return null;
  const bits = m[1].replace(/​/g, "0").replace(/‌/g, "1");
  const bytes = bits.match(/.{8}/g)!.map((b) => parseInt(b, 2));
  return new TextDecoder().decode(new Uint8Array(bytes));
}
