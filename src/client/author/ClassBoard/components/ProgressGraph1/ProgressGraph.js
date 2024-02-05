import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { sumBy, round } from 'lodash'
import BarGraph from '../BarGraph1/BarGraph'
import { StyledDiv } from './styled'
import { fetchAiViewDataRequestAction } from '../../../src/reducers/testActivity'

class Graph extends Component {
  static propTypes = {
    gradebook: PropTypes.object.isRequired,
    testActivity: PropTypes.object.isRequired,
    onClickHandler: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchAiViewDataRequest, gradebook, assignmentId, groupId, testId } = this.props
    fetchAiViewDataRequest({
      assignmentId,
      groupId,
      testId,
    })
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

export default connect(null, {
  fetchAiViewDataRequest: fetchAiViewDataRequestAction,
})(Graph)
