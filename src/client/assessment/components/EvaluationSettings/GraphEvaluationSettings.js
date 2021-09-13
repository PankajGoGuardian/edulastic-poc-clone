import React from 'react'
import styled from 'styled-components'
import { keys } from 'lodash'
import { Tabs as AntTabs } from 'antd'
import { math as mathConstants } from '@edulastic/constants'
import { FieldLabel } from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import EvaluationOption from './components/EvaluationOption'
import withAuthorButton from './components/withAuthorButton'

const { evaluationSettings, GRAPH_EVALUATION_SETTING } = mathConstants
const { TabPane } = AntTabs

const tabLabel = (label) => (
  <FieldLabel data-cy={label} marginBottom="0px">
    {label}
  </FieldLabel>
)

const RednerOpts = ({
  options,
  hidePointOnEquation,
  onChangeOption,
  evalutionOptions,
  hasGraphElements,
}) =>
  evalutionOptions.map((key) => (
    <EvaluationOption
      isGraph
      key={key}
      optionKey={key}
      options={options}
      hasGraphElements={hasGraphElements}
      hidePointOnEquation={hidePointOnEquation}
      onChangeOption={onChangeOption}
    />
  ))

const WithHowToAuthorOpts = withAuthorButton(RednerOpts)

const GraphEvaluationSettings = ({
  onChangeOption,
  options,
  hidePointOnEquation,
  hasGraphElements,
}) => {
  const groupedOptions = evaluationSettings[GRAPH_EVALUATION_SETTING] || []

  return (
    <Tabs data-cy="graphEvaluationSettings">
      {keys(groupedOptions).map((label, index) => (
        <TabPanel tab={tabLabel(label)} key={index}>
          <WithHowToAuthorOpts
            options={options}
            groupKey={label}
            onChangeOption={onChangeOption}
            hasGraphElements={hasGraphElements}
            evalutionOptions={groupedOptions[label]}
            hidePointOnEquation={hidePointOnEquation}
          />
        </TabPanel>
      ))}
    </Tabs>
  )
}

export default GraphEvaluationSettings

const Tabs = styled(AntTabs)`
  margin: 0px -32px 0px;

  .ant-tabs-nav-scroll {
    .ant-tabs-nav {
      width: 100%;
      > div {
        &:first-child {
          display: flex;
          justify-content: flex-start;
          padding: 0px 16px;
        }
      }
    }
  }
  .ant-tabs-tab {
    font-weight: bold;
    margin: 0px;
    position: relative;
  }

  .ant-tabs-ink-bar {
    opacity: 0;
    visibility: hidden;
  }

  .ant-tabs-tab-active {
    label {
      color: ${themeColor};
    }

    &::after {
      content: '';
      display: block;
      border: 1px solid;
      width: 100%;
      position: absolute;
      bottom: 1px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`
const TabPanel = styled(TabPane)`
  padding: 4px 0px 0px 30px;
  max-height: 78vh;
  overflow: auto;
`
