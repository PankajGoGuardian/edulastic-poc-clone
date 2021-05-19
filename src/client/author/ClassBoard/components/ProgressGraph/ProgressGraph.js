import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { sumBy, round } from 'lodash'
import { Tooltip } from 'antd'
import { lightGreen4 } from '@edulastic/colors'
import BarGraph from '../BarGraph/BarGraph'
import {
  StyledProgress,
  StyledDiv,
  StyledProgressDiv,
  GraphInfo,
  GraphDescription,
  ProgressBarContainer,
  AssignmentTitle,
} from './styled'

export default class Graph extends Component {
  static propTypes = {
    gradebook: PropTypes.object.isRequired,
    testActivity: PropTypes.object.isRequired,
    onClickHandler: PropTypes.func.isRequired,
  }

  calculateAvgScore = () => {
    const { testActivity: students } = this.props

    if (!students.length) {
      return 0
    }
    const totalScore = sumBy(students, (student) => {
      const { score, maxScore } = student
      return ((score || 0) / (maxScore || 1)) * 100
    })
    return round(totalScore / students.length, 2)
  }

  render() {
    const {
      gradebook,
      onClickHandler,
      testQuestionActivities,
      testActivity,
      title = '',
      isBoth = false,
    } = this.props
    const absentNumber = (testActivity || []).filter(
      (x) => x.status === 'absent'
    ).length
    const percentage = round(gradebook.avgScore * 100)
    return (
      <StyledDiv>
        <ProgressBarContainer>
          <StyledProgressDiv>
            {
              // TODO: need to implement gradient stoke color
            }
            {!!title && (
              <Tooltip title={title}>
                <AssignmentTitle color={lightGreen4}>{title}</AssignmentTitle>
              </Tooltip>
            )}
            <GraphDescription margin="3px 0 0 0" top={title ? '32%' : '25%'}>
              average score
            </GraphDescription>
            <StyledProgress
              marginTop={1}
              className="getProgress"
              strokeLinecap="square"
              type="circle"
              percent={percentage}
              width={167}
              strokeWidth={8}
              strokeColor="#2B7FF0"
              format={(percent) => `${percent}%`}
            />
            <GraphDescription margin="3px 0 0 0" top="67%">
              MEDIAN {gradebook.median}%
            </GraphDescription>
          </StyledProgressDiv>
          <GraphInfo data-cy="submittedSummary">
            {gradebook.submittedNumber} out of {gradebook.total} Submitted
            {absentNumber > 0 && <p>({absentNumber} absent)</p>}
          </GraphInfo>
        </ProgressBarContainer>
        <BarGraph
          gradebook={gradebook}
          testQuestionActivities={testQuestionActivities}
          onClickHandler={onClickHandler}
          isBoth={isBoth}
          isLoading={this.props.isLoading}
        />
      </StyledDiv>
    )
  }
}
