/* eslint-disable react/prop-types */
import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'

import { isEmpty } from 'lodash'
import { red, green } from '@edulastic/colors'
import { IconCheck, IconClose } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'

import { EDIT } from '../../../constants/constantsForQuestions'

import { Bar, ActiveBar } from '../styled'
import { convertUnitToPx } from '../helpers'

const Bars = ({
  item,
  bars,
  step,
  onPointOver,
  onMouseDown,
  activeIndex,
  view,
  gridParams,
  evaluation,
  deleteMode,
  showAnswer,
}) => {
  const { height, margin, yAxisMin } = gridParams
  const { chart_data = {} } = item
  const { data = [] } = chart_data

  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleMouseAction = (value) => () => {
    if (activeIndex === null) {
      onPointOver(value)
    }
  }

  const handleMouse = (index) => () => {
    handleMouseAction(index)()
    setHoveredIndex(index)
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

  const isHovered = (index) => hoveredIndex === index || activeIndex === index

  const isRenderIcons = !isEmpty(evaluation)

  return (
    <>
      {bars.map((bar, index) => (
        <Fragment key={`bar-${index}`}>
          <rect
            fill="transparent"
            x={bar.posX}
            y={0}
            onMouseEnter={handleMouse(index)}
            onMouseLeave={handleMouse(null)}
            width={step - 2}
            height={height + margin}
            data-cy={`bar-${index}`}
          />
          {showAnswer && isRenderIcons && renderValidationIcons(bar, index)}
          <Bar
            onMouseEnter={handleMouse(index)}
            onMouseLeave={handleMouse(null)}
            onMouseDown={onMouseDown(index)}
            onClick={handleMouse(index)}
            onTouchEnd={handleMouse(null)}
            onTouchStart={onMouseDown(index)}
            x={bar.posX}
            y={bar.posY}
            width={bar.width}
            height={getBarHeight(bar.y)}
          />
          {((view !== EDIT && !data[index]?.notInteractive) ||
            view === EDIT) && (
            <ActiveBar
              // onClick={deleteMode ? () => saveAnswer(index) : () => { }}
              onMouseEnter={handleMouse(index)}
              onMouseLeave={handleMouse(null)}
              onMouseDown={onMouseDown(index)}
              onClick={handleMouse(index)}
              onTouchEnd={handleMouse(null)}
              onTouchStart={onMouseDown(index)}
              x={bar.posX}
              y={bar.posY}
              width={bar.width}
              deleteMode={deleteMode}
              hoverState={isHovered(index)}
              height={isHovered(index) ? 5 : 1}
              data-cy={`activeBar-${index}`}
            />
          )}
        </Fragment>
      ))}
    </>
  )
}

Bars.propTypes = {
  item: PropTypes.object.isRequired,
  bars: PropTypes.array.isRequired,
  onPointOver: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
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
  deleteMode: PropTypes.bool,
}
Bars.defaultProps = {
  deleteMode: false,
}
export default Bars
