import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { EduIf, WithResources } from '@edulastic/common'
import { Spin } from 'antd'
import AppConfig from '../../../../../app-config'
import CalculatorsWithTab from './components/CalculatorsWithTab'

const CalculatorsWithResources = ({ calcProvider, calcTypes, changeTool }) => (
  <EduIf condition={!isEmpty(calcTypes)}>
    {() => (
      <WithResources
        resources={[
          AppConfig.desmosPath,
          AppConfig.geoGebraPath,
          AppConfig.jqueryPath,
          AppConfig.eduScientificCalcJsPath,
          AppConfig.eduScientificCalcCssPath,
        ]}
        fallBack={<Spin />}
      >
        <CalculatorsWithTab
          calcProvider={calcProvider}
          calcTypes={calcTypes}
          changeTool={changeTool}
        />
      </WithResources>
    )}
  </EduIf>
)

CalculatorsWithResources.propTypes = {
  calcProvider: PropTypes.string.isRequired,
  calcTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeTool: PropTypes.func.isRequired,
}

export default CalculatorsWithResources
