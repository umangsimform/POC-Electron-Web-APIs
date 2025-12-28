import { useEffect, RefObject } from "react";

type Handler = (event: MouseEvent | TouchEvent) => void;

const useOutside = (
  ref: RefObject<HTMLElement>,
  handler: Handler,
  ignoreRef: RefObject<HTMLElement>
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (ignoreRef.current && ignoreRef.current.contains(event.target as Node))
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, ignoreRef]);
};

export default useOutside;
