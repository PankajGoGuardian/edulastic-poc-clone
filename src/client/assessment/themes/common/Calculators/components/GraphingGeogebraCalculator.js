import React, { useEffect } from 'react'
import { GEOGEBRA_VERSION } from '../constants'
import { Calculator } from './styled-components'

const params = {
  id: 'ggbAppletGraphing',
  appName: 'graphing',
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
const containerId = 'geogebra-graphing-calculator'

export const GraphingGeogebraCalculator = () => {
  useEffect(() => {
    const GGBApplet = window.GGBApplet
    if (GGBApplet) {
      const geogebraGraphing = new GGBApplet(
        params,
        GEOGEBRA_VERSION,
        containerId
      )
      geogebraGraphing.inject(containerId)
    }
  }, [])
  return <Calculator id={containerId} />
}
