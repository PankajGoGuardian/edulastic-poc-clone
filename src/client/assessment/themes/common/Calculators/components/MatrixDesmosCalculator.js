import React, { useEffect, useRef } from 'react'
import * as Sentry from '@sentry/browser'
import { Calculator } from './styled-components'

export const MatrixDesmosCalculator = () => {
  const desmosMatrixRef = useRef()

  useEffect(() => {
    const Desmos = window.Desmos
    if (desmosMatrixRef.current && Desmos) {
      const calculatorInstance = Desmos.MatrixCalculator(
        desmosMatrixRef.current
      )
      return () => {
        calculatorInstance.destroy()
      }
    }
    if (!Desmos) {
      Sentry.captureException(
        new Error('Failed to load matrix calculator library from CDN')
      )
    }
  }, [])

  return <Calculator ref={desmosMatrixRef} />
}
