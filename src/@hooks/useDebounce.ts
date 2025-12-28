import { useEffect, useState } from "react";

function useDebounce(val: string, delay: number) {
  const [debounce, setDebounce] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounce(val);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [val, delay]);
  return debounce;
}

export default useDebounce;
