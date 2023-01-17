import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { IconClose, IconCheck } from '@edulastic/icons'
import { red, green } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'

import {
  EDIT,
  CLEAR,
  CHECK,
  SHOW,
} from '../../../constants/constantsForQuestions'

import { Circle, Cross } from '../styled'

const Points = ({
  item,
  points,
  onPointOver,
  onMouseDown,
  activeIndex,
  view,
  gridParams,
  previewTab,
  evaluation,
}) => {
  const { pointStyle } = gridParams

  const { chart_data = {} } = item
  const { data = [] } = chart_data

  const handleMouseAction = (value) => () => {
    if (activeIndex === null) {
      onPointOver(value)
    }
  }

  const getCrossD = (x, y) =>
    `M ${x - 6},${y - 6} L ${x + 7},${y + 7} M ${x + 7},${y - 6} L ${x - 6},${
      y + 7
    }`

  const renderValidationIcons = (x, y, index) => (
    <g transform={`translate(${x - 6},${y - 24})`}>
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

  const isRenderIcons = !isEmpty(evaluation)

  return (
    <>
      {points.map(
        ({ posX, posY }, index) =>
          ((view !== EDIT && !data[index].notInteractive) || view === EDIT) && (
            <Fragment key={`dot-point-${index}`}>
              {(previewTab === SHOW || previewTab === CHECK) &&
                isRenderIcons &&
                renderValidationIcons(posX, posY, index)}
              {pointStyle === 'cross' ? (
                <Cross
                  key={`cross-${index}`}
                  d={getCrossD(posX, posY)}
                  onMouseEnter={handleMouseAction(index)}
                  onMouseLeave={handleMouseAction(null)}
                  onMouseDown={onMouseDown(index)}
                  data-cy={`cross-${index}`}
                />
              ) : (
                <Circle
                  interactive
                  key={`circle-${index}`}
                  onMouseEnter={handleMouseAction(index)}
                  onClick={handleMouseAction(index)}
                  onMouseLeave={handleMouseAction(null)}
                  onTouchEnd={handleMouseAction(null)}
                  onMouseDown={onMouseDown(index)}
                  onTouchStart={onMouseDown(index)}
                  cx={posX}
                  cy={posY}
                  r={5}
                  data-cy={`circle-${index}`}
                />
              )}
            </Fragment>
          )
      )}
    </>
  )
}

Points.propTypes = {
  item: PropTypes.object.isRequired,
  points: PropTypes.array.isRequired,
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
    pointStyle: PropTypes.string,
  }).isRequired,
  evaluation: PropTypes.object.isRequired,
  previewTab: PropTypes.string,
}

Points.defaultProps = {
  previewTab: CLEAR,
}

export default Points
