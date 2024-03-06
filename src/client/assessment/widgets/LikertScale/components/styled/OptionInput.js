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
    margin-right: 2px;
    &:focus,
    &:hover,
    &:active {
      border: 1px solid ${themeColorBlue} !important;
      box-shadow: none;
    }
    .ant-input-number-input {
      padding: 0 5px;
    }
  }
`
