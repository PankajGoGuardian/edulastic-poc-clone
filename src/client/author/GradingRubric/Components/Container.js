import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row } from 'antd'
import { updateRubricDataAction, getCurrentRubricDataSelector } from '../ducks'
import CreateNew from './CreateNew'
import UseExisting from './UseExisting'

const Container = ({
  actionType,
  updateRubricData,
  currentRubricData,
  closeRubricModal,
}) => {
  const getContent = () => {
    return (
      <UseExisting
        closeRubricModal={closeRubricModal}
        actionType={actionType}
      />
    )
  }

  return <Row style={{ width: '100%' }}>{getContent()}</Row>
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
