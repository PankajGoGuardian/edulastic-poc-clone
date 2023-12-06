import styled from 'styled-components'
import { Row as AntdRow, Select, Upload } from 'antd'
import {
  greyThemeLight,
  lightGreySecondary,
  dragDropUploadText,
  dragDropHighlightText,
} from '@edulastic/colors'
import { ButtonsContainer, ModalFormItem } from '../../../common/styled'

export const SecondDiv = styled.div`
  margin: 15px;
`

export const ThirdDiv = styled.div`
  margin: 30px 15px;
`

export const Row = styled(AntdRow)`
  margin: 10px 0px;
`

export const LeftButtonsContainer = styled(ButtonsContainer)`
  margin: 0px;
  margin-top: 25px;
  button:first-child {
    margin-left: 0px;
  }
  justify-content: flex-start;
`

export const FormItem = styled(ModalFormItem)``

export const StyledSelect = styled(Select)`
  width: 100%;
`
export const StyledDragger = styled(Upload.Dragger)`
  &.ant-upload.ant-upload-drag {
    background: ${lightGreySecondary};
    border: 1px dashed ${greyThemeLight};
    height: 180px;
  }
  .ant-upload-drag-container {
    display: table-cell;
    vertical-align: middle;
    color: rgba(0, 0, 0, 0.35);
    font-weight: bold;
    & > * {
      color: rgba(0, 0, 0, 0.35);
    }
  }

  .ant-upload-text {
    color: ${dragDropUploadText};
    width: 100px;
    margin: 10px auto;
    text-align: center;
    font: normal normal bold 13px/14px Open Sans;
    letter-spacing: 0.6px;
  }

  .ant-upload-hint {
    text-align: center;
    font: normal normal bold 11px/13px Open Sans;
    letter-spacing: 0.45px;
    padding-top: 10px;

    span {
      color: ${dragDropHighlightText};
      text-decoration: underline;
      padding: 0 4px;
    }
  }
`