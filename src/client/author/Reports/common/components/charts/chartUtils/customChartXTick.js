import React, { useLayoutEffect, useRef, useState } from 'react'
import { IconInfo } from '@edulastic/icons'
import { blueButton } from '@edulastic/colors'
import { get, isArray } from 'lodash'
import { Tooltip } from 'recharts'
import { StyledAxisTickText } from '../../../styled'

const EXTERNAL_TAG_PADDING = 2

const interventionsData = [
  {
    _id: '6442caecfd8f7451449779e5',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['homework'],
        subjects: ['Computer Science'],
      },
      target: {
        measureType: 'averageScore',
        metric: '10',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['6442bc6dfd8f7451449779e4'],
    termId: '6380b568070dd1000810a161',
    name: 'Test 111',
    type: 'academic',
    owner: 'Test 111',
    description: 'Test 111',
    startDate: 1682035200000,
    endDate: 1682640000000,
    comment: 'Test 111',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682098924540,
    updatedAt: 1682098924540,
    __v: 0,
    active: 1,
  },
  {
    _id: '6442ad14fd8f7451449779e2',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'averageScore',
        metric: '10',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644264549c2136c892a98089'],
    termId: '6380b568070dd1000810a161',
    name: 'Test 098890',
    type: 'academic',
    startDate: 1682035200000,
    endDate: 1682726400000,
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'FULLY_EXECUTED',
    createdAt: 1682091284342,
    updatedAt: 1682866523619,
    __v: 0,
    baseline: '65.2996326203987',
    current: {
      value: '65.2996326203987',
    },
    active: 1,
  },
  {
    _id: '64429eeb7f602623c5b25a8c',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['quiz'],
        subjects: ['Social Studies'],
      },
      target: {
        measureType: 'averageScore',
        metric: '90',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['64425d13f853353e6423a7d0'],
    termId: '6380b568070dd1000810a161',
    name: 'Test',
    type: 'academic',
    startDate: 1680307200000,
    endDate: 1682035200000,
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682087659851,
    updatedAt: 1682087659851,
    __v: 0,
    active: 1,
  },
  {
    _id: '644292582c5686e429c61857',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Other Subjects'],
      },
      target: {
        measureType: 'minimumScore',
        metric: '89',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644288ccd69bc6d31cec52e1'],
    termId: '6380b568070dd1000810a161',
    name: 'asdad',
    type: 'academic',
    owner: 'asdasd',
    startDate: 1680912000000,
    endDate: 1682035200000,
    comment: 'asdasd',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682084440247,
    updatedAt: 1682084440247,
    __v: 0,
    active: 1,
  },
  {
    _id: '64428e862c5686e429c61856',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'averageScore',
        metric: '90',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644288ccd69bc6d31cec52e1'],
    termId: '6380b568070dd1000810a161',
    name: '9876 Inte',
    type: 'academic',
    startDate: 1677801600000,
    endDate: 1685491200000,
    comment: '9876 Inte',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682083462785,
    updatedAt: 1685000367282,
    __v: 0,
    baseline: '65.2996326203987',
    current: {
      value: '65.4603606516773',
    },
    active: 1,
  },
  {
    _id: '644263c87ce4662a5b081bf3',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'minimumScore',
        metric: '35',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['64425e647ce4662a5b081bf2'],
    termId: '6380b568070dd1000810a161',
    name: 'Sub Intervention for Dev testing goals',
    type: 'academic',
    owner: 'Dhyan',
    description: 'Dev Testing',
    startDate: 1680307200000,
    endDate: 1682294400000,
    comment: 'Attached to goals',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'FULLY_EXECUTED',
    createdAt: 1682072520794,
    updatedAt: 1682605152923,
    __v: 0,
    baseline: '37.9746835443038',
    current: {
      value: '37.9746835443038',
    },
    active: 1,
  },
  {
    _id: '6442571d4ba3006f876b41f5',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'minimumScore',
        metric: '8',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644255c84ba3006f876b41f4'],
    termId: '6380b568070dd1000810a161',
    name: 'new intervention ',
    type: 'academic',
    startDate: 1682035200000,
    endDate: 1682726400000,
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'FULLY_EXECUTED',
    createdAt: 1682069277611,
    updatedAt: 1682866523903,
    __v: 0,
    baseline: '50',
    current: {
      value: '50',
    },
    active: 1,
  },
]

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
    return interventions.filter(({ endDate }) => {
      return endDate < aheadAssessmentDate && endDate > currentAssessmentDate
    })
  }
  return []
}

