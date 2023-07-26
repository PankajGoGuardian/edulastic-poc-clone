import { darkGrey4, fieldRequiredColor } from '@edulastic/colors'
import { FieldLabel } from '@edulastic/common'
import { Form } from 'antd'
import styled from 'styled-components'

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
