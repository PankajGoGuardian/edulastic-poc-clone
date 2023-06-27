import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row } from 'antd'
import { updateRubricDataAction } from '../ducks'
import UseExisting from './UseExisting'

const Container = ({
  actionType,
  closeRubricModal,
  isRegradeFlow,
  generateAutoRubrics,
  currentQuestion,
  currentRubricData,
}) => {
  return (
    <Row style={{ width: '100%' }}>
      <UseExisting
        closeRubricModal={closeRubricModal}
        actionType={actionType}
        isRegradeFlow={isRegradeFlow}
        generateAutoRubrics={generateAutoRubrics}
        currentQuestion={currentQuestion}
        currentRubricData={currentRubricData}
      />
    </Row>
  )
}

const enhance = compose(
  connect(() => ({
    // questionData: getQuestionDataSelector(state)
    // currentRubricData: getCurrentRubricDataSelector(state),
    updateRubricData: updateRubricDataAction,
  }))
)

export default enhance(Container)
