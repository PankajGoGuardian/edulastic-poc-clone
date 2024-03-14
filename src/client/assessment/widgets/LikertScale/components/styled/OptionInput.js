import { themeColorBlue } from '@edulastic/colors'
import { Input, InputNumber } from 'antd'
import styled from 'styled-components'

export const TextInputStyled = styled(Input)`
  &.ant-input {
    border: none;
    padding: 0px;
    text-align: left;
    &:focus,
    &:hover {
      border: none !important;
      box-shadow: none;
    }
  }
`

export const NumberInputStyled = styled(InputNumber)`
  &.ant-input-number {
    width: 60px;
    height: 40.5px;
    margin-right: 0px;
    border-radius: inherit;
    background: #f8f8f8;
    &:focus,
    &:hover,
    &:active {
      border: 1px solid ${themeColorBlue} !important;
      box-shadow: none;
    }
    .ant-input-number-input {
      padding: 0 5px;
    }
    .ant-input-number-handler-wrap {
      opacity: 1;
    }
  }
`
