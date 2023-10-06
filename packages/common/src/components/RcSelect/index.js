import React from 'react'
import { lightGreySecondary, title, themeColorBlue } from '@edulastic/colors'
import Select, { Option } from 'rc-select'
import styled from 'styled-components'
import './index.css'

const RcSelect = (props) => {
  const { options, ...restOptions } = props
  return (
    <StyledSelect
      {...restOptions}
      showSearch={false}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      style={{ marginBottom: '10px' }}
      menuItemSelectedIcon={false}
      dropdownClassName="ant-select-dropdown ant-select-dropdown--single ant-select-dropdown-placement-bottomLeft"
    >
      {options.map((option, index) => (
        <Option key={index} value={option.value} aria-label={option.label}>
          {option.label}
        </Option>
      ))}
    </StyledSelect>
  )
}

export default RcSelect

const StyledSelect = styled(Select)`
  width: 100%;
  .rc-select-selector {
    height: 36px;
    background: ${lightGreySecondary};
    color: ${title};
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 2px ${themeColorBlue};
    }
  }
`
