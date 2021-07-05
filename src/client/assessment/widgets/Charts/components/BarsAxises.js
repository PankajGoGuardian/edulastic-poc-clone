import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Line, Tick, VxText } from '../styled'
import { SHOW_ALWAYS, SHOW_BY_HOVER } from '../const'

const BarsAxises = ({
  bars,
  gridParams,
  displayAxisLabel,
  displayGridlines,
  active,
}) => {
  const { height, margin, showTicks } = gridParams

  const labelIsVisible = (index) =>
    bars[index] &&
    ((bars[index].labelVisibility === SHOW_BY_HOVER && active === index) ||
      bars[index].labelVisibility === SHOW_ALWAYS ||
      !bars[index].labelVisibility)

  const y2 = height - margin / 2

  const xOffsets = useMemo(() => {
    return bars.map((_bar) => _bar.posX + _bar.width / 2)
  }, [bars])

  return (
    <g>
      {bars.map((bar, index) => (
        <Fragment key={`bar-axis-${index}`}>
          {displayAxisLabel && (
            <g transform={`translate(${xOffsets[index]}, ${height})`}>
              {labelIsVisible(index) && (
                <VxText textAnchor="middle" verticalAnchor="start" width={70}>
                  {bar.x}
                </VxText>
              )}
            </g>
          )}
          {displayGridlines && (
            <Line
              x1={xOffsets[index]}
              y1={margin}
              x2={xOffsets[index]}
              y2={y2}
              strokeWidth={2}
            />
          )}
          {showTicks && (
            <Tick
              x1={xOffsets[index]}
              y1={y2 - 10}
              x2={xOffsets[index]}
              y2={y2 + 10}
              strokeWidth={2}
            />
          )}
        </Fragment>
      ))}
    </g>
  )
}

BarsAxises.propTypes = {
  bars: PropTypes.array.isRequired,
  gridParams: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.number,
    yAxisMax: PropTypes.number,
    yAxisMin: PropTypes.number,
    stepSize: PropTypes.number,
    snapTo: PropTypes.number,
  }).isRequired,
  displayAxisLabel: PropTypes.bool,
  displayGridlines: PropTypes.bool,
}

BarsAxises.defaultProps = {
  displayAxisLabel: true,
  displayGridlines: true,
}

export default BarsAxises
