import React, { Fragment } from 'react'
import { lightGrey5, greyThemeDark1 } from '@edulastic/colors'
import { getProgressColor, getProgressTrailColor } from '../../util'
import {
  InfoColumnsDesktop,
  InfoColumnsMobile,
  ProficiencyColumn,
  StyledProgressBar,
  InfoColumnLabel,
  SubmittedColumn,
  ScoreColumn,
  ClassesColumn,
  TimeColumn,
} from '../styled'

const ProgressBars = ({
  isDesktop,
  urlHasUseThis,
  isStudent,
  isAssessment,
  columnStyle,
  data,
  renderExtra,
}) => {
  const ResolvedInfoColumsWrapper = isDesktop
    ? InfoColumnsDesktop
    : InfoColumnsMobile
  if (urlHasUseThis) {
    return (
      <ResolvedInfoColumsWrapper>
        <ProficiencyColumn style={columnStyle} isAssessment={isAssessment}>
          <InfoColumnLabel
            isAssessment={isAssessment}
            textColor={lightGrey5}
            data-testid="proficiency"
          >
            PROFICIENCY
          </InfoColumnLabel>
          {/* TODO: Method to find Progress Percentage */}
          <StyledProgressBar
            strokeWidth={13}
            strokeColor={getProgressColor(data?.value)}
            trailColor={getProgressTrailColor(data?.value)}
            percent={data?.value}
            format={(percent) => (percent ? `${percent}%` : '')}
          />
        </ProficiencyColumn>
        {!isStudent ? (
          <SubmittedColumn style={columnStyle}>
            <InfoColumnLabel
              isAssessment={isAssessment}
              justify="center"
              textColor={lightGrey5}
              data-testid="submitted"
            >
              SUBMITTED
            </InfoColumnLabel>
            <InfoColumnLabel
              textColor={greyThemeDark1}
              padding="4px 0px"
              justify="center"
            >
              {/* TODO: Method to find submissions */}
              {data?.submitted === '-'
                ? data?.submitted
                : `${data?.submitted}%`}
            </InfoColumnLabel>
          </SubmittedColumn>
        ) : (
          <ScoreColumn>
            <InfoColumnLabel
              isAssessment={isAssessment}
              justify="center"
              textColor={lightGrey5}
            >
              SCORE
            </InfoColumnLabel>
            <InfoColumnLabel
              textColor={greyThemeDark1}
              padding="4px 0px"
              justify="center"
            >
              {/* TODO: Method to find sum of scores */}
              {data?.scores >= 0 && data?.maxScore
                ? `${data?.scores}/${data?.maxScore}`
                : '-'}
            </InfoColumnLabel>
          </ScoreColumn>
        )}
        {!isStudent ? (
          <ClassesColumn style={columnStyle}>
            <InfoColumnLabel
              isAssessment={isAssessment}
              justify="center"
              textColor={lightGrey5}
              data-testid="classes"
            >
              CLASSES
            </InfoColumnLabel>
            <InfoColumnLabel
              textColor={greyThemeDark1}
              padding="4px 0px"
              justify="center"
            >
              {/* TODO: Method to find classes */}
              {data?.classes}
            </InfoColumnLabel>
          </ClassesColumn>
        ) : (
          <TimeColumn>
            <InfoColumnLabel
              isAssessment={isAssessment}
              justify="center"
              textColor={lightGrey5}
            >
              TIME SPENT
            </InfoColumnLabel>
            <InfoColumnLabel
              textColor={greyThemeDark1}
              padding="4px 0px"
              justify="center"
            >
              {/* TODO: Method to find Total Time Spent */}
              {data?.timeSpent}
            </InfoColumnLabel>
          </TimeColumn>
        )}
        {renderExtra}
      </ResolvedInfoColumsWrapper>
    )
  }

  if (isAssessment) {
    return <ResolvedInfoColumsWrapper />
  }

  return <></>
}

export default ProgressBars
