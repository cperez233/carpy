import type { MouseEvent, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "quiet";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  external?: boolean;
  arrow?: boolean;
}

/**
 * Principal: pastilla de tinta que se llena de mandarina desde abajo al pasar
 * el puntero, con la flecha que sale y vuelve a entrar. Secundario: enlace
 * con subrayado que se dibuja.
 */
export function ButtonLink({ href, children, variant = "primary", className, onClick, external, arrow = true }: ButtonLinkProps) {
  const target = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  if (variant === "quiet") {
    return (
      <a
        href={href}
        onClick={onClick}
        {...target}
        className={cn(
          "group relative inline-flex min-h-12 items-center gap-2 px-1 text-[1rem] font-semibold text-ink transition-transform active:scale-[0.97]",
          className,
        )}
      >
        <span className="relative">
          {children}
          <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-right bg-ink/25" />
          <span className="absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 bg-mandarina transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-x-100" />
        </span>
      </a>
    );
  }
  return (
    <a
      href={href}
      onClick={onClick}
      {...target}
      className={cn(
        "group relative isolate inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-ink px-6 text-[1rem] font-semibold text-paper-2 shadow-raised",
        "transition-[transform,box-shadow] duration-300 ease-[var(--ease-calm)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 translate-y-full rounded-[inherit] bg-mandarina transition-transform duration-500 ease-[var(--ease-calm)] group-hover:translate-y-0"
      />
      <span className="relative transition-colors duration-300 group-hover:text-ink">{children}</span>
      {arrow && (
        <span className="relative inline-flex h-4 w-4 overflow-hidden transition-colors duration-300 group-hover:text-ink" aria-hidden>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-calm)] group-hover:translate-x-full" strokeWidth={2.4} />
          <ArrowRight className="absolute inset-0 h-4 w-4 -translate-x-full transition-transform duration-300 ease-[var(--ease-calm)] group-hover:translate-x-0" strokeWidth={2.4} />
        </span>
      )}
    </a>
  );
}
