import styled from 'styled-components'
import { Typography } from 'antd'

import {
  fadedGrey,
  themeColor,
  whiteSmoke,
  black,
  greyThemeDark1,
} from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'

const { Paragraph } = Typography

export const AssignedParagraph = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${black};
`

export const StandardsParagraph = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #777;
`

/** @type {typeof Paragraph} */
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
    background: #d8d8d8;
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

export const TutorMeNoLicensePopupCloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 18px;
  cursor: pointer;
`

export const TutorMeNoLicensePopupTitle = styled.div`
  color: ${black};
  text-align: left;
  width: 100%;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 10px;
`

export const TutorMeNoLicensePopupDescription = styled.div`
  text-align: left;
  margin-bottom: 10px;
  font-size: 11px;
  color: ${greyThemeDark1};
`

export const ViewProgressLinkContainer = styled(FlexContainer)`
  line-height: 35px;
  font-size: 12px;
  margin-left: 20px;
  white-space: nowrap;
  svg {
    margin-top: 9px;
    margin-right: 3px;
  }
`
