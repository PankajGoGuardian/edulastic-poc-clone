import React, { useEffect, useRef } from 'react'
import { Calculator } from './styled-components'

export const ScientificDesmosCalculator = () => {
  const desmosScientificRef = useRef()

  useEffect(() => {
    const Desmos = window.Desmos
    if (desmosScientificRef.current && Desmos) {
      Desmos.ScientificCalculator(desmosScientificRef.current, {
        degreeMode: true,
      })
    }
  }, [])

  return (
    <Calculator id="demos-scientific-calculator" ref={desmosScientificRef} />
  )
}
