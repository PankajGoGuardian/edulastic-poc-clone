import styled, { css } from 'styled-components'
import { Button, Input, Modal } from 'antd'
import { IconEdit } from '@edulastic/icons'
import { FlexContainer, EduButton } from '@edulastic/common'
import {
  mobileWidthMax,
  white,
  themeColor,
  desktopWidth,
  extraDesktopWidth,
  sectionBorder,
  inputBorder1,
  greyThemeDark1,
  lightGrey9,
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
  align-items: center;
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

const StyledTabButton = styled(EduButton).attrs(() => ({
  height: '28px',
  ml: '0px',
  isGhost: true,
  fontSize: '10px',
}))`
  border-radius: 0px;
  border-left: 0px;

  &.ant-btn.ant-btn-primary {
    background-color: ${({ active }) => active && themeColor};
    color: ${({ active }) => active && white};
  }

  &:focus,
  &:hover {
    &.ant-btn.ant-btn-primary {
      border-color: ${themeColor};
      background-color: ${themeColor};
    }
  }
`

export const CorrectButton = StyledTabButton
export const WrongButton = StyledTabButton

export const AllButton = styled(StyledTabButton)`
  border-left: 1px solid;
  border-radius: 4px 0px 0px 4px;
`

export const PartiallyCorrectButton = styled(StyledTabButton)`
  border-radius: 0px 4px 4px 0px;
`

export const GiveOverallFeedBackButton = styled(StyledTabButton)`
  height: 24px;
  background-color: ${white};
  border: 1px solid ${themeColor};
  color: ${themeColor};
  border-radius: 4px;
  min-width: 250px;
  position: relative;
  margin-left: 28px;
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

  @media (min-width: ${extraDesktopWidth}) {
    min-width: 300px;
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

export const SlideContainer = styled.span`
  height: 300px;
`

export const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 430px;
  .prev,
  .next {
    display: block;
  }
`

export const ScrollbarContainer = styled.div`
  white-space: nowrap;
  transition: 0.2s;
  border: 1px solid ${inputBorder1};
  .scrollbar-container {
    width: 430px;
    height: 305px;
    transition: 0.2s;
  }
  .ps__rail-x {
    display: none;
  }
`
export const PrevButton = styled.div`
  position: absolute;
  top: 60%;
  left: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 5;
`
export const NextButton = styled(PrevButton)`
  top: 58.5%;
  left: auto;
  right: 10px;
  transform: translateY(-50%) rotate(180deg);
`

export const Slides = styled.div`
  width: 412px;
  height: 290px;
  color: ${white};
  cursor: pointer;
  display: inline-block;
  background-image: ${(props) => `url(${props.bgImage})`};
  background-size: 100% 100%;
  background-position: top left;
  background-repeat: no-repeat;
  border-radius: 4px;
  margin: 8px 0 8px 8px;
`
export const AttachmentFooter = styled.div`
  width: 456px;
  margin: auto;
  padding-top: 45px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`
export const SingleDownloadButton = styled(EduButton)`
  width: 200px;
  span {
    height: 24px;
  }
`

export const Title = styled.h2`
  font-weight: 600;
`

export const Description = styled.p`
  font-weight: 600;
  font-size: 15px;
`

export const ModalInput = styled(Input)`
  border-color: ${sectionBorder};
  border-radius: 2px;
  height: 40px;
  margin-top: 15px;
  margin-bottom: 20px;
  max-width: 450px;

  .ant-input[disabled] {
    color: ${lightGrey9};
  }
`

export const SlideWrapper = styled.div`
  width: 430px;
  height: 298px;
`

export const InputTitle = styled.h3`
  color: ${greyThemeDark1};
  text-align: left;
  font: normal normal 600 11px/15px Open Sans;
  letter-spacing: 0px;
  text-transform: uppercase;
  margin: 20px 0 -10px 0px;
`

export const StyledAttachmentModal = styled(Modal)`
  .ant-modal-body {
    padding: 0 50px 0 50px;
  }
  .ant-modal-header {
    padding: 24px 46px;
    border: 0;
    .ant-modal-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -1.1px;
      margin-top: 8px;
    }
  }
  .ant-modal-footer {
    border: 0;
    padding-bottom: 30px;
  }
  .ant-modal-close {
    top: 18px;
    right: 32px;
    color: black;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`
