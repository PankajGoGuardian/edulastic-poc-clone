import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { round } from 'lodash'
import { Tooltip } from 'antd'
import { lightGreen4 } from '@edulastic/colors'
import { EduIf, WithResources } from '@edulastic/common'
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
import AppConfig from '../../../../../app-config'

export default class Graph extends Component {
  static propTypes = {
    gradebook: PropTypes.object.isRequired,
    testActivity: PropTypes.object.isRequired,
    onClickHandler: PropTypes.func.isRequired,
  }

  componentDidUpdate() {
    // WEB ACCESSIBILITY FOR PIE CHART.
    if (window.$) {
      const { gradebook } = this.props
      const percentage = round(gradebook.avgScore * 100)
      const jq = window.$
      jq('svg.ant-progress-circle').attr('aria-hidden', false)
      jq('svg.ant-progress-circle').attr(
        'aria-label',
        'average score pie chart'
      )
      jq('path.ant-progress-circle-trail').attr('aria-hidden', true)
      jq('path.ant-progress-circle-path').attr('aria-hidden', false)
      jq('path.ant-progress-circle-path').attr(
        'aria-label',
        `average score is ${percentage}%`
      )
    }
  }

  render() {
    const {
      gradebook,
      onClickHandler,
      testQuestionActivities,
      testActivity,
      title = '',
      isBoth = false,
      isLoading,
    } = this.props
    const absentNumber = (testActivity || []).filter(
      (x) => x.status === 'absent'
    ).length
    const percentage = round(gradebook.avgScore * 100)
    return (
      <WithResources
        resources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
        fallBack={<span />}
      >
        <StyledDiv>
          <ProgressBarContainer>
            <StyledProgressDiv>
              {
                // TODO: need to implement gradient stoke color
              }
              <EduIf condition={!!title}>
                <Tooltip title={title}>
                  <AssignmentTitle color={lightGreen4}>{title}</AssignmentTitle>
                </Tooltip>
              </EduIf>
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
            isLoading={isLoading}
          />
        </StyledDiv>
      </WithResources>
    )
  }
}
