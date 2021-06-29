import styled from 'styled-components'
import { Icon } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { lightBlue7 } from '@edulastic/colors'
import { IconUpload as IconUp } from '@edulastic/icons'

export const Container = styled(FlexContainer)`
  min-height: 200px;
  width: 100%;
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
`

export const IconUpload = styled(IconUp)`
  margin-bottom: 12px;
  width: 35px;
  height: 30px;
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
