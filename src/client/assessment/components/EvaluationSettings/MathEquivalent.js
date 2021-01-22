import React, { useMemo, useState } from 'react'
import { Tabs as AntTabs } from 'antd'
import { keys } from 'lodash'
import { FieldLabel } from '@edulastic/common'
import styled from 'styled-components'
import { math as mathConstants } from '@edulastic/constants'
import { themeColor } from '@edulastic/colors'
import EvaluationOption from './components/EvaluationOption'

const { evaluationSettings, subEvaluationSettingsGrouped } = mathConstants
const { TabPane } = AntTabs

const MathEquivalentOptions = ({
  method,
  onChangeOption,
  onChangeRadio,
  options,
  useTemplate,
  allowNumericOnly,
  allowedVariables,
  onChangeAllowedOptions,
}) => {
  const groupedOptions = useMemo(() => evaluationSettings[method], [method])
  const fractionFormOptions = subEvaluationSettingsGrouped.fractionForms
  const isFractionFormChecked = useMemo(
    () =>
      keys(options)
        .filter((option) => options[option])
        .some((option) => fractionFormOptions.includes(option)),
    [options, fractionFormOptions]
  )

  const [isNumberFormatDisabled, setIsNumberFormatDisabled] = useState(
    isFractionFormChecked
  )

  const handleChangeOptions = (prop, val) => {
    const newOptions = {
      ...options,
      [prop]: val,
    }
    if (
      newOptions.isSimplifiedFraction ||
      newOptions.isMixedFraction ||
      newOptions.isImproperFraction ||
      newOptions.isRationalized
    ) {
      setIsNumberFormatDisabled(true)
    } else {
      setIsNumberFormatDisabled(false)
    }

    onChangeOption(prop, val)
  }

  const tabLabel = (label) => (
    <FieldLabel marginBottom="0px">{label}</FieldLabel>
  )

  const renderOptions = (evalutionOptions = []) =>
    evalutionOptions.map((key) => (
      <EvaluationOption
        key={key}
        optionKey={key}
        options={options}
        onChangeOption={handleChangeOptions}
        onChangeRadio={onChangeRadio}
        useTemplate={useTemplate}
        allowNumericOnly={allowNumericOnly}
        allowedVariables={allowedVariables}
        onChangeAllowedOptions={onChangeAllowedOptions}
        isNumberFormatDisabled={isNumberFormatDisabled}
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
