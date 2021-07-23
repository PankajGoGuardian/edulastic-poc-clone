import React from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'
import moment from 'moment'
import BarGraph from './BarGraph'

import {
  GraphContainer,
  ProgressBarContainer,
  BarGraphContainer,
  GraphTitle,
  Progress,
  MessageBox,
  InfoRow,
  Info,
} from './styled'

const ProgressGraph = ({
  testActivity,
  questionActivities,
  testItems,
  onClickBar,
  isGreyBar,
  isCliUser,
  dontRelease = false,
}) => {
  const { score, maxScore, endDate, status } = testActivity
  const scorePercentage = round((score / maxScore) * 100, 2) || 0
  const totalTimeSpent = (questionActivities || []).reduce((total, current) => {
    total += current.timeSpent
    return total
  }, 0)

  const duration = moment.duration(totalTimeSpent)
  const submittedOn = moment(endDate).format('MMM D YYYY / H:mm')
  const h = Math.floor(duration.asHours())
  let m = duration.minutes()
  const s = duration.seconds()
  if (s > 59) {
    m += 1
  }

  const timeSpent = h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`

  return (
    <GraphContainer
      padding="20px"
      justifyContent="flex-start"
      isCliUser={isCliUser}
    >
      {!dontRelease && (
        <ProgressBarContainer style={{ textAlign: isCliUser ? 'center' : '' }}>
          <GraphTitle>Performance Summary</GraphTitle>
          <Progress
            data-cy="attemptPerformance"
            className="getProgress"
            strokeLinecap="square"
            type="circle"
            percent={scorePercentage}
            width={140}
            strokeWidth={8}
            strokeColor={{
              '0%': '#8DB8F3',
              '100%': '#2B7FF0',
            }}
            format={(percent) => `${percent}%`}
          />
          {isCliUser && (
            <Info>
              <InfoRow>
                <label>TIME (MIN)</label>
                <span>{timeSpent}</span>
              </InfoRow>
              <InfoRow>
                <label>SUBMITTED ON</label>
                <span>{submittedOn}</span>
              </InfoRow>
            </Info>
          )}
        </ProgressBarContainer>
      )}
      {isCliUser ? (
        <MessageBox>
          Thanks for helping your teacher get a better picture of what you know
          and what you need to get ready to learn
        </MessageBox>
      ) : (
        <BarGraphContainer>
          <GraphTitle>Performance by Questions</GraphTitle>
          <BarGraph
            questionActivities={questionActivities}
            onClickBar={onClickBar}
            testItems={testItems}
            isGreyBar={isGreyBar}
            testActivityStatus={status}
          />
        </BarGraphContainer>
      )}
    </GraphContainer>
  )
}

ProgressGraph.propTypes = {
  testItems: PropTypes.array.isRequired,
  testActivity: PropTypes.object.isRequired,
  questionActivities: PropTypes.array.isRequired,
  onClickBar: PropTypes.func,
  isGreyBar: PropTypes.bool,
}

ProgressGraph.defaultProps = {
  onClickBar: () => {},
  isGreyBar: false,
}

export default ProgressGraph
