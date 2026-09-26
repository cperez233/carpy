import { cn } from "../../lib/cn";

interface CarpyMarkProps {
  className?: string;
  /** Color de ojo y fosa nasal: normalmente el del fondo. */
  cutout?: string;
  /** Muestra la mandarina sobre la cabeza. */
  mandarina?: boolean;
  title?: string;
}

/**
 * Cabeza de capibara de perfil (hocico cuadrado, oreja pequena, ojo alto)
 * con la mandarina en la cabeza. El cuerpo usa `currentColor`.
 */
export function CarpyMark({ className, cutout = "var(--color-paper)", mandarina = true, title }: CarpyMarkProps) {
  return (
    <svg
      viewBox="0 -10 64 54"
      className={cn("shrink-0 overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <path className="carpy-ear" d="M12.2 11.8c-2.2-4.4-.4-8.8 3.2-9.6 3.4-.7 5.8 2.2 5.6 6.8z" />
      <path d="M4 28.4C4 16.4 11.8 7.2 23.6 7.2c8.2 0 14.4 1.6 22.2 4.6C54.6 15.2 60 19.6 60 26.4v3.2C60 35.6 55.2 40 49 40H15.4C9.2 40 4 35.2 4 29.2z" />
      <path d="M29.6 17.4q2.9 2 5.8 0" fill="none" stroke={cutout} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="53.6" y="20.4" width="2.4" height="5.2" rx="1.2" fill={cutout} />
      <path d="M48.6 33.6h5.6" stroke={cutout} strokeWidth="1.8" strokeLinecap="round" />
      {mandarina && (
        <g className="carpy-fruit">
          <circle cx="30" cy="1.6" r="6.4" fill="var(--color-mandarina)" />
          <path d="M30 -4.6c1.6-3 4.8-3.6 6.6-2.6-1.6 1.8-4 2.8-6.6 2.6z" fill="var(--color-reed)" />
        </g>
      )}
    </svg>
  );
}

interface LogoProps {
  className?: string;
  cutout?: string;
}

/** Marca + palabra. Al pasar el puntero, la mandarina da un saltito. */
export function Logo({ className, cutout }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CarpyMark
        className="h-7 w-auto [&_.carpy-fruit]:transition-transform [&_.carpy-fruit]:duration-500 [&_.carpy-fruit]:ease-[var(--ease-calm)] group-hover:[&_.carpy-fruit]:-translate-y-[3px] group-hover:[&_.carpy-fruit]:rotate-[18deg] [&_.carpy-fruit]:[transform-box:fill-box] [&_.carpy-fruit]:[transform-origin:center]"
        cutout={cutout}
      />
      <span className="font-display text-[1.55rem] font-semibold leading-none tracking-[-0.03em]">carpy</span>
    </span>
  );
}
