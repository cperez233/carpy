import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Devuelve un ref y si los bucles deben correr: solo en pantalla, con la
 * pestana visible y sin reduced-motion. El HTML del servidor arranca pausado.
 */
export function useLoopInView<T extends Element>(margin = "120px") {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    let visible = false;
    const update = () => setPlay(visible && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        update();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [reduce, margin]);

  return { ref, play, reduce: Boolean(reduce) };
}
