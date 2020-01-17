import { useEffect, useRef } from "react";

/**
 *  This custom hook prevents the page scroll on drag in touch devices
 *  @returns {React.MutableRefObject<Object>}
 */
const useDisableDragScroll = () => {
  const targetRef = useRef();

  useEffect(() => {
    const preventDefault = e => e.preventDefault();
    targetRef.current.addEventListener("touchmove", preventDefault, { passive: false });
    return () => targetRef.current.removeEventListener("touchmove", preventDefault);
  }, []);

  return targetRef;
};

export default useDisableDragScroll;
