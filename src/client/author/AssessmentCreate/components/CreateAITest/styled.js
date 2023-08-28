import {
  darkGrey4,
  fieldRequiredColor,
  themeColor,
  white,
} from '@edulastic/colors'
import { EduButton, FieldLabel, FlexContainer } from '@edulastic/common'

import { Form } from 'antd'
import styled from 'styled-components'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'

export const FormWrapper = styled(Form)`
  .ant-row {
    text-align: left;
    padding: 0px;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 19px;
      text-transform: uppercase;
      color: #000000;
      &:after {
        display: none;
      }
    }
    .ant-form-item-children {
      .ant-input {
        min-height: 45px;
        margin-top: 10px;
      }
      .remote-autocomplete-dropdown {
        line-height: normal;
        .ant-input-affix-wrapper {
          .ant-input {
            min-height: 45px;
          }
        }
      }
      .ant-select-selection .ant-select-selection__rendered {
        min-height: 45px;
        .ant-select-selection-selected-value {
          margin-top: 7px;
        }
      }
      .ant-select-selection__choice {
        height: 35px !important;
      }
      .ant-select-arrow {
        top: 50% !important;
      }
    }
  }
`

export const StyledFilterLabel = styled(FieldLabel)`
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: bold;
  font-size: 11px;
  line-height: 14px;
  color: ${darkGrey4};
  margin-top: 2rem;
`

export const StyledRequired = styled.span`
  color: ${fieldRequiredColor};
  margin-left: 3px;
  font-size: 14px;
`

export const AiEduButton = styled(EduButton)`
  font-weight: ${({ fontWeight }) => fontWeight};

  &.ant-btn.ant-btn-primary {
    border: none;
    background: ${({ aiStyle }) =>
      aiStyle ? 'linear-gradient(225deg, #007d65 0%, #1766ce 100%)' : white};
    color: ${({ aiStyle }) => (aiStyle ? white : themeColor)};
    height: ${({ aiStyle }) => aiStyle && '28px'};
    width: '100%';
    margin: ${({ margin }) => margin && '0 5px'};
    border: 'none';
  }
  &:hover {
    &.ant-btn.ant-btn-primary {
      background: ${({ aiStyle }) =>
        aiStyle ? 'linear-gradient(225deg, #007d65 0%, #1766ce 100%)' : white};
      color: ${({ aiStyle }) => (aiStyle ? white : themeColor)};
      border: none;
    }
  }
`
export const CreateAiTestTitleWrapper = styled(TitleWrapper)`
  padding: 0;
  margin: 0;
  line-height: 2;
  color: #fff;
  font-size: 1rem;
  text-align: left;
`

export const CreateAiTestWrapper = styled(FlexContainer)`
  border-radius: 10px;
  background: linear-gradient(225deg, #007d65 0%, #1766ce 100%);
`
