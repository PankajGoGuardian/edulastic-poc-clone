import React from 'react'
import { Radio, Row } from 'antd'
import { lightGreen10 } from '@edulastic/colors'
import styled from 'styled-components'
import { DashedLine, StyledTooltip } from '../../../../../common/styled'

/** @type {typeof import('antd/lib/radio').Group} */
const FilledRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    color: ${lightGreen10};
    border-color: ${lightGreen10};
    font-weight: 700;
    padding-inline: 24px;
  }
  &.ant-radio-group-solid
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background: ${lightGreen10};
    border-color: ${lightGreen10};
  }
`
/**
 * @param {import('antd/lib/tabs').TabsProps} props
 */
export const FilledTabBar = (props) => {
  const { activeKey, panels, onTabClick } = props
  const radioButton = (panel) => {
    const {
      disabledInfo: { disabled = false, message } = {},
      tab,
    } = panel.props
    const _radioButton = (
      <Radio.Button disabled={disabled} key={panel.key} value={panel.key}>
        {tab}
      </Radio.Button>
    )

    if (disabled) {
      return <StyledTooltip title={message}>{_radioButton}</StyledTooltip>
    }
    return _radioButton
  }
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ marginBlock: '8px' }}
    >
      <DashedLine />
      <FilledRadioGroup
        buttonStyle="solid"
        value={activeKey}
        onChange={(e) => onTabClick(e.target.value, e)}
        size="large"
      >
        {panels.map((panel) => radioButton(panel))}
      </FilledRadioGroup>
      <DashedLine />
    </Row>
  )
}
