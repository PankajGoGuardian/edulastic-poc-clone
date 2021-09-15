import styled from 'styled-components'
import { Icon } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { lightBlue7 } from '@edulastic/colors'
import { IconUpload as IconUp } from '@edulastic/icons'

export const Container = styled(FlexContainer)`
  min-height: 200px;
  width: ${({ theme }) => theme.styledDropZone.containerWidth || '100%'};
  height: ${({ theme, height }) =>
    height || theme.styledDropZone.containerHeight || '100%'};
  margin: ${({ theme, margin }) =>
    margin || theme.styledDropZone.containerMargin || '0px'};
  padding: ${({ theme }) => theme.styledDropZone.containerPadding || '0px'};
  border-radius: ${({ theme }) =>
    theme.styledDropZone.containerBorderRadius || '2px'};
  border: ${({ theme, isDragActive }) =>
    isDragActive
      ? `1px solid ${theme.styledDropZone.containerDragActiveColor}`
      : `1px dashed ${theme.styledDropZone.containerBorderColor}`};
  background: ${({ theme }) => theme.styledDropZone.containerBackground};
  &:focus {
    border: 1px solid
      ${({ theme }) =>
        theme.styledDropZone.containerFocusBorderColor || lightBlue7};
  }
  &:active {
    border: 1px solid
      ${({ theme }) =>
        theme.styledDropZone.containerFocusBorderColor || lightBlue7};
  }
  .dropzone-list-div {
    display: flex;
    flex-direction: column;
  }
  .dropzone-list-label {
    font-size: ${({ theme }) => theme.styledDropZone.zoneTitleFontSize};
    font-weight: ${({ theme }) => theme.styledDropZone.zoneTitleFontWeight};
  }
  .dropzone-list-item {
    margin-top: '2px';
    font-size: ${({ theme }) => theme.styledDropZone.zoneTitleCommentFontSize};
    font-weight: ${({ theme }) => theme.styledDropZone.zoneTitleFontWeight};
  }
`

export const IconUpload = styled(IconUp)`
  margin-bottom: 12px;
  width: ${({ theme }) => theme.styledDropZone.iconUploadWidth || '35px'};
  height: ${({ theme }) => theme.styledDropZone.iconUploadHeight || '30px'};
  fill: ${({ theme, isDragActive }) =>
    isDragActive
      ? theme.styledDropZone.iconUploadDragActiveColor
      : theme.styledDropZone.iconUploadColor};
  :hover {
    fill: ${({ theme, isDragActive }) =>
      isDragActive
        ? theme.styledDropZone.iconUploadDragActiveColor
        : theme.styledDropZone.iconUploadColor};
  }
`

export const Loading = styled(Icon)`
  font-size: ${({ theme }) => theme.styledDropZone.loadingIconFontSize};
`

export const Underlined = styled.span`
  color: ${({ theme }) => theme.styledDropZone.underlinedColor};
  cursor: pointer;
  text-decoration: underline;
`

export const ZoneTitle = styled.div`
  font-size: ${({ theme, isComment }) =>
    isComment
      ? theme.styledDropZone.zoneTitleCommentFontSize
      : theme.styledDropZone.zoneTitleFontSize};
  font-weight: ${({ theme }) => theme.styledDropZone.zoneTitleFontWeight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.styledDropZone.zoneTitleColor};
  margin-top: ${({ isComment }) => (isComment ? 8 : 0)}px;
`
