import { useEffect, useRef } from "react";

const useUnload = fn => {
  const cb = useRef();

  useEffect(() => {
    cb.current = fn;
  }, [cb]);

  useEffect(() => {
    const onComponentUnload = () => cb.current();
    window.addEventListener("beforeunload", onComponentUnload);
    return () => window.removeEventListener("beforeunload", onComponentUnload);
  }, []);
};

export default useUnload;
