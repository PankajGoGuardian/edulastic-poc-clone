import styled from 'styled-components'
import {
  themeColor,
  smallMobileWidth,
  white,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  desktopWidth,
  mobileWidth,
} from '@edulastic/colors'

export const BackLink = styled.span`
  background: #fff;
  border-radius: 3px;
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  line-height: 28px;
  padding: 0 20px;
  color: ${themeColor};
  text-transform: uppercase;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
  display: inline-block;

  @media (max-width: ${smallMobileWidth}) {
    padding: 0 10px;
  }
`

export const StyledButton = styled.div`
  background: ${themeColor};
  color: ${white};
  padding: 6px 11px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  display: inline-block;
  float: right;
  cursor: pointer;
`

export const QuestionContentWrapper = styled.div`
  width: 100%;
  left: 0;
  right: 0;
  padding: 0px 30px 30px;
  overflow: auto;
  position: relative;
  z-index: ${({ zIndex }) => zIndex};
  @media (min-width: ${mediumDesktopExactWidth}) {
    /** 50px is height of BreadCrumbBar and 5px is height of scrollbar(horizontal) */
    height: ${({ theme, isInModal }) =>
      `calc(100vh - ${theme.HeaderHeight.md + 55 + (isInModal ? 110 : 0)}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    /** 50px is height of BreadCrumbBar and 5px is height of scrollbar(horizontal) */
    height: ${({ theme, isInModal }) =>
      `calc(100vh - ${theme.HeaderHeight.xl + 55 + (isInModal ? 110 : 0)}px)`};
  }
  @media (max-width: ${desktopWidth}) {
    /** 155px is height of BreadCrumbBar and Header and 5px is height of scrollbar(horizontal) */
    height: ${({ isInModal }) =>
      `calc(100vh - ${185 + (isInModal ? 110 : 0)}}px)`};
  }

  height: ${({ isInModal }) =>
    `calc(100vh - ${115 + (isInModal ? 110 : 0)}px)`};

  @media (max-width: ${mobileWidth}) {
    padding: 0px 25px;
  }
`
