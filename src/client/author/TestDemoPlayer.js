import React from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import AssessmentPlayer from '../assessment'
import { WithResources } from '@edulastic/common/src/HOC/withResources'
import AppConfig from '../../app-config'
import { Spin } from 'antd'

const DemoPlayer = ({ match }) => {
  const { id: testId } = match.params
/**
 * Assessment player need to be wrapped with jquery loading
 */
  return <WithResources
  resources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
  fallBack={<Spin />}
>
    <AssessmentPlayer testId={testId} preview demo />
  </WithResources>
}

DemoPlayer.propTypes = {
  match: PropTypes.object.isRequired,
}

export default withRouter(DemoPlayer)
