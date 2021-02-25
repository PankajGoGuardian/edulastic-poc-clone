import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { WithResources } from '@edulastic/common/src/HOC/withResources'
import AssessmentPlayer from '../assessment'
import AppConfig from '../../app-config'

const DemoPlayer = ({ match }) => {
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
        defaultAP
      />
    </WithResources>
  )
}

DemoPlayer.propTypes = {
  match: PropTypes.object.isRequired,
}

export default withRouter(DemoPlayer)
