import { Form } from 'antd'
import styled from 'styled-components'
import { CustomModalStyled } from '@edulastic/common'
import {
  greyThemeLight,
  greyThemeLighter,
  lightGrey3,
  themeColor,
  white,
} from '@edulastic/colors'
import TextArea from 'antd/lib/input/TextArea'
import { RadioInputWrapper } from '../../../../src/components/common/RadioInput'

/** @type {typeof import('antd').Form.Item} */
export const StyledFormItem = styled(Form.Item)`
  &.ant-form-item {
    margin: 10px;
  }
  .ant-form-item-label {
    min-width: 120px;
    font-size: 11px;
    margin-right: 38px;
    font-weight: 550;
  }
  .ant-form-item-control-wrapper {
    width: 100%;
  }
  .ant-input,
  .ant-select {
    width: 100%;
    max-width: 100%;
  }
`

/**
 * @param {import('antd/lib/modal').ModalProps} param0
 */
export const StyledModal = styled(CustomModalStyled)`
  .ant-modal-content {
    width: 540px;
    .ant-modal-close-x {
      padding-top: 35px;
      height: 36px;
      line-height: 36px;
      .ant-modal-close-icon {
        vertical-align: end;
      }
    }
    .ant-modal-header {
      padding-top: 22px;
      padding-bottom: 26px;
      .ant-modal-title {
        padding: 0;
      }
    }
    .ant-modal-body {
    }
    .ant-modal-footer {
      border: none;
      display: flex;
      justify-content: center;
      padding-bottom: 20px;
    }
  }
`

export const StudentNameContainer = styled.div`
  font-size: 15px;
  margin-bottom: 18px;
  margin-left: 10px;
  span {
    font-weight: 700;
  }
`

export const ModalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 50px 0px 0px;
  align-items: center;
  font-size: 25px;
  line-height: 25px;
`

export const StyledAnchor = styled.a`
  color: ${themeColor};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  gap: 10px;
`

export const RadioBtnWrapper = styled(RadioInputWrapper)`
  font-weight: 600;
  margin: 10px 0px;
  .ant-radio-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .ant-radio-wrapper {
      & + .ant-radio-wrapper {
        margin-left: 0px;
      }
      .ant-radio-input:focus + .ant-radio-inner {
        box-shadow: none;
      }
      .ant-radio {
        & + span {
          font-size: ${(props) => props.$labelFontSize || '12px'};
          padding: ${(props) => props.$labelPadding || '0px 10px'};
          text-transform: uppercase;
        }
        .ant-radio-inner {
          border-color: ${greyThemeLight};
          background: ${greyThemeLighter};
          width: 18px;
          height: 18px;
          &:after {
            top: 4px;
            left: 4px;
          }
        }
        &.ant-radio-checked {
          &:after {
            border-color: ${themeColor};
          }
          .ant-radio-inner {
            border-color: ${themeColor};
            background: ${greyThemeLighter};
            &:after {
              background-color: ${themeColor};
            }
          }
        }
        &.ant-radio-disabled {
          &:after {
            border-color: ${greyThemeLight};
          }
          .ant-radio-inner {
            border-color: ${greyThemeLight};
            background: ${greyThemeLight};
            &:after {
              background-color: ${greyThemeLight};
            }
          }
        }
        &.ant-radio-checked {
          &.ant-radio-disabled {
            .ant-radio-inner {
              background: ${greyThemeLight};
              &:after {
                background-color: ${white};
              }
            }
          }
        }
      }
    }
  }
`

export const StyledInfoText = styled.div`
  font-size: 13px;
  font-weight: 500;
  margin-top: 15px;
`

export const StyledTextArea = styled(TextArea)`
  background-color: ${lightGrey3};
  border-radius: 3px;
  &::placeholder {
    font-size: 16px;
  }
  &:focus::placeholder {
    color: transparent;
  }
`

export const StyledDiv = styled.div`
  margin-left: 10px;
`
