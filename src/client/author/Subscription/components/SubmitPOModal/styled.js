import {
  greyThemeLight,
  inputBorder1,
  lightGreySecondary,
  dragDropUploadText,
  dragDropHighlightText,
  secondaryTextColor,
} from '@edulastic/colors'
import { InputNumber, Upload } from 'antd'
import styled from 'styled-components'

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

export const StyledInputNumber = styled(InputNumber)`
  width: 300px;
  height: 46px;
  line-height: 46px;
  background: ${lightGreySecondary};
  color: ${secondaryTextColor};
  border-color: ${inputBorder1};
  margin-top: 2px;
  margin-bottom: 25px;
`
