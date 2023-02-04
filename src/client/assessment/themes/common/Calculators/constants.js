import { test as testConstants } from '@edulastic/constants'

const { calculators } = testConstants

const getCalcLabelMap = () => {
  const calcLabelMap = {}
  Object.keys(calculators).forEach((key) => {
    const { id, text } = calculators[key]
    if (id.includes('GRAPHING')) {
      calcLabelMap[id] = 'Graphing'
    } else {
      calcLabelMap[id] = text
    }
  })
  return calcLabelMap
}

export const CALC_LABEL_MAP = getCalcLabelMap()

export const DESMOS_GRAPHING_CALC_TYPES = [
  calculators.GRAPHING.id,
  calculators.GRAPHING_STATE.id,
]

export const DESMOS_CALC_PROVIDER = 'DESMOS'
export const EDU_CALC_PROVIDER = 'EDULASTIC'
export const SCIENTIFIC_TYPE = 'SCIENTIFIC'

export const CALC_MODES = {
  BASIC_DESMOS: 'BASIC_DESMOS',
  SCIENTIFIC_DESMOS: 'SCIENTIFIC_DESMOS',
  GRAPHING_DESMOS: 'GRAPHING_DESMOS',
  GRAPHING_STATE_DESMOS: 'GRAPHING_STATE_DESMOS',
  BASIC_EDULASTIC: 'BASIC_EDULASTIC',
  SCIENTIFIC_EDULASTIC: 'SCIENTIFIC_EDULASTIC',
  GRAPHING_GEOGEBRASCIENTIFIC: 'GRAPHING_GEOGEBRASCIENTIFIC',
  SCIENTIFIC_GEOGEBRASCIENTIFIC: 'SCIENTIFIC_GEOGEBRASCIENTIFIC',
}

export const RND_PROPS = {
  defaultProps: { x: 0, y: 0, width: 350, height: 500 },
  [CALC_MODES.BASIC_DESMOS]: { x: 0, y: 0, width: 350, height: 500 },
  [CALC_MODES.SCIENTIFIC_DESMOS]: { x: 0, y: 0, width: 600, height: 500 },
  [CALC_MODES.GRAPHING_DESMOS]: { x: 0, y: 0, width: 600, height: 400 },
  [CALC_MODES.GRAPHING_STATE_DESMOS]: { x: 0, y: 0, width: 600, height: 400 },
  [CALC_MODES.BASIC_EDULASTIC]: { x: 0, y: 0, width: 350, height: 400 },
  [CALC_MODES.SCIENTIFIC_EDULASTIC]: { x: 0, y: 0, width: 500, height: 370 },
  [CALC_MODES.GRAPHING_GEOGEBRASCIENTIFIC]: {
    x: 0,
    y: 0,
    width: 800,
    height: 635,
  },
  [CALC_MODES.SCIENTIFIC_GEOGEBRASCIENTIFIC]: {
    x: 0,
    y: 0,
    width: 800,
    height: 635,
  },
}

export const GEOGEBRA_VERSION = '5.0'
