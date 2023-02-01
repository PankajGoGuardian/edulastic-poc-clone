import React, { useEffect, useRef } from 'react'
import { Calculator } from './styled-components'

export const BasicDesmosCalculator = () => {
  const desmosBasicRef = useRef()

  useEffect(() => {
    const Desmos = window.Desmos
    if (desmosBasicRef.current && Desmos) {
      Desmos.FourFunctionCalculator(desmosBasicRef.current)
    }
  }, [])

  return <Calculator id="demos-basic-calculator" ref={desmosBasicRef} />
}
