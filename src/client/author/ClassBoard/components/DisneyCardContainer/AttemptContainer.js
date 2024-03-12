import React from 'react'
import styled from 'styled-components'
import { round } from 'lodash'
import { testActivityStatus } from '@edulastic/constants'
import { Tooltip } from 'antd'
import {
  StyledParaSSS,
  StyledParaSS,
  StyledRadioBtn as RadioBtn,
  ButtonWrapper,
} from './styled'

const { ABSENT, NOT_STARTED } = testActivityStatus

const AttemptContainer = (props) => {
  const {
    testActivity,
    handleRadioChange,
    selectedStudentAttempts,
    viewResponses,
    t,
    score,
  } = props
  const studentId = testActivity.studentId || testActivity.userId
  const testActivityId = testActivity.testActivityId || testActivity._id
  const status = testActivity.UTASTATUS || testActivity.status

  const notStartedOrAbsent = status === NOT_STARTED || status === ABSENT
  const Attempt = (
    <AttemptDiv
      data-cy="attempt-container"
      className={!notStartedOrAbsent ? 'attempt-container' : ''}
      onClick={(e) => {
        e.stopPropagation()
        if (notStartedOrAbsent) return
        viewResponses(e, studentId, testActivityId, testActivity.number)
      }}
    >
      {notStartedOrAbsent ? (
        <CenteredStyledParaSS>
          -&nbsp;/ {round(testActivity.maxScore, 2) || 0}
        </CenteredStyledParaSS>
      ) : (
        <CenteredStyledParaSS>
          {score(status, testActivity.score)}&nbsp;/{' '}
          {round(testActivity.maxScore, 2) || 0}
        </CenteredStyledParaSS>
      )}
      {notStartedOrAbsent ? (
        <StyledParaSS
          style={{
            fontSize: '12px',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            marginRight: '10px',
          }}
        >
          {status === NOT_STARTED ? `Not Started` : `Absent`}
        </StyledParaSS>
      ) : (
        <StyledParaSSS>
          {testActivity.score > 0
            ? round((testActivity.score / testActivity.maxScore) * 100, 2)
            : 0}
          %
        </StyledParaSSS>
      )}
      <ButtonWrapper>
        <Tooltip title={t('common.selectStudentAttemptTooltipMessage')}>
          <RadioBtn
            key={testActivityId}
            value={testActivityId}
            checked={
              testActivityId === selectedStudentAttempts[studentId] ||
              (!selectedStudentAttempts[studentId] && !testActivity.archived)
            }
            onChange={(e) => {
              handleRadioChange(e, testActivityId)
            }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          />
        </Tooltip>
        <p style={{ fontSize: '12px' }}>Attempt {testActivity?.number || 0}</p>
      </ButtonWrapper>
    </AttemptDiv>
  )

  return Attempt
}

export default AttemptContainer

const AttemptDiv = styled.div`
  text-align: center;
  width: 33%;
  ${StyledParaSSS} {
    margin-left: 0;
  }
`
const CenteredStyledParaSS = styled(StyledParaSS)`
  justify-content: center;
  font-size: 12px;
`
