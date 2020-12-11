import React, { useMemo } from 'react'
import AntTabs from "antd/es/Tabs";
import { keys } from 'lodash'
import { FieldLabel } from '@edulastic/common'
import styled from 'styled-components'
import { math as mathConstants } from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'
import EvaluationOption from './components/EvaluationOption'

const { evaluationSettings } = mathConstants
const { TabPane } = AntTabs

const MathEquivalentOptions = ({
  method,
  onChangeOption,
  onChange,
  options,
  useTemplate,
  allowNumericOnly,
  allowedVariables,
  onChangeAllowedOptions,
}) => {
  const groupedOptions = useMemo(() => evaluationSettings[method], [method])

  const tabLabel = (label) => (
    <FieldLabel marginBottom="0px">{label}</FieldLabel>
  )

  const renderOptions = (evalutionOptions = []) =>
    evalutionOptions.map((key) => (
      <EvaluationOption
        key={key}
        optionKey={key}
        options={options}
        onChangeOption={onChangeOption}
        onChange={onChange}
        useTemplate={useTemplate}
        allowNumericOnly={allowNumericOnly}
        allowedVariables={allowedVariables}
        onChangeAllowedOptions={onChangeAllowedOptions}
      />
    ))

  return (
    <Tabs>
      {keys(groupedOptions).map((label, index) => (
        <TabPanel tab={tabLabel(label)} key={index}>
          {renderOptions(groupedOptions[label])}
        </TabPanel>
      ))}
    </Tabs>
  )
}

export default MathEquivalentOptions

const Tabs = styled(AntTabs)`
  margin: 0px -32px 0px;

  .ant-tabs-nav-scroll {
    text-align: center;
  }
  .ant-tabs-tab {
    font-weight: bold;
  }
  .ant-tabs-tab-active {
    label {
      color: ${themeColor};
    }
  }
`
const TabPanel = styled(TabPane)`
  padding: 4px 0px 0px 30px;
  max-height: 78vh;
  overflow: auto;
`
