import { Upload, Radio } from 'antd'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

export const StyledRadioButton = styled(Radio.Button)``

export const StyledRadioGroup = styled(Radio.Group)`
  margin-bottom: 20px;
  label.ant-radio-button-wrapper {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.35);
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.15);
  }
`
export const Footer = styled.div.attrs(() => ({
  className: 'ant-modal-footer',
}))``

export const Overlay = styled.div`
  border-radius: 4px;
  background: ${({ isDragging }) =>
    isDragging ? 'rgba(0,0,0,0.5)' : 'transparent'};
  border: ${({ isDragging }) =>
    isDragging ? `2px dashed ${themeColor}` : 'none'};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: ${({ isDragging }) => isDragging && 999};
`

export const DragAndDropOverlay = styled.div`
  border-radius: 4px;
  background: ${({ isDragging }) =>
    isDragging ? 'rgba(0,0,0,0.5)' : 'transparent'};
  border: ${({ isDragging }) =>
    isDragging ? `2px dashed ${themeColor}` : 'none'};
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: ${({ isDragging }) => isDragging && 999};
`

const { Dragger } = Upload

export const UploadDragger = styled(Dragger)`
  &.ant-upload.ant-upload-drag {
    background: rgba(0, 0, 0, 0.1);
    height: 300px;
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
`

export const Underlined = styled.span`
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
`
