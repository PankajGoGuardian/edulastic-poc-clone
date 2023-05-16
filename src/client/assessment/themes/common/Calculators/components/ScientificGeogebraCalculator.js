import React, { useEffect } from 'react'
import { GEOGEBRA_VERSION } from '../constants'
import { Calculator } from './styled-components'

const params = {
  id: 'ggbAppletScientific',
  appName: 'scientific',
  width: 800,
  height: 600,
  showToolBar: true,
  borderColor: null,
  showMenuBar: true,
  allowStyleBar: true,
  showAlgebraInput: true,
  enableLabelDrags: false,
  enableShiftDragZoom: true,
  capturingThreshold: null,
  showToolBarHelp: false,
  errorDialogsActive: true,
  showTutorialLink: true,
  showLogging: true,
  useBrowserForJS: false,
}

const containerId = 'geogebra-scientific-calculator'

export const ScientificGeogebraCalculator = () => {
  useEffect(() => {
    const Geogebra = window.GGBApplet
    if (Geogebra) {
      const geogebraScientific = new Geogebra(
        params,
        GEOGEBRA_VERSION,
        containerId
      )
      geogebraScientific.inject(containerId)
    }
  }, [])
  return <Calculator id={containerId} />
}
