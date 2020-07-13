import { white, lightBlue9, greyThemeDark4, fadedGrey1, graphTickColor } from "@edulastic/colors";
import { TOOLS } from "./constants";

export default {
  special: {
    [TOOLS.POINT]: {
      fillColor: white,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: white,
      highlightFillOpacity: 1
    }
  },
  default: {
    [TOOLS.POINT]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9
    },
    [TOOLS.SEGMENTS_POINT]: {
      fillColor: white,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: white
    },
    [TOOLS.LINE]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9
    },
    [TOOLS.RAY]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9
    },
    [TOOLS.SEGMENT]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9
    },
    [TOOLS.VECTOR]: {
      fillColor: lightBlue9,
      strokeColor: lightBlue9,
      highlightStrokeColor: lightBlue9,
      highlightFillColor: lightBlue9
    },
    [TOOLS.AREA]: {
      fillColor: lightBlue9,
      highlightFillColor: lightBlue9
    }
  },

  red: {
    [TOOLS.POINT]: {
      fillColor: "#ee1658",
      strokeColor: "#ee1658",
      highlightStrokeColor: "#ee1658",
      highlightFillColor: "#ee1658"
    },
    [TOOLS.SEGMENTS_POINT]: {
      fillColor: white,
      strokeColor: "#ee1658",
      highlightStrokeColor: "#ee1658",
      highlightFillColor: white
    },
    [TOOLS.LINE]: {
      fillColor: "#ee1658",
      strokeColor: "#ee1658",
      highlightStrokeColor: "#ee1658",
      highlightFillColor: "#ee1658"
    },
    [TOOLS.RAY]: {
      fillColor: "#ee1658",
      strokeColor: "#ee1658",
      highlightStrokeColor: "#ee1658",
      highlightFillColor: "#ee1658"
    },
    [TOOLS.SEGMENT]: {
      fillColor: "#ee1658",
      strokeColor: "#ee1658",
      highlightStrokeColor: "#ee1658",
      highlightFillColor: "#ee1658"
    },
    [TOOLS.VECTOR]: {
      fillColor: "#ee1658",
      strokeColor: "#ee1658",
      highlightStrokeColor: "#ee1658",
      highlightFillColor: "#ee1658"
    },
    [TOOLS.AREA]: {
      fillColor: "#ee1658",
      highlightFillColor: "#ee1658"
    }
  },
  green: {
    [TOOLS.POINT]: {
      fillColor: "#1fe3a1",
      strokeColor: "#1fe3a1",
      highlightStrokeColor: "#1fe3a1",
      highlightFillColor: "#1fe3a1"
    },
    [TOOLS.SEGMENTS_POINT]: {
      fillColor: white,
      strokeColor: "#1fe3a1",
      highlightStrokeColor: "#1fe3a1",
      highlightFillColor: white
    },
    [TOOLS.LINE]: {
      fillColor: "#1fe3a1",
      strokeColor: "#1fe3a1",
      highlightStrokeColor: "#1fe3a1",
      highlightFillColor: "#1fe3a1"
    },
    [TOOLS.RAY]: {
      fillColor: "#1fe3a1",
      strokeColor: "#1fe3a1",
      highlightStrokeColor: "#1fe3a1",
      highlightFillColor: "#1fe3a1"
    },
    [TOOLS.SEGMENT]: {
      fillColor: "#1fe3a1",
      strokeColor: "#1fe3a1",
      highlightStrokeColor: "#1fe3a1",
      highlightFillColor: "#1fe3a1"
    },
    [TOOLS.VECTOR]: {
      fillColor: "#1fe3a1",
      strokeColor: "#1fe3a1",
      highlightStrokeColor: "#1fe3a1",
      highlightFillColor: "#1fe3a1"
    },
    [TOOLS.AREA]: {
      fillColor: "#1fe3a1",
      highlightFillColor: "#1fe3a1"
    }
  },

  gray: {
    [TOOLS.POINT]: {
      fillColor: greyThemeDark4,
      strokeColor: greyThemeDark4,
      highlightStrokeColor: greyThemeDark4,
      highlightFillColor: greyThemeDark4
    }
  },
  numberline: {
    strokeColor: fadedGrey1,
    highlightStrokeColor: fadedGrey1,
    strokeWidth: 2
  },
  majorTick: {
    strokeColor: fadedGrey1,
    highlightStrokeColor: fadedGrey1,
    strokeWidth: 2,
    majorHeight: 18
  },
  minorTick: {
    strokeColor: fadedGrey1,
    highlightStrokeColor: fadedGrey1,
    strokeWidth: 2,
    majorHeight: 10
  },
  tickLabel: {
    color: graphTickColor,
    "font-size": "12px",
    "font-weight": "bold"
  }
};
