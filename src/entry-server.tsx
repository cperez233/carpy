import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { buildJsonLd } from "./seo/jsonLd";
import { buildHead } from "./seo/head";
import { site } from "./data/site";
import { activeTeam } from "./data/team";
import { dicts, localePath, localeUrl, locales, type Locale } from "./i18n/locales";

export function render(locale: Locale): string {
  return renderToString(
    <StrictMode>
      <App locale={locale} />
    </StrictMode>,
  );
}

export { buildJsonLd, buildHead, site, activeTeam, dicts, locales, localePath, localeUrl };
