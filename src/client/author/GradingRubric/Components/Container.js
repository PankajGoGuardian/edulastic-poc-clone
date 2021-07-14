import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row } from 'antd'
import { updateRubricDataAction, getCurrentRubricDataSelector } from '../ducks'
import UseExisting from './UseExisting'

const Container = ({ actionType, closeRubricModal }) => {
  return (
    <Row style={{ width: '100%' }}>
      <UseExisting
        closeRubricModal={closeRubricModal}
        actionType={actionType}
      />
    </Row>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      // questionData: getQuestionDataSelector(state)
      currentRubricData: getCurrentRubricDataSelector(state),
    }),
    {
      // setQuestionData: setQuestionDataAction
      updateRubricData: updateRubricDataAction,
    }
  )
)

export default enhance(Container)
