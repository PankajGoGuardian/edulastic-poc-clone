import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { red, green } from '@edulastic/colors'
import { IconCheck, IconClose } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'

import { CLEAR, CHECK, SHOW } from '../../../constants/constantsForQuestions'

import { Bar, Text } from '../styled'
import { convertUnitToPx } from '../helpers'
import { SHOW_ALWAYS, SHOW_BY_HOVER } from '../const'

const Colors = [
  '#587C02',
  '#F25515',
  '#FBDEAD',
  '#5AD81C',
  '#A84A08',
  '#02952b',
  '#5EB950',
  '#6494BF',
  '#C852BE',
  '#F325A1',
]

const HoverColors = [
  '#416102',
  '#c54715',
  '#c3a889',
  '#4cae1a',
  '#904108',
  '#025F1C',
  '#499846',
  '#5179a2',
  '#99408f',
  '#bd1f7c',
]

const Hists = ({
  item,
  bars,
  gridParams,
  previewTab,
  evaluation,
  deleteMode,
  saveAnswer,
  onMouseEnterBar,
  activeIndex,
}) => {
  const { margin, yAxisMin, height, multicolorBars } = gridParams
  const { chart_data = {} } = item
  const { data = [] } = chart_data

  const handleMouseEnter = (index) => () => {
    onMouseEnterBar(index)
  }

  const renderValidationIcons = (bar, index) => (
    <g
      transform={`translate(${bar.posX + bar.width / 2 - 6},${bar.posY - 30})`}
    >
      <EduIf condition={evaluation[index]}>
        <IconCheck
          color={green}
          width={12}
          height={12}
          aria-label=", Correct answer"
        />
      </EduIf>
      <EduIf condition={!evaluation[index]}>
        <IconClose
          color={red}
          width={12}
          height={12}
          aria-label=", Incorrect answer"
        />
      </EduIf>
    </g>
  )

  const getBarHeight = (y) =>
    Math.abs(
      convertUnitToPx(yAxisMin, gridParams) - convertUnitToPx(y, gridParams)
    )

  const isHovered = (index) => activeIndex === index

  const getColorForIndex = (index) => {
    if (isHovered(index)) {
      return HoverColors[index % 10]
    }
    if (multicolorBars) {
      return Colors[index % 10]
    }
    return null
  }

  const labelIsVisible = (index) =>
    data[index] &&
    ((data[index].labelVisibility === SHOW_BY_HOVER && activeIndex === index) ||
      data[index].labelVisibility === SHOW_ALWAYS ||
      !data[index].labelVisibility)

  const isRenderIcons = !isEmpty(evaluation)

  return bars.map((bar, index) => (
    <Fragment key={`bar-${index}`}>
      <rect
        fill="transparent"
        x={bar.posX}
        y={0}
        width={bar.width}
        height={height + margin}
        onMouseEnter={handleMouseEnter(index)}
        onTouchStart={handleMouseEnter(index)}
      />
      {(previewTab === SHOW || previewTab === CHECK) &&
        isRenderIcons &&
        renderValidationIcons(bar, index)}
      <Bar
        onClick={deleteMode ? () => saveAnswer(index) : () => {}}
        onMouseEnter={handleMouseEnter(index)}
        onTouchStart={handleMouseEnter(index)}
        x={bar.posX}
        y={bar.posY}
        width={bar.width}
        height={getBarHeight(bar.y)}
        color={getColorForIndex(index)}
        data-cy="bar"
      />
      {labelIsVisible(index) && (
        <Text
          textAnchor="middle"
          verticalAnchor="start"
          x={bar.posX + bar.width / 2}
          y={height}
          width={70}
          data-cy={`barLabelName-${index}`}
        >
          {bar.x}
        </Text>
      )}
    </Fragment>
  ))
}

Hists.propTypes = {
  item: PropTypes.object.isRequired,
  bars: PropTypes.array.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number,
    multicolorBars: PropTypes.bool,
  }).isRequired,
  evaluation: PropTypes.object.isRequired,
  previewTab: PropTypes.string,
  saveAnswer: PropTypes.func,
  deleteMode: PropTypes.bool,
}
Hists.defaultProps = {
  previewTab: CLEAR,
  saveAnswer: () => {},
  deleteMode: false,
}
export default Hists
