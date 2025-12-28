import { useEffect, useRef } from "react";

const useScroll = (callback: any) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        callback();
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [callback]);
  return scrollRef;
};

export default useScroll;
