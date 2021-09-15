import styled from 'styled-components'
import Color from 'color'

const getStroke = ({
  stroke,
  selected,
  showAnswer,
  correct,
  theme,
  isEvaluationEmpty,
}) => {
  const selectedStrokeColor = Color(stroke).darken(0.3).string()

  if (showAnswer && selected && isEvaluationEmpty) {
    return selectedStrokeColor
  }

  return showAnswer
    ? correct
      ? theme.widgets.hotspot.svgMapRightStrokeColor
      : theme.widgets.hotspot.intersectStrokeColor
    : selected
    ? selectedStrokeColor
    : stroke
}

const getFill = ({
  fill,
  selected,
  showAnswer,
  correct,
  theme,
  isEvaluationEmpty,
}) => {
  const selectedFillColor = Color(fill).darken(0.3).string()

  if (showAnswer && selected && isEvaluationEmpty) {
    return selectedFillColor
  }

  return showAnswer
    ? correct
      ? theme.widgets.hotspot.svgMapRightFillColor
      : theme.widgets.hotspot.intersectFillColor
    : selected
    ? selectedFillColor
    : fill
}

export const Polygon = styled.polygon`
  fill: ${getFill};
  stroke: ${getStroke};
  stroke-width: ${({ selected }) => (selected ? 4 : 2)}px;
  stroke-opacity: 1;
  stroke-dasharray: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  z-index: ${({ active }) => (active ? 11 : 0)};
  cursor: ${({ intersect }) => (intersect ? 'not-allowed' : 'pointer')};
`
