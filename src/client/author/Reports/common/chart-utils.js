import { setProperties, tooltipParams } from './util'

const { spaceForLittleTriangle } = tooltipParams

export const updateTooltipPos = (
  parentContainerRef,
  chartRef,
  tooltipRef,
  setTooltipType
) => {
  const tooltipElement = tooltipRef.current?.tooltipElementRef.current
  if (!tooltipElement) return

  const chartState = chartRef.current?.state
  if (!chartState) return

  const { width } = chartRef.current.props
  const idx = chartState.activeTooltipIndex
  const chartItems = chartState.formatedGraphicalItems
  const barchartLayer = chartItems?.[0]
  const activePoint = barchartLayer?.props?.points?.[idx]
  if (!activePoint) return

  const tooltipRect = tooltipElement.getBoundingClientRect()
  const OFFSET = 20
  const isTooltipOverflowing =
    tooltipRect.width + activePoint.x + OFFSET > width

  setTooltipType(isTooltipOverflowing ? 'left' : 'right')
  const tooltipXShift = isTooltipOverflowing
    ? `-100% - ${spaceForLittleTriangle}px - ${OFFSET}px`
    : `${spaceForLittleTriangle}px + ${OFFSET}px`
  const tooltipCssVars = {
    '--tooltip-transform': `translate(
      calc( ${activePoint.x}px + ${tooltipXShift}),
      calc( ${activePoint.y}px - 50% )`,
    '--tooltip-top': '0',
    '--tooltip-left': '0',
  }
  setProperties(parentContainerRef, tooltipCssVars)
}
