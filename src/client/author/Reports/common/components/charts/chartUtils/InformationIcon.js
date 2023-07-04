import { blueButton } from '@edulastic/colors'
import { IconInfo } from '@edulastic/icons'
import { List } from 'antd'
import { get, isArray } from 'lodash'
import React from 'react'
import { InterventionTooltipContainer } from '../styled-components'

const getInterventionsGroup = (
  currentAssessmentDate,
  aheadAssessmentDate,
  interventions
) => {
  if (
    isArray(interventions) &&
    interventions.length &&
    currentAssessmentDate &&
    aheadAssessmentDate
  ) {
    const order =
      aheadAssessmentDate > currentAssessmentDate ? 'ascend' : 'descend'
    return interventions.filter(({ endDate }) => {
      if (order === 'ascend') {
        return endDate < aheadAssessmentDate && endDate > currentAssessmentDate
      }
      return endDate < currentAssessmentDate && endDate > aheadAssessmentDate
    })
  }
  return []
}

const InformationIcon = ({
  x,
  y,
  data,
  payload,
  setXAxisTickTooltipData,
  interventionsData,
  width,
  visibleTicksCount,
  isAttendanceSummary,
}) => {
  const iconWidth = 16
  const iconHeight = 16
  const _visibleTicksCount = isAttendanceSummary
    ? visibleTicksCount - 1
    : visibleTicksCount
  const widthBetweenCoords = width / _visibleTicksCount
  const offset = widthBetweenCoords / 2
  const positionFromYaxis = x - iconWidth / 2 + offset
  const infoIconPosy = y - 35

  const { assessmentDate: currentAssessmentDate } = get(
    data,
    [payload.index],
    {}
  )

  const { assessmentDate: aheadAssessmentDate } = get(
    data,
    [payload.index + 1],
    {}
  )

  const interventionsGroup = getInterventionsGroup(
    currentAssessmentDate,
    aheadAssessmentDate,
    interventionsData
  )

  const handleMouseEnter = (e) => {
    const posX = positionFromYaxis - 100
    const posY = infoIconPosy + 70

    e.stopPropagation()
    setXAxisTickTooltipData({
      visibility: 'visible',
      x: `${posX}px`,
      y: `${posY}px`,
      content: (
        <List
          size="small"
          dataSource={interventionsGroup}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <InterventionTooltipContainer
                    flexDirection="column"
                    padding="0 10px"
                    alignItems="flex-start"
                    justifyContent="center"
                  >
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </InterventionTooltipContainer>
                }
              />
            </List.Item>
          )}
        />
      ),
    })
  }

  const handleMouseLeave = (e) => {
    e.stopPropagation()
    setXAxisTickTooltipData({
      visibility: 'hidden',
      x: null,
      y: null,
      content: null,
    })
  }

  return isArray(interventionsGroup) && interventionsGroup.length ? (
    <g
      transform={`translate(${positionFromYaxis},${infoIconPosy})`}
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseLeave}
    >
      <foreignObject width={iconWidth} height={iconHeight} pointerEvents="auto">
        <IconInfo
          fill={blueButton}
          width={iconWidth}
          height={iconHeight}
          style={{ backgroundColor: '#fff' }}
        />
      </foreignObject>
    </g>
  ) : null
}

export default InformationIcon
