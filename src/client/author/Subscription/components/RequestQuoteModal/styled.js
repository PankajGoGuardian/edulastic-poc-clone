import {
  secondaryTextColor,
  themeColor,
  borderGrey4,
  fieldRequiredColor,
} from '@edulastic/colors'
import { Checkbox, Spin } from 'antd'
import styled, { css } from 'styled-components'

const LabelRequired = css`
  &::after {
    content: ' *';
    color: ${fieldRequiredColor};
    font-size: 12px;
  }
`

export const Label = styled.label`
  display: block;
  text-align: left;
  font: normal normal 600 13px Open Sans;
  letter-spacing: 0.24px;
  color: ${secondaryTextColor};
  text-transform: uppercase;
  margin-bottom: ${({ mb }) => mb || '4px'};

  ${({ required }) => required && LabelRequired}
`

export const Container = styled.div`
  margin: auto;
  width: 100%;

  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 0.5px solid ${borderGrey4};
    margin: 2em 0;
    padding: 0;
  }

  .ant-radio-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
    margin-bottom: 24px;
  }

  .ant-radio-checked .ant-radio-inner .ant-radio-inner::after {
    color: ${themeColor};
    border-color: ${themeColor};
  }

  .ant-radio-wrapper {
    text-align: left;
    font: normal normal 500 13px Open Sans;
    letter-spacing: 0.2px;
    color: ${secondaryTextColor};
    text-transform: uppercase;
  }
`

export const StyledSpin = styled(Spin)`
  position: relative;
  bottom: 50%;
  left: 50%;
  transform: unset;
  -webkit-transform: unset;
  -moz-transform: unset;
  padding-top: 40px;
  height: 100px;
`
