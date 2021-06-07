import {
  secondaryTextColor,
  themeColor,
  borderGrey4,
  fieldRequiredColor,
  darkGrey,
  lightGreySecondary,
  inputBorder1,
} from '@edulastic/colors'
import { Input, Select } from 'antd'
import styled, { css } from 'styled-components'

export const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${secondaryTextColor};
`

export const Text = styled.div`
  text-align: left;
  width: unset;
  font: normal normal bold 16px Open Sans;
  color: ${secondaryTextColor};
  margin-bottom: 16px;
`

export const SubText = styled.label`
  display: block;
  width: auto !important;
  text-align: left;
  font: normal normal normal 14px Open Sans;
  color: ${secondaryTextColor};
  margin-bottom: ${({ mb }) => mb || '6px'};
`

const LabelRequired = css`
  &::after {
    content: ' *';
    color: ${fieldRequiredColor};
    font-size: 12px;
  }
`

export const Label = styled.p`
  width: ${({ width }) => width && width + ' !important'};
  margin-bottom: ${({ mb }) => mb && mb + ' !important'};
  font-size: ${({ fs }) => fs && fs + ' !important'};
  .ant-modal-content .ant-modal-body p {
    text-align: left;
    font: normal normal normal 12px Open Sans;
    letter-spacing: 0.24px;
    color: ${secondaryTextColor};
  }
  text-transform: uppercase;

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
    font: normal normal 600 13px Open Sans;
    letter-spacing: 0.2px;
    color: ${secondaryTextColor};
    text-transform: uppercase;
  }
`

export const StyledInput = styled(Input)`
  height: 46px;
  background: ${lightGreySecondary};
  color: ${secondaryTextColor};
  border-color: ${inputBorder1};
  margin-top: 2px;
  margin-bottom: 25px;
`

export const StyledSelect = styled(Select)`
  width: 100%;
  height: 46px;
  background: ${lightGreySecondary};
  color: ${secondaryTextColor};
  border-color: ${inputBorder1};
  margin-top: 2px;
  margin-bottom: 25px;

  .ant-select-selection {
    background: ${lightGreySecondary};
  }
  .ant-select-selection__rendered {
    line-height: 46px;
    height: 46px !important;
    .ant-select-selection__placeholder {
      color: ${darkGrey};
    }
  }

  .ant-select-selection {
    background: ${lightGreySecondary} 0% 0% no-repeat padding-box;
    border: 1px solid ${inputBorder1};
    border-radius: 2px;
  }

  .ant-select-selection--multiple > ul > li,
  .ant-select-selection--multiple .ant-select-selection__rendered > ul > li {
    height: 36px;
    margin-top: 3px;
    line-height: 36px;
  }

  .ant-select-selection__choice {
    background-color: #b9b9b9;
  }
  .ant-select-selection-selected-value {
    line-height: 40px;
  }

  .ant-select-arrow {
    color: ${themeColor};
  }
`

export const StyledInputTextArea = styled(Input.TextArea)`
  background: ${lightGreySecondary};
  color: ${secondaryTextColor};
  border-color: ${inputBorder1};
  margin-top: 2px;
  margin-bottom: 25px;
  resize: none;

  &:placeholder-shown {
    padding-top: 12px;
  }
`
