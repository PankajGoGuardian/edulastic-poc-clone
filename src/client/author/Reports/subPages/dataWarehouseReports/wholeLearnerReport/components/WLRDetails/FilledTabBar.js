import React from 'react'
import { Radio, Row } from 'antd'
import { lightGreen10 } from '@edulastic/colors'
import styled from 'styled-components'
import { DashedLine } from '../../../../../common/styled'

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
        {panels.map((panel) => (
          <Radio.Button key={panel.key} value={panel.key}>
            {panel.props.tab}
          </Radio.Button>
        ))}
      </FilledRadioGroup>
      <DashedLine />
    </Row>
  )
}
