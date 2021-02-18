import styled, { css } from 'styled-components'
import { Button, Modal } from 'antd'
import { IconEdit } from '@edulastic/icons'
import { FlexContainer } from '@edulastic/common'
import {
  mobileWidthMax,
  white,
  themeColor,
  desktopWidth,
  mobileWidthLarge,
  mediumDesktopExactWidth,
} from '@edulastic/colors'

// left 70 as the side menu space need to be considered.
export const FixedHeaderStyle = css`
  position: fixed;
  background: ${white};
  top: 0;
  left: 70px;
  right: 0;
  z-index: 999;
  width: auto;
  height: ${(props) => props.theme.HeaderHeight.xs}px;
  box-shadow: 1px 8px 11px rgba(0, 0, 0, 0.2);
  padding: 10px 30px;
`

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 0px;
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
  ${(props) => props.hasStickyHeader && FixedHeaderStyle}
`

export const StudentButtonWrapper = styled(FlexContainer)`
  justify-content: space-between;
  margin-bottom: 0px;
  align-items: center;

  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`

export const StyledStudentTabButton = styled.div``

export const StudentButtonDiv = styled.div`
  display: flex;
  .ant-btn-primary {
    background-color: #0e93dc;
  }

  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
    padding-bottom: 10px;
    margin-right: 0px;
    overflow: auto;
  }
`

const StyledTabButton = styled.a`
  height: 28px;
  padding: 6px 15px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? themeColor : white)};
  color: ${({ active }) => (active ? white : themeColor)};
  border: 1px solid ${themeColor};
  border-left: none;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${themeColor};
    color: ${white};
  }
  &:first-child {
    border-left: 1px solid ${themeColor};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 6px 30px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    margin: 0 !important;
  }
`

export const CorrectButton = StyledTabButton
export const WrongButton = StyledTabButton

export const AllButton = styled(StyledTabButton)`
  border-radius: 4px 0px 0px 4px;
`

export const PartiallyCorrectButton = styled(StyledTabButton)`
  border-radius: 0px 4px 4px 0px;
`

export const GiveOverallFeedBackButton = styled(StyledTabButton)`
  height: 40px;
  background-color: ${white};
  border: 1px solid ${themeColor};
  color: ${themeColor};
  border-radius: 4px;
  padding: 15px 10px;
  min-width: 250px;
  position: relative;
  svg {
    position: absolute;
    left: 5px;
    width: 25px;
    height: 20px;
    fill: ${themeColor};
  }
  &:hover {
    background-color: ${themeColor};
    color: ${white};
    svg {
      fill: ${white};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    min-width: 300px;
    padding: 20px 10px;
  }
  @media (max-width: ${desktopWidth}) {
    min-width: auto;
    justify-content: center;
    svg {
      display: none;
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    min-width: 100%;
    svg {
      display: block;
    }
  }
`

export const EditIconStyled = styled(IconEdit)`
  fill: ${white};
  margin-left: 15px;
  &:hover {
    fill: ${white};
  }
`

export const ScrollToTopButton = styled(Button)`
  position: fixed;
  bottom: 0;
  right: 0;
  margin-right: 20px;
  margin-bottom: 20px;
  display: ${(props) => (props.hasStickyHeader ? 'block' : 'none')};
`
export const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0 50px 0 50px;
  }
  .ant-modal-header {
    padding: 24px 46px;
    border: 0;
    .ant-modal-title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: -1.1px;
    }
  }
  .ant-modal-footer {
    border: 0;
    padding-bottom: 30px;
  }
  .ant-modal-close {
    top: 6px;
    color: black;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .ant-alert-error {
    width: 100%;
    margin-top: 10px;
  }
`
export const StyledFooter = styled.div`
  display: flex;
  justify-content: center;
  button {
    min-width: 150px;
    margin-top: 5px;
  }
`
