import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'

import { themeColor, red, green, greyThemeDark4 } from '@edulastic/colors'
import { IconCheck, IconClose } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
import { isEmpty } from 'lodash'

import {
  EDIT,
  CLEAR,
  CHECK,
  SHOW,
} from '../../../constants/constantsForQuestions'

import { Bar, ActiveBar, StrokedRect } from '../styled'
import { convertUnitToPx, getGridVariables } from '../helpers'
import { SHOW_ALWAYS, SHOW_BY_HOVER } from '../const'
import AxisLabel from './AxisLabel'

const Crosses = ({
  item,
  bars,
  onPointOver,
  onMouseDown,
  activeIndex,
  view,
  gridParams,
  previewTab,
  evaluation,
  saveAnswer,
  deleteMode,
}) => {
  const { height, margin, yAxisMin } = gridParams
  const { chart_data = {} } = item
  const { data = [] } = chart_data

  const { yAxisStep, step } = getGridVariables(bars, gridParams, true)

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [showLabel, handleLabelVisibility] = useState(null)

  const handleMouseAction = (value) => () => {
    if (activeIndex === null) {
      onPointOver(value)
    }
  }

  const getCenterX = (index) => step * index

  const getCenterY = (dot) => convertUnitToPx(dot.y, gridParams) + 20

  const renderValidationIcons = (index) => (
    <g
      transform={`translate(${getCenterX(index) + step / 2 - 3},${
        getCenterY(bars[index]) - 30
      })`}
    >
      <EduIf condition={evaluation[index]}>
        <IconCheck
          color={green}
          width={12}
          height={10}
          aria-label=", Correct answer"
        />
      </EduIf>
      <EduIf condition={!evaluation[index]}>
        <IconClose
          color={red}
          width={10}
          height={10}
          aria-label=", Incorrect answer"
        />
      </EduIf>
    </g>
  )

  const handleMouse = (index) => () => {
    handleMouseAction(index)()
    setHoveredIndex(index)
    handleLabelVisibility(index)
  }

  const getBarHeight = (y) =>
    Math.abs(
      convertUnitToPx(yAxisMin, gridParams) - convertUnitToPx(y, gridParams)
    )

  const isHovered = (index) => hoveredIndex === index || activeIndex === index

  const labelIsVisible = (index) =>
    data[index] &&
    ((data[index].labelVisibility === SHOW_BY_HOVER && showLabel === index) ||
      data[index].labelVisibility === SHOW_ALWAYS ||
      !data[index].labelVisibility)

  const isRenderIcons = !isEmpty(evaluation)

  return (
    <>
      {bars.map((dot, index) => (
        <Fragment key={`bar-${index}`}>
          <rect
            fill="transparent"
            stroke="transparent"
            x={getCenterX(index)}
            y={0}
            onMouseEnter={() => handleLabelVisibility(index)}
            onMouseLeave={() => handleLabelVisibility(null)}
            width={step}
            height={height + margin}
          />
          {(previewTab === SHOW || previewTab === CHECK) &&
            isRenderIcons &&
            renderValidationIcons(index)}
          {Array.from({ length: dot.y }).map((a, ind) => (
            <path
              key={`path-${ind}`}
              transform={`translate(${getCenterX(index) + step / 2 - 4}, ${
                height - margin - 17 - ind * yAxisStep - yAxisStep / 2 + 20
              })`}
              fill={greyThemeDark4}
              d="M8.625,0.707106781 L5.75,3.58210678 L2.875,0.707106781 L0.707106781,2.875 L3.58210678,5.75 L0.707106781,8.625 L2.87959354,10.7974868 L5.75,8.00118958 L8.62040646,10.7974868 L10.7928932,8.625 L7.91789322,5.75 L10.7928932,2.875 L8.625,0.707106781 Z"
              data-cy={`bar-${index}cross-${ind}`}
            />
          ))}
          <Bar
            onClick={deleteMode ? () => saveAnswer(index) : () => {}}
            onMouseEnter={() => {
              handleLabelVisibility(index)
              setHoveredIndex(index)
            }}
            onMouseLeave={() => {
              handleLabelVisibility(null)
              setHoveredIndex(null)
            }}
            x={getCenterX(index)}
            y={getCenterY(dot)}
            width={step}
            height={getBarHeight(dot.y)}
            color="transparent"
          />
          {((view !== EDIT && !data[index].notInteractive) ||
            view === EDIT) && (
            <>
              <StrokedRect
                hoverState={isHovered(index)}
                x={getCenterX(index)}
                y={getCenterY(dot)}
                width={step}
                height={getBarHeight(dot.y)}
              />
              <ActiveBar
                onMouseEnter={handleMouse(index)}
                onMouseLeave={handleMouse(null)}
                onMouseDown={onMouseDown(index)}
                onClick={handleMouse(index)}
                onTouchEnd={handleMouse(null)}
                onTouchStart={onMouseDown(index)}
                x={getCenterX(index)}
                y={getCenterY(dot) - 5}
                width={step}
                deleteMode={deleteMode}
                color={dot.y === 0 ? themeColor : 'transparent'}
                hoverState={isHovered(index)}
                height={isHovered(index) ? 5 : 1}
                data-cy={`activeBar-${index}`}
              />
            </>
          )}
          <g
            onMouseEnter={() => handleLabelVisibility(index)}
            onMouseLeave={() => handleLabelVisibility(null)}
            // "height +2" added to hide the fourth line in x-axis label
            transform={`translate(${getCenterX(index) + step / 2}, ${
              height + 2
            })`}
          >
            {labelIsVisible(index) && (
              <AxisLabel
                fractionFormat={data[index].labelFractionFormat}
                value={dot.x}
              />
            )}
          </g>
        </Fragment>
      ))}
    </>
  )
}

Crosses.propTypes = {
  item: PropTypes.object.isRequired,
  bars: PropTypes.array.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  activeIndex: PropTypes.number.isRequired,
  view: PropTypes.string.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number,
  }).isRequired,
  evaluation: PropTypes.object.isRequired,
  previewTab: PropTypes.string,
  saveAnswer: PropTypes.func,
  deleteMode: PropTypes.bool,
}
Crosses.defaultProps = {
  previewTab: CLEAR,
  saveAnswer: () => {},
  deleteMode: false,
}
export default Crosses
