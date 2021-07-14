import { Upload } from 'antd'
import styled from 'styled-components'
import { drcThemeColor, drcWhite, themeColor } from '@edulastic/colors'
import { test } from '@edulastic/constants'

const { playerSkinValues } = test

export const Footer = styled.div.attrs(() => ({
  className: 'ant-modal-footer',
}))`
  ${(props) =>
    props.playerSkinType === playerSkinValues.drc
      ? `
  &.ant-modal-footer {
    button.ant-btn.ant-btn-primary {
      border-color: ${drcThemeColor};
      color: ${drcThemeColor};
      background-color: ${drcWhite};
      &:hover{
        border-color: ${drcWhite};
        color: ${drcWhite};
        background-color: ${drcThemeColor};
      }
    }
    button.ant-btn.ant-btn-primary + button {
      background: ${drcThemeColor};
      color: ${drcWhite};
    }
  }
`
      : ``}
`

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
