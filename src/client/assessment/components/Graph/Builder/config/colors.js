import {
  white,
  lightBlue9,
  greyThemeDark4,
  fadedGrey1,
  graphTickColor,
} from '@edulastic/colors'
import CONSTANT from './constants'

export default {
  special: {
    [CONSTANT.TOOLS.POINT]: {
      fillColor: white,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: white,
      highlightFillOpacity: 1,
    },
  },
  default: {
    [CONSTANT.TOOLS.POINT]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9,
    },
    [CONSTANT.TOOLS.SEGMENTS_POINT]: {
      fillColor: white,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: white,
    },
    [CONSTANT.TOOLS.LINE]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9,
    },
    [CONSTANT.TOOLS.RAY]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9,
    },
    [CONSTANT.TOOLS.SEGMENT]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9,
    },
    [CONSTANT.TOOLS.VECTOR]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9,
    },
    [CONSTANT.TOOLS.AREA]: {
      fillColor: lightBlue9,
      highlightFillColor: lightBlue9,
    },
    [CONSTANT.TOOLS.AREA2]: {
      fillColor: lightBlue9,
      highlightFillColor: lightBlue9,
    },
  },

  red: {
    [CONSTANT.TOOLS.POINT]: {
      fillColor: '#ee1658',
      strokeColor: '#ee1658',
      highlightStrokeColor: '#ee1658',
      highlightFillColor: '#ee1658',
    },
    [CONSTANT.TOOLS.SEGMENTS_POINT]: {
      fillColor: white,
      strokeColor: '#ee1658',
      highlightStrokeColor: '#ee1658',
      highlightFillColor: white,
    },
    [CONSTANT.TOOLS.LINE]: {
      fillColor: '#ee1658',
      strokeColor: '#ee1658',
      highlightStrokeColor: '#ee1658',
      highlightFillColor: '#ee1658',
    },
    [CONSTANT.TOOLS.RAY]: {
      fillColor: '#ee1658',
      strokeColor: '#ee1658',
      highlightStrokeColor: '#ee1658',
      highlightFillColor: '#ee1658',
    },
    [CONSTANT.TOOLS.SEGMENT]: {
      fillColor: '#ee1658',
      strokeColor: '#ee1658',
      highlightStrokeColor: '#ee1658',
      highlightFillColor: '#ee1658',
    },
    [CONSTANT.TOOLS.VECTOR]: {
      fillColor: '#ee1658',
      strokeColor: '#ee1658',
      highlightStrokeColor: '#ee1658',
      highlightFillColor: '#ee1658',
    },
    [CONSTANT.TOOLS.AREA]: {
      fillColor: '#ee1658',
      highlightFillColor: '#ee1658',
    },
    [CONSTANT.TOOLS.AREA2]: {
      fillColor: '#ee1658',
      highlightFillColor: '#ee1658',
    },
  },
  green: {
    [CONSTANT.TOOLS.POINT]: {
      fillColor: '#1fe3a1',
      strokeColor: '#1fe3a1',
      highlightStrokeColor: '#1fe3a1',
      highlightFillColor: '#1fe3a1',
    },
    [CONSTANT.TOOLS.SEGMENTS_POINT]: {
      fillColor: white,
      strokeColor: '#1fe3a1',
      highlightStrokeColor: '#1fe3a1',
      highlightFillColor: white,
    },
    [CONSTANT.TOOLS.LINE]: {
      fillColor: '#1fe3a1',
      strokeColor: '#1fe3a1',
      highlightStrokeColor: '#1fe3a1',
      highlightFillColor: '#1fe3a1',
    },
    [CONSTANT.TOOLS.RAY]: {
      fillColor: '#1fe3a1',
      strokeColor: '#1fe3a1',
      highlightStrokeColor: '#1fe3a1',
      highlightFillColor: '#1fe3a1',
    },
    [CONSTANT.TOOLS.SEGMENT]: {
      fillColor: '#1fe3a1',
      strokeColor: '#1fe3a1',
      highlightStrokeColor: '#1fe3a1',
      highlightFillColor: '#1fe3a1',
    },
    [CONSTANT.TOOLS.VECTOR]: {
      fillColor: '#1fe3a1',
      strokeColor: '#1fe3a1',
      highlightStrokeColor: '#1fe3a1',
      highlightFillColor: '#1fe3a1',
    },
    [CONSTANT.TOOLS.AREA]: {
      fillColor: '#1fe3a1',
      highlightFillColor: '#1fe3a1',
    },
    [CONSTANT.TOOLS.AREA2]: {
      fillColor: '#1fe3a1',
      highlightFillColor: '#1fe3a1',
    },
  },

  gray: {
    [CONSTANT.TOOLS.POINT]: {
      fillColor: greyThemeDark4,
      strokeColor: greyThemeDark4,
      highlightStrokeColor: greyThemeDark4,
      highlightFillColor: greyThemeDark4,
    },
  },
  numberline: {
    strokeColor: fadedGrey1,
    highlightStrokeColor: fadedGrey1,
    strokeWidth: 2,
  },
  majorTick: {
    strokeColor: fadedGrey1,
    highlightStrokeColor: fadedGrey1,
    strokeWidth: 2,
    majorHeight: 18,
  },
  minorTick: {
    strokeColor: fadedGrey1,
    highlightStrokeColor: fadedGrey1,
    strokeWidth: 2,
    majorHeight: 10,
  },
  tickLabel: {
    color: graphTickColor,
    'font-size': '12px',
    'font-weight': 'bold',
  },
  connectline: {
    strokeColor: graphTickColor,
    highlightStrokeColor: graphTickColor,
  },
}
