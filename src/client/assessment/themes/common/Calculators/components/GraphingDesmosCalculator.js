import { getDesmosConfig } from '@edulastic/common'
import React, { useEffect, useRef } from 'react'
import { Calculator } from './styled-components'

export const GraphingDesmosCalculator = ({ calcMode, schoolState }) => {
  const desmosGraphingRef = useRef()

  useEffect(() => {
    const Desmos = window.Desmos
    if (desmosGraphingRef.current && Desmos) {
      const config = getDesmosConfig(schoolState, calcMode)

      const desmosGraphCalculator = Desmos.GraphingCalculator(
        desmosGraphingRef.current,
        config
      )
      desmosGraphCalculator.setExpression({ dragMode: Desmos.DragModes.XY })

      return () => {
        desmosGraphCalculator.destroy()
      }
    }
  }, [])

  return <Calculator id="demos-basic-calculator" ref={desmosGraphingRef} />
}
