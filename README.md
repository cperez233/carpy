# carpy · landing

React 19 + Vite + Tailwind CSS v4 + Framer Motion, con prerender a HTML estático (SEO y crawlers de IA).
Dirección: un capibara tranquilo en el río. Papel de arcilla (`paper`), tinta de agua honda (`ink`, `river`) y un solo
acento: la mandarina que el capibara lleva en la cabeza. Fraunces (títulos) + Instrument Sans (texto).

```bash
npm install
npm run dev      # http://localhost:5175
npm run build    # typecheck + build + prerender -> dist/
npm run preview  # sirve dist/ en http://localhost:4175
npm run assets   # regenera favicon, íconos, og-image y fotos del equipo
```

## Idiomas

Español en `/` e inglés en `/en`: el prerender escribe `dist/index.html` y `dist/en.html`, cada uno con su `<title>`,
descripción, canonical, `hreflang` y JSON-LD. Un script en el `<head>` detecta el idioma antes de pintar: si la persona
eligió uno en el selector (guardado en `localStorage`), se respeta; si no, un navegador en español queda en `/` y
cualquier otro va a `/en`. Los bots no se redirigen. El selector ES/EN de la barra cambia el idioma sin recargar, con el
río subiendo y el capibara nadando (`LanguageCurtain`); en teléfono está dentro del menú y en el footer hay un enlace
al otro idioma.

## Estructura

```
src/
  i18n/        es.ts · en.ts (textos) · types.ts · locales.ts (rutas) · context.tsx (idioma activo y transición)
  data/        site.ts (contacto, dominio) · content.ts (tipos de los textos) · team.ts
  seo/         head.ts (metadatos, hreflang y detección de idioma) · jsonLd.ts
  components/
    brand/     CarpyMark (logo con mandarina) · CapyScene (ilustración del hero: los problemas bajan por el río y salen resueltos)
    ui/        ButtonLink · SectionLabel · SplitWords · LanguageToggle · LanguageCurtain
    layout/    Navbar · Footer
    sections/
      hero/Hero · services/Services + ServiceVisuals (una demo por servicio) · ui/Current (el río de palabras) · ui/MandarinaToggle · Process (río con el capibara)
      team/Team + TeamCard · Faq · contact/Contact + ContactForm (con vista previa del mensaje)
```

## Dónde se edita
- `src/data/site.ts`: dominio, correo, WhatsApp, agenda, endpoint del formulario. Revisa los `[COMPLETAR]`.
- `src/i18n/es.ts` y `src/i18n/en.ts`: todos los textos (servicios, pasos, compromisos, tipos de solicitud, preguntas
  frecuentes, demos, metadatos). TypeScript avisa si al inglés le falta algo que tiene el español.
- `src/data/team.ts`: equipo (rol, bio y áreas van en `copy.es` y `copy.en`). Para publicar a Jorge o Javier G.: completa sus datos, pon su foto en
  `public/team/<id>.webp` (4:5, 800x1000) y cambia `isActive` a `true`. La grilla pasa sola de tarjeta
  ancha (1 persona) a 2 o 3 columnas.

El inventario, el registro de eventos y el informe (procesos, seguridad, costos y código) son demostraciones sobre negocios ficticios (dicen "ejemplo"
en pantalla).

Versiones anteriores respaldadas en `../carpy-v1-salvia/` (salvia claro) y `../carpy-v3-consola/` (consola oscura).
