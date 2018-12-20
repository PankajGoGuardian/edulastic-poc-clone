import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { lightRed, red, svgMapFillColor, svgMapStrokeColor } from '@edulastic/colors';
import { setQuestionDataAction } from '../../../../../../author/src/actions/question';
import { Polygon, Svg, Rect, G, Text } from './styledSvgElements';

const SvgDeleteContainer = React.memo(
  ({ itemData, width, height, imageSrc, setQuestionData, history }) => {
    const [areas, setAreas] = useState([]);

    const [overPolygon, setOverPolygon] = useState(null);

    useEffect(
      () => {
        setAreas(history ? history.areas : []);
      },
      [history]
    );

    const handleMouseOn = i => () => {
      setOverPolygon(i);
    };

    const handleMouseLeave = () => {
      setOverPolygon(null);
    };

    const handleDelete = i => () => {
      setOverPolygon(null);
      setQuestionData({ ...itemData, areas: areas.filter((area, index) => i !== index) });
    };

    return (
      <div id="svg-control-block">
        <Svg width={width} height={height}>
          <image
            href={imageSrc}
            width={width}
            height={height}
            preserveAspectRatio="none"
            x={0}
            y={0}
          />

          {Array.isArray(areas) &&
            areas.length > 0 &&
            areas.map((area, i) => (
              <Polygon
                key={i}
                onClick={handleDelete(i)}
                onMouseEnter={handleMouseOn(i)}
                onMouseLeave={handleMouseLeave}
                fill={i === overPolygon ? `${lightRed}50` : svgMapFillColor}
                stroke={i === overPolygon ? red : svgMapStrokeColor}
                points={area.map(point => `${point.x},${point.y}`).join(' ')}
              />
            ))}

          {Array.isArray(areas) &&
            areas.length > 0 &&
            areas.map((area, i) => (
              <G transform={`translate(${area[0].x},${area[0].y})`}>
                <Rect
                  fill={svgMapStrokeColor}
                  stroke={svgMapStrokeColor}
                  x={0}
                  y={0}
                  rx={4}
                  ry={4}
                  width={40}
                  height={40}
                />
                <Text x={8} y={12} dx={7} dy={11}>
                  {i + 1}
                </Text>
              </G>
            ))}
        </Svg>
      </div>
    );
  }
);

SvgDeleteContainer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  imageSrc: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  itemData: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(
  null,
  { setQuestionData: setQuestionDataAction }
)(SvgDeleteContainer);
