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

## Estructura

```
src/
  data/        site.ts (contacto, dominio) · content.ts (servicios, proceso, compromisos, tipos de solicitud, FAQ) · team.ts
  components/
    brand/     CarpyMark (logo con mandarina) · CapyScene (ilustración del hero: los problemas bajan por el río y salen resueltos)
    ui/        ButtonLink · SectionLabel · SplitWords
    layout/    Navbar · Footer
    sections/
      hero/Hero · services/Services + ServiceVisuals (una demo por servicio) · ui/Current (el río de palabras) · ui/MandarinaToggle · Process (río con el capibara)
      team/Team + TeamCard · Faq · contact/Contact + ContactForm (con vista previa del mensaje)
```

## Dónde se edita
- `src/data/site.ts`: dominio, correo, WhatsApp, agenda, endpoint del formulario. Revisa los `[COMPLETAR]`.
- `src/data/content.ts`: servicios, pasos, compromisos (`promises`), tipos de solicitud y preguntas frecuentes.
- `src/data/team.ts`: equipo. Para publicar a Jorge o Javier G.: completa sus datos, pon su foto en
  `public/team/<id>.webp` (4:5, 800x1000) y cambia `isActive` a `true`. La grilla pasa sola de tarjeta
  ancha (1 persona) a 2 o 3 columnas.

El inventario, el registro de eventos y el informe (procesos, seguridad, costos y código) son demostraciones sobre negocios ficticios (dicen "ejemplo"
en pantalla).

Versiones anteriores respaldadas en `../carpy-v1-salvia/` (salvia claro) y `../carpy-v3-consola/` (consola oscura).
