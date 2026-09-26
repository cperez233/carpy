import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { buildJsonLd } from "./seo/jsonLd";
import { site } from "./data/site";
import { faqs, services } from "./data/content";
import { activeTeam } from "./data/team";

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export const jsonLd = buildJsonLd();
export { site, faqs, services, activeTeam };
