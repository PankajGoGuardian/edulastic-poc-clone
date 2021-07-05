import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import produce from 'immer'
import styled from 'styled-components'
import { useDisableDragScroll } from '@edulastic/common'

import HorizontalLines from './components/HorizontalLines'
import ArrowPair from './components/ArrowPair'
import ValueLabel from './components/ValueLabel'
import withGrid from './HOC/withGrid'
import {
  convertPxToUnit,
  convertUnitToPx,
  displayHorizontalLines,
  displayVerticalLines,
  getGridVariables,
  normalizeTouchEvent,
} from './helpers'
import Bars from './components/Bars'
import BarsAxises from './components/BarsAxises'
import { Line } from './styled'

const BarChart = ({
  item,
  data,
  previewTab,
  saveAnswer,
  gridParams,
  view,
  evaluation,
  disableResponse,
  deleteMode,
  toggleBarDragging,
  showAnswer,
  margin = { top: 0, right: 0, left: 0, bottom: 50 },
}) => {
  const { width, height, margin: gridMargin, showGridlines } = gridParams

  const { padding, step } = getGridVariables(data, gridParams, true)

  const [active, setActive] = useState(null)
  const [activeIndex, setActiveIndex] = useState(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [cursorY, setCursorY] = useState(null)
  const [initY, setInitY] = useState(null)

  const [localData, setLocalData] = useState(data)

  const bars = useMemo(
    () =>
      (localData || []).map((bar, index) => ({
        ...bar,
        posX: step * index + (padding + gridMargin + step * 0.2) / 2,
        posY: convertUnitToPx(bar.y, gridParams) + 20,
        labelVisibility: bar.labelVisibility,
        width: step * 0.8,
      })),
    [localData]
  )

  useEffect(() => {
    if (!isEqual(data, localData)) {
      setLocalData(data)
    }
  }, [data])

  const getPolylinePoints = () =>
    bars
      .map(
        (bar) =>
          `${bar.posX + bar.width / 2},${
            convertUnitToPx(bar.y, gridParams) + 20
          }`
      )
      .join(' ')

  const getActivePoint = (index) =>
    active !== null
      ? +getPolylinePoints().split(' ')[active].split(',')[index]
      : null

  const getActivePointValue = () =>
    active !== null ? +localData[active].y : null

  const getActiveFractionFormat = () =>
    active !== null ? localData[active].labelFractionFormat : 'Decimal'

  const save = () => {
    if (cursorY === null) {
      return
    }
    setCursorY(null)
    setActiveIndex(null)
    setInitY(null)
    setActive(null)
    setIsMouseDown(false)
    toggleBarDragging(false)
    saveAnswer(localData, active)
  }

  const onMouseMove = (e) => {
    if (window.isIOS || window.isMobileDevice) normalizeTouchEvent(e)
    if (isMouseDown && cursorY && !deleteMode) {
      const newPxY = convertUnitToPx(initY, gridParams) + e.pageY - cursorY
      setLocalData(
        produce(localData, (newLocalData) => {
          setLocalData(newLocalData)
          newLocalData[activeIndex].y = convertPxToUnit(newPxY, gridParams)
        })
      )
    }
  }

  const onMouseDown = (index) => (e) => {
    if (window.isIOS || window.isMobileDevice) normalizeTouchEvent(e)
    setCursorY(e.pageY)
    setActiveIndex(index)
    setInitY(localData[index].y)
    setIsMouseDown(true)
    toggleBarDragging(true)
  }

  const onMouseUp = () => {
    save()
  }

  const onMouseLeave = () => {
    save()
  }

  // Decrease svg width as CorrectAnswerContainer's padding(left+right)
  const targetRef = useDisableDragScroll()

  return (
    <div className="__prevent-page-break">
      <StyledSvg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
        ref={targetRef}
      >
        <Line
          x1={24}
          y1={height - gridMargin + 25}
          x2={width}
          y2={height - gridMargin + 25}
          strokeWidth={2}
        />
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <BarsAxises
            bars={bars}
            gridParams={gridParams}
            displayGridlines={displayVerticalLines(showGridlines)}
            active={active}
            step={step}
          />

          <HorizontalLines
            paddingTop={20}
            gridParams={gridParams}
            displayGridlines={displayHorizontalLines(showGridlines)}
          />

          <Bars
            item={item}
            saveAnswer={(i) => saveAnswer(localData, i)}
            deleteMode={deleteMode}
            activeIndex={activeIndex}
            onPointOver={setActive}
            previewTab={previewTab}
            bars={bars}
            step={step}
            view={view}
            onMouseDown={!disableResponse ? onMouseDown : () => {}}
            gridParams={gridParams}
            evaluation={evaluation}
            showAnswer={showAnswer}
          />

          <ArrowPair getActivePoint={getActivePoint} />

          {gridParams.displayPositionOnHover && (
            <ValueLabel
              getActivePoint={getActivePoint}
              getActivePointValue={getActivePointValue}
              getActiveFractionFormat={getActiveFractionFormat}
              active={active}
            />
          )}
        </g>
      </StyledSvg>
    </div>
  )
}

BarChart.propTypes = {
  item: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number,
    showGridlines: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
  disableResponse: PropTypes.bool,
  deleteMode: PropTypes.bool,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  toggleBarDragging: PropTypes.func,
  showAnswer: PropTypes.bool.isRequired,
}

BarChart.defaultProps = {
  disableResponse: false,
  deleteMode: false,
  toggleBarDragging: () => {},
}

export default withGrid(BarChart)

const StyledSvg = styled.svg`
  user-select: none;
  position: relative;
  z-index: 15;
`
