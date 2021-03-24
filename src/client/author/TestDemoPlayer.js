import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { test as testConstants } from '@edulastic/constants'
import { WithResources } from '@edulastic/common/src/HOC/withResources'
import { compose } from 'redux'
import { connect } from 'react-redux'
import AssessmentPlayer from '../assessment'
import AppConfig from '../../app-config'

const DemoPlayer = ({ match, testType }) => {
  const { id: testId } = match.params
  /**
   * Assessment player need to be wrapped with jquery loading
   */
  const closeTestPreviewModal = () => {
    window.location.href = '/'
  }
  return (
    <WithResources
      resources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
      fallBack={<Spin />}
    >
      <AssessmentPlayer
        testId={testId}
        preview
        demo
        closeTestPreviewModal={closeTestPreviewModal}
        submitPreviewTest={closeTestPreviewModal}
        defaultAP={testType !== testConstants.type.PRACTICE}
      />
    </WithResources>
  )
}

DemoPlayer.propTypes = {
  match: PropTypes.object.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      testType: state.test.testType,
    }),
    null
  )
)
export default enhance(DemoPlayer)
