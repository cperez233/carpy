import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/instrument-sans";
import "./index.css";
import { App } from "./App";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// En produccion el HTML viene prerenderizado: se hidrata. En desarrollo, se monta.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

// Firma para quien abra la consola.
console.info("%ccarpy%c · diseño y desarrollo: Cristian Pérez · https://cristianperez.me", "font-weight:700;color:#d9772b", "color:inherit");

// Recargar siempre arranca arriba (no se guarda #seccion en la URL).
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
