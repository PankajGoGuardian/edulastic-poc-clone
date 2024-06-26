import { useState, useRef } from "react";

/**
 *
 * @param {array} prev
 * @param {array} current
 * @returns {boolean}
 */
function dependenciesCheck(prev, current) {
  for (let i = 0; i < prev.length; i++) {
    if (prev[i] !== current[i]) {
      return false;
    }
  }
  return true;
}

/**
 *
 * @param {Function} callBack
 * @param {array} dependencies
 */
function useInternalEffect(callBack, dependencies) {
  const [prevDep, setPrevDep] = useState(dependencies);
  const firsteRenderRef = useRef(true);

  if (firsteRenderRef.current === true) {
    firsteRenderRef.current = false;
    callBack();
  } else if (!dependenciesCheck(prevDep, dependencies)) {
    callBack();
    setPrevDep(dependencies);
  }
}

export { useInternalEffect };
