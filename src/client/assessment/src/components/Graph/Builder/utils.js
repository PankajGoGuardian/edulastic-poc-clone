import { CONSTANT } from './config';
import Point from './elements/Point';
import { defaultConfig as lineConfig } from './elements/Line';
import { default as rayConfig } from './elements/Ray';
import { default as segmentConfig } from './elements/Segment';
import { default as vectorConfig } from './elements/Vector';
import Polygon from './elements/Polygon';
import { JXG } from './index';

function compareKeys(config, props) {
  return Object.keys(config).every(k => !!props[k] === !!config[k]);
}

export function getLineTypeByProp(props) {
  if (compareKeys(lineConfig, props)) {
    return CONSTANT.TOOLS.LINE;
  }
  if (compareKeys(rayConfig, props)) {
    return CONSTANT.TOOLS.RAY;
  }
  if (compareKeys(segmentConfig, props)) {
    return CONSTANT.TOOLS.SEGMENT;
  }
  if (compareKeys(vectorConfig, props)) {
    return CONSTANT.TOOLS.VECTOR;
  }
  throw new Error('Unknown line', props);
}

export function getPropsByLineType(type) {
  switch (type) {
    case 'line':
      return lineConfig;
    case 'ray':
      return rayConfig;
    case 'segment':
      return segmentConfig;
    case 'vector':
      return vectorConfig;
    default:
      throw new Error('Unknown line type:', type);
  }
}

export function updatePointParameters(elements, attr, isSwitchToGrid) {
  for (const el of elements) {
    if (el.type === JXG.OBJECT_TYPE_POINT) {
      el.setAttribute(attr);
      if (isSwitchToGrid) {
        el.setPositionDirectly(JXG.COORDS_BY_USER, Point.roundCoords(el.coords.usrCoords));
      }
    } else {
      updatePointParameters(Object.values(el.ancestors), attr, isSwitchToGrid);
    }
  }
}

export function updateAxe(line, parameters, axe) {
  if ('ticksDistance' in parameters) {
    line.ticks[0].setAttribute({ ticksDistance: parameters.ticksDistance });
  }
  if ('showTicks' in parameters) {
    line.ticks[0].setAttribute({ majorHeight: parameters.showTicks ? 15 : 0 });
  }
  if ('drawLabels' in parameters) {
    line.ticks[0].setAttribute({ drawLabels: parameters.drawLabels });
  }
  if ('name' in parameters && line.name !== parameters.name) {
    if (!parameters.name) {
      line.setAttribute({ withLabel: false, name: '' });
    } else {
      line.setAttribute({ withLabel: true, name: parameters.name });
    }
  }
  if ('minArrow' in parameters || 'maxArrow' in parameters) {
    line.setArrow(
      parameters.minArrow === true ? { size: 8 } : false,
      parameters.maxArrow === true ? { size: 8 } : false,
    );
  }
  if ('commaInLabel' in parameters) {
    line.ticks[0].generateLabelText = tickLabel(axe, parameters.commaInLabel);
  }
  if ('drawZero' in parameters) {
    line.ticks[0].setAttribute({ drawZero: parameters.drawZero });
  }
}

export function updateGrid(grids, parameters) {
  if (grids[0]) {
    grids[0].setAttribute(parameters);
  }
}

function numberWithCommas(x) {
  x = x.toString();
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) { x = x.replace(pattern, '$1,$2'); }
  return x;
}

export function tickLabel(axe, withComma = true, distance = 0) {
  return (coords) => {
    const label = axe === 'x' ? coords.usrCoords[1] : coords.usrCoords[2];
    if (axe === 'x' && label === 0) {
      // offset fix for zero label
      return '0&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;&#xA0;';
    }
    return withComma ? numberWithCommas(label.toFixed(distance)) : label;
  };
}

/**
 *
 * @param {object} boardParameters
 * @param {object} image
 * @requires Array [[left corner] ,[W,H]]
 */
export function getImageCoordsByPercent(boardParameters, bgImageParameters) {
  const { graphParameters } = boardParameters;
  const { size, coords } = bgImageParameters;
  const xSize = Math.abs(graphParameters.xMin) + Math.abs(graphParameters.xMax);
  const ySize = Math.abs(graphParameters.yMin) + Math.abs(graphParameters.yMax);
  const imageSize = [
    Math.round(xSize / 100 * size[0]),
    Math.round(ySize / 100 * size[1])
  ];
  const leftCorner = [
    coords[0] - (imageSize[0] / 2),
    coords[1] - (imageSize[1] / 2)
  ];
  return [
    leftCorner,
    imageSize
  ];
}

export function flatConfig(config, acc = {}, isSub = false) {
  return config.reduce((acc, element) => {
    const { id, type, points } = element;
    if (type === CONSTANT.TOOLS.POINT) {
      if (!acc[id]) {
        acc[id] = element;
      }
      if (isSub) {
        acc[id].subElement = true;
      }
      return acc;
    }
    acc[id] = {
      type,
      _type: element._type,
      id: element.id,
      label: element.label
    };
    if (type !== CONSTANT.TOOLS.POLYGON) {
      acc[id].subElementsIds = {
        startPoint: points[0].id,
        endPoint: points[1].id
      };
    } else {
      acc[id].subElementsIds = Polygon.flatConfigPoints(points);
    }
    return flatConfig(points, acc, true);
  }, acc);
}

function getPointsFromFlatConfig(type, pointIds, config) {
  switch (type) {
    case CONSTANT.TOOLS.POLYGON:
      return (Object.keys(pointIds))
        .sort()
        .map(k => config.find(element => element.id === pointIds[k]));
    default:
      return [
        config.find(element => element.id === pointIds.startPoint),
        config.find(element => element.id === pointIds.endPoint)
      ];
  }
}

export function flat2nestedConfig(config) {
  return Object.values(config.reduce((acc, element) => {
    const { id, type, subElement = false } = element;
    if (!acc[id] && !subElement) {
      acc[id] = {
        id,
        type,
        _type: element._type,
        colors: element.colors,
        label: element.label
      };
      if (type === CONSTANT.TOOLS.POINT) {
        acc[id].x = element.x;
        acc[id].y = element.y;
      } else {
        acc[id].points = getPointsFromFlatConfig(type, element.subElementsIds, config);
      }
    }
    return acc;
  }, {}));
}

export default getLineTypeByProp;
