import styled from 'styled-components'
import { Typography } from 'antd'

import { fadedGrey, themeColor, whiteSmoke } from '@edulastic/colors'

const { Paragraph } = Typography

export const AssignedParagraph = styled.div`
  font-size: 14px;
  font-weight: 600;
`

export const StandardsParagraph = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #777;
`

export const TitleCopy = styled(Paragraph)`
  div:first-child {
    background-color: ${whiteSmoke};
    display: block;
    width: 90%;
    border-radius: 4px;
    padding: 10px;
    border: 1px solid ${fadedGrey};
    color: #5d616f;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.ant-typography {
    color: ${themeColor};
    display: flex;
    justify-content: space-between;
  }
  button {
    margin-right: 10px;
  }
  .anticon {
    margin-top: 10px;
  }
  i.anticon.anticon-copy {
    display: flex;
    align-items: center;
    &:after {
      content: 'Copy Link';
      font-size: 12px;
      color: ${themeColor};
      margin-left: 3px;
    }
  }
  svg {
    width: 16px;
    height: 16px;
    color: ${themeColor};
  }
`

export const ShareUrlDiv = styled.div`
  display: flex;
  color: ${themeColor};
  font-weight: 600;
  align-items: center;
`
export const RowsWrap = styled.div`
  padding-left: 16px;
`

export const CustomRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 2px 0px 2px;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    top: 26px;
    left: -16px;
    background: #bbb;
    border-radius: 50%;
    z-index: 1;
  }
  &:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 100%;
    background: #bbbbbb;
    left: -13px;
    top: 27px;
  }
  &:last-child {
    &:after {
      display: none;
    }
  }
`