export const CustomChartXTick = (props) => {
  const {
    x,
    y,
    payload,
    data,
    getXTickText,
    getXTickTagText,
    getXTickFill,
    width,
    fontWeight,
    visibleTicksCount,
  } = props

  const [tooltipVisible, setTooltipVisible] = useState(false)

  const tickWidth = Math.floor(width / visibleTicksCount)
  // console.log({ payload, data })

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

  console.log({
    interventionsGroup,
    currentAssessmentDate,
    aheadAssessmentDate,
  })

  let text = getXTickText ? getXTickText(payload, data) : payload.value
  const fill = getXTickFill ? getXTickFill(payload, data) : 'black'

  const tagText = getXTickTagText ? getXTickTagText(payload, data) : ''

  const handleMouseEnter = () => {
    setTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    setTooltipVisible(false)
  }

  const tagTextRef = useRef(null)
  const [tagWidth, setTagWidth] = useState(0)
  const InformationIcon = () => {
    const componentWidth = 14
    const componentHeight = 14
    const infoIconPosX = x + tickWidth / 2 - componentWidth / 2
    const infoIconPosy = y - componentHeight * 2.5

    console.log({ tooltipVisible })

    return isArray(interventionsGroup) && interventionsGroup.length ? (
      <g
        transform={`translate(${infoIconPosX},${infoIconPosy})`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <IconInfo
          fill={blueButton}
          width={componentWidth}
          height={componentHeight}
        />
        {/* Tooltip */}
        {tooltipVisible && (
          <Tooltip textAnchor="middle" fill="blue">
            {interventionsGroup.map(({ name }) => name).join('\n')}
          </Tooltip>
        )}
      </g>
    ) : null
  }

  useLayoutEffect(() => {
    if (tagTextRef.current) {
      const tagRectWidth = tagTextRef.current.wordsWithComputedWidth[0].width
      setTagWidth(tagRectWidth + EXTERNAL_TAG_PADDING)
    }
  }, [tagText])

  if (text && text.length > 25 && tickWidth < 80) {
    if (text[19] === ' ') text = text.substr(0, 24)
    else text = text.substr(0, 25)
    text += '...'
  }

  if (tickWidth < 80 && text.length > 10) {
    text = `${text.substr(0, 7)}...`
  } else if (tickWidth < 100 && text.length > 15) {
    text = `${text.substr(0, 12)}...`
  } else if (text.length > 20) {
    text = `${text.substr(0, 17)}...`
  }

  return (
    <>
      {/**
       * Todos:
       * Show only when the intervention is available between range
       * Show all the interventions in tooltip
       */}
      <InformationIcon />

      <g transform={`translate(${x},${y})`}>
        <StyledAxisTickText
          textAnchor="middle"
          verticalAnchor="start"
          width={tickWidth}
          fontWeight={fontWeight}
          fill={fill}
        >
          {text}
        </StyledAxisTickText>
        {tagText ? (
          <>
            <rect
              x={-(tagWidth / 2)}
              y={24}
              rx={10}
              width={tagWidth}
              height={20}
              fill="black"
            />
            <StyledAxisTickText
              ref={tagTextRef}
              y={30}
              textAnchor="middle"
              verticalAnchor="start"
              width={tickWidth}
              fontSize="12px"
              fontWeight="bold"
              fill="white"
            >
              {tagText.toUpperCase()}
            </StyledAxisTickText>
          </>
        ) : null}
      </g>
    </>
  )
}

// here we are subtracting tooltipWidth/2
export const calculateXCoordinateOfXAxisToolTip = (
  coordinate,
  xTickToolTipWidth
) => Math.round(coordinate, 3) - xTickToolTipWidth / 2
