import React, { useState, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import produce from 'immer'

import { useDisableDragScroll } from '@edulastic/common'

import HorizontalLines from './components/HorizontalLines'
import ValueLabel from './components/ValueLabel'
import withGrid from './HOC/withGrid'
import {
  convertPxToUnit,
  convertUnitToPx,
  getGridVariables,
  displayHorizontalLines,
  displayVerticalLines,
  normalizeTouchEvent,
} from './helpers'
import { EDIT } from '../../constants/constantsForQuestions'
import Hists from './components/Hists'
import BarsAxises from './components/BarsAxises'
import { ActiveBar } from './styled'

const Histogram = ({
  item,
  data,
  previewTab,
  saveAnswer,
  gridParams,
  view,
  evaluation,
  disableResponse,
  toggleBarDragging,
  deleteMode,
  correctAnswerView,
  margin = { top: 0, right: 0, left: 0, bottom: 50 },
}) => {
  const { width, height, margin: gridMargin, showGridlines } = gridParams

  const { padding, step } = getGridVariables(data, gridParams, true)

  const [active, setActive] = useState(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [cursorY, setCursorY] = useState(null)
  const [initY, setInitY] = useState(null)
  const [localData, setLocalData] = useState(data)

  const targetRef = useDisableDragScroll()
  const activeBarRef = useRef()
  const arrowGropRef = useRef()

  useEffect(() => {
    if (!isEqual(data, localData)) {
      setLocalData(data)
    }
  }, [data])

  const bars = useMemo(
    () =>
      (localData || []).map((bar, index) => ({
        ...bar,
        posX: step * index + (padding + gridMargin) / 2,
        posY: convertUnitToPx(bar.y, gridParams) + 20,
        labelVisibility: bar.labelVisibility,
        width: step - 2,
      })),
    [localData]
  )

  const showArrow = useMemo(() => {
    if (active === null || correctAnswerView) {
      return false
    }
    if (view !== EDIT && data[active] && !data[active].notInteractive) {
      return true
    }
    if (view === EDIT) {
      return true
    }
    return false
  }, [active, correctAnswerView, data, view])

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
    active !== null ? localData[active].y : null

  const getActiveFractionFormat = () =>
    active !== null ? localData[active].labelFractionFormat : 'Decimal'

  const save = () => {
    if (cursorY === null) {
      return
    }
    setCursorY(null)
    setInitY(null)
    setIsMouseDown(false)
    toggleBarDragging(false)
    saveAnswer(localData, active)
  }

  const onMouseMove = (e) => {
    if (window.isIOS || window.isMobileDevice) normalizeTouchEvent(e)
    if (isMouseDown && cursorY && !deleteMode && active !== null) {
      const newPxY = convertUnitToPx(initY, gridParams) + e.clientY - cursorY
      setLocalData(
        produce(localData, (newLocalData) => {
          newLocalData[active].y = convertPxToUnit(newPxY, gridParams)
        })
      )
    }

    if (activeBarRef.current && active !== null && targetRef.current) {
      const svgTop = targetRef.current?.getBoundingClientRect()?.top || 0
      const cBar = bars[active]
      const cBarY = e.clientY - svgTop
      if (cBarY - gridMargin > 0 && cBarY <= height - 20 && svgTop > 0) {
        activeBarRef.current.setAttributeNS(null, 'y', cBarY)
        activeBarRef.current.setAttributeNS(null, 'x', cBar.posX)
        activeBarRef.current.setAttributeNS(null, 'width', cBar.width)
        if (arrowGropRef.current) {
          const px = cBar.posX + cBar.width / 2
          const py = cBarY + 2.5
          arrowGropRef.current?.children?.[0]?.setAttributeNS(
            null,
            'd',
            `M ${px},${py + 20} ${px + 8},${py + 10} ${px - 8},${py + 10} Z`
          )
          arrowGropRef.current?.children?.[1]?.setAttributeNS(
            null,
            'd',
            `M ${px},${py - 20} ${px + 8},${py - 10} ${px - 8},${py - 10} Z`
          )
        }
      }
    }
  }

  const onMouseDownActiveBar = (e) => {
    if (correctAnswerView) {
      return
    }
    if (window.isIOS || window.isMobileDevice) normalizeTouchEvent(e)
    const svgTop = targetRef.current?.getBoundingClientRect()?.top || 0
    const cBarY = convertPxToUnit(e.clientY - svgTop - gridMargin, gridParams)
    setLocalData(
      produce(localData, (newLocalData) => {
        newLocalData[active].y = cBarY
      })
    )
    setCursorY(e.clientY)
    setIsMouseDown(true)
    setInitY(cBarY)
  }

  const onMouseUp = () => {
    save()
  }

  const onMouseLeave = () => {
    save()
    setActive(null)
  }

  const onMouseEnterBar = (barIndex) => {
    setActive(barIndex)
  }

  return (
    <svg
      style={{ userSelect: 'none', position: 'relative', zIndex: '15' }}
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchMove={onMouseMove}
      onTouchEnd={onMouseUp}
      ref={targetRef}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <BarsAxises
          lines={data}
          bars={bars}
          gridParams={gridParams}
          displayAxisLabel={false}
          displayGridlines={displayVerticalLines(showGridlines)}
        />

        <HorizontalLines
          paddingTop={20}
          gridParams={gridParams}
          displayGridlines={displayHorizontalLines(showGridlines)}
        />

        <Hists
          item={item}
          saveAnswer={(i) => saveAnswer(localData, i)}
          deleteMode={deleteMode}
          previewTab={previewTab}
          bars={bars}
          evaluation={evaluation}
          gridParams={gridParams}
          activeIndex={active}
          onMouseEnterBar={onMouseEnterBar}
        />

        {showArrow && (
          <ActiveBar
            hoverState
            height={5}
            deleteMode={deleteMode}
            color="#bd1f7c"
            onMouseDown={!disableResponse ? onMouseDownActiveBar : () => {}}
            onTouchStart={!disableResponse ? onMouseDownActiveBar : () => {}}
            ref={activeBarRef}
            data-cy={`activeBar-${active}`}
          />
        )}

        {showArrow && (
          <g ref={arrowGropRef}>
            <path d="" />
            <path d="" />
          </g>
        )}

        {gridParams.displayPositionOnHover && (
          <ValueLabel
            getActivePoint={getActivePoint}
            getActivePointValue={getActivePointValue}
            getActiveFractionFormat={getActiveFractionFormat}
            active={active}
          />
        )}
      </g>
    </svg>
  )
}

Histogram.propTypes = {
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
    showGridlines: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }).isRequired,
  view: PropTypes.string.isRequired,
  disableResponse: PropTypes.bool,
  deleteMode: PropTypes.bool,
  previewTab: PropTypes.string.isRequired,
  evaluation: PropTypes.object.isRequired,
  toggleBarDragging: PropTypes.func,
}

Histogram.defaultProps = {
  disableResponse: false,
  deleteMode: false,
  toggleBarDragging: () => {},
}

export default withGrid(Histogram)
