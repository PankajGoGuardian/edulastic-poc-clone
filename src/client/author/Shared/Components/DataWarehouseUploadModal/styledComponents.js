import styled from 'styled-components'
import { Select, TreeSelect, Row, Col, Progress } from 'antd'
import {
  dashBorderColor,
  dragDropUploadText,
  greyThemeDark3,
  greyThemeLighter,
  themeColorBlue,
  borderGrey,
} from '@edulastic/colors'

export const Container = styled.div`
  padding: 10px;
`

export const DropzoneContentContainer = styled.div`
  margin: 20px 0;
  padding: 50px;
  border-radius: 2px;
  height: 400px;
  display: flex;
  justify-content: center;
  border: ${({ isDragActive }) =>
    isDragActive
      ? `2px solid ${themeColorBlue}`
      : `1px dashed ${dashBorderColor}`};
  background: ${greyThemeLighter};
  svg {
    margin-bottom: 12px;
    width: 35px;
    height: 30px;
    fill: ${({ isDragActive }) =>
      isDragActive ? themeColorBlue : dragDropUploadText};
  }
  &:hover {
    border: 1px dashed ${greyThemeDark3};
    svg {
      fill: ${greyThemeDark3};
    }
  }
`

export const StyledProgress = styled(Progress)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  .ant-progress-inner {
    border-radius: 0px;
  }
  .ant-progress-bg {
    border-radius: 0px;
    height: 15px !important;
  }
  .ant-progress-inner {
    background: ${borderGrey};
  }
`

export const StyledText = styled.div`
  font-size: ${({ isComment }) => (isComment ? 11 : 14)}px;
  font-weight: bold;
  text-transform: uppercase;
  color: ${dragDropUploadText};
  margin-top: ${({ isComment }) => (isComment ? 10 : 0)}px;
  word-break: break-word;
`

export const Underlined = styled.span`
  color: ${themeColorBlue};
  cursor: pointer;
  text-decoration: underline;
`

export const StyledRow = styled(Row)`
  margin-bottom: 10px;
`

export const StyledCol = styled(Col)`
  padding-right: 10px;
`

export const StyledSelect = styled(Select)`
  width: 100%;
`
export const StyledTreeSelect = styled(TreeSelect)`
  width: 100%;
`