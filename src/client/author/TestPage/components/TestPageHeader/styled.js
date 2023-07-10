import styled from 'styled-components'
import { FlexContainer, EduButton } from '@edulastic/common'

import {
  themeColor,
  white,
  textColor,
  lightGrey,
  publishedColor,
  desktopWidth,
  mobileWidthLarge,
  tabletWidth,
  greyDarken,
} from '@edulastic/colors'
import { IconShare } from '@edulastic/icons'
import { Typography } from 'antd'

const { Paragraph } = Typography

export const RightFlexContainer = styled(FlexContainer)`
  /* flex-basis: 30%; */
`

export const AssignButton = styled(EduButton)`
  width: 110px;

  @media (max-width: ${desktopWidth}) {
    width: auto;
  }
`

export const SaveBtn = styled(EduButton)`
  width: 80px;

  @media screen and (max-width: ${mobileWidthLarge}) {
    width: auto;
  }
`

export const ShareIcon = styled(IconShare)`
  width: 16px;
  height: 16px;
  fill: ${themeColor};
`

export const MenuIconWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-basis: 50%;
  margin: 0px;
`

export const RightWrapper = styled(FlexContainer)`
  flex-basis: 50%;
  justify-content: flex-end;
  margin: 0px;

  @media (max-width: ${tabletWidth}) {
    flex-basis: auto;
  }
`

export const TestStatus = styled.span`
  display: inline-block;
  font-size: 9px;
  text-transform: uppercase;
  border-radius: 4px
  margin-top: 0;
  text-align: center;
  border-radius: 4px;
  color: ${(props) => (props.mode === 'embedded' ? white : textColor)};
  background: ${(props) => (props.mode === 'embedded' ? textColor : white)};
  font-weight: 600;
  padding: 3px 5px;
  margin-left: 4px;
  &.draft {
    background: ${lightGrey};
    color: ${greyDarken};
  }
  &.published {
    background: ${publishedColor};
    color: white;
  }
`

export const MobileHeaderFilterIcon = styled.div`
  display: none;
  button {
    position: relative;
    margin: 0px;
    box-shadow: none;
    width: 45px;
    border-radius: 4px;
    border-color: ${themeColor};
    padding: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: 25px;
      width: 25px;
    }

    @media (max-width: ${desktopWidth}) {
      height: 40px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`
export const StaticIdCopy = styled(Paragraph)`
  &.ant-typography {
    border-radius: 4px
    margin: 0px;
    margin-right: 5px;
    font-size: 9px;
    text-transform: uppercase;
    border-radius: 4px
    margin-top: 0;
    font-weight: 600;
    padding: 3px 5px;
    text-align: center;
    margin-bottom: 0px;
    border-width: thin;
    border-style: solid;
    padding: 2px 4px;
    text-align: center;
    border-radius: 4px;
    background-color: ${white};
    display: inline-block;
    color: ${greyDarken};
  }
  .ant-typography-copy {
    margin-left: 3px;
  }
  svg {
    width: 10px;
    height: 10px;
    color: ${greyDarken};
  }
`
