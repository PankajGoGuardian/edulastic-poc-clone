import styled, { css } from 'styled-components'
import { FlexContainer, EduButton } from '@edulastic/common'
import {
  desktopWidth,
  white,
  themeColor,
  linkColor,
  borderGrey4,
  red,
  smallDesktopWidth,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import { Button, Icon, Typography, Input } from 'antd'
import { Nav } from '../../../../../assessment/themes/common'

const { Text } = Typography

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: ${({ width }) => width || '100%'};
  transition: width 0.3s;
  &.scratchpad-wrapper {
    input {
      position: absolute;
    }
  }
`

export const ReportIssueBtn = styled(EduButton)`
  background: ${red} !important;
  color: ${white} !important;
  border-color: ${red} !important;
`

export const WidgetContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: ${({ alignItems = '' }) => alignItems || ''};
  > div {
    padding: 0;
  }
  overflow: auto;
`

export const MobileLeftSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  left: 0;
  background: ${(props) => props.theme.testItemPreview.mobileLeftSideBgColor};
  width: 25px;
  bottom: 20px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`

export const MobileRightSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  right: 0;
  background: ${(props) => props.theme.testItemPreview.mobileRightSideBgColor};
  width: 25px;
  bottom: 20px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`

export const ButtonsContainer = styled(FlexContainer)`
  background: ${white};
  padding: 15px;
  justify-content: space-between;
  border-radius: 10px 10px 0px 0px;
  ${({ style }) => style};
`

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  margin: 0;
  padding: ${(props) => props.padding || '0px'};
  flex-wrap: ${(props) => props.wrap || 'wrap'};
  ${({ style }) => style};

  .ant-btn {
    margin-bottom: ${(props) => props.mb || '0px'};
  }
`

export const ColumnContentArea = styled.div`
  background: #fff;
  border-radius: 0px;
  width: ${({ width }) => width || '100%'};
  display: ${(props) => (props.hideColumn ? 'none' : 'flex')};
  flex-direction: column;
  flex-basis: 100%;
  ${({ style }) => style};
`

export const EvaluateButton = styled(Button)`
  font-size: 11px;
  height: 28px;
  color: ${themeColor};
  border-color: ${themeColor};
  margin-right: 5px;
  &:hover,
  &:focus {
    background: ${themeColor};
    color: ${white};
  }

  @media (max-width: ${desktopWidth}) {
    flex-basis: 100%;
    white-space: normal;
    height: auto;
    line-height: normal;
    padding: 5px 0px;
  }
`

export const ReportIssueButton = styled(Button)`
  font-size: 16px;
  margin-left: 10px;
  width: max-content !important;
  height: 28px;
  padding: 0px 10px;
`

export const PassageNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  margin: 10px 0px;
  padding: 0 5px;
  font-size: 11px;
  color: ${linkColor};
  .ant-pagination-item-active {
    a {
      color: ${white};
    }
    background-color: ${themeColor};
  }
  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
    border: 0;
    a {
      border: none;
    }
  }

  .ant-pagination {
    margin: 0 10px;
    &li {
      .ant-pagination-item a {
        color: ${linkColor};
      }
    }
  }
`

const buttonWrapperExtraStyle = css`
  border-top-left-radius: ${({ collapseDirection }) =>
    collapseDirection === 'left' ? '0px' : '4px'};
  border-bottom-left-radius: ${({ collapseDirection }) =>
    collapseDirection === 'left' ? '0px' : '4px'};
  border-top-right-radius: ${({ collapseDirection }) =>
    collapseDirection === 'right' ? '0px' : '4px'};
  border-bottom-right-radius: ${({ collapseDirection }) =>
    collapseDirection === 'right' ? '0px' : '4px'};
  left: ${({ collapseDirection }) =>
    collapseDirection === 'left'
      ? 'auto'
      : collapseDirection === 'right'
      ? '-20px'
      : '-22px'};
  right: ${({ collapseDirection }) =>
    collapseDirection === 'right'
      ? 'auto'
      : collapseDirection === 'left'
      ? '-20px'
      : '-22px'};
`

export const Divider = styled.div`
  width: 0px;
  position: relative;
  background-color: ${(props) =>
    props.isCollapsed ? '#e5e5e5' : 'transparent'};
  border-radius: 10px;
  z-index: 1;
  height: 65vh;
  cursor: pointer;

  &::after,
  &::before {
    content: '';
    display: block;
    border: 1px solid ${borderGrey4};
    position: absolute;
    height: 100%;
  }

  &::after {
    right: -3px;
  }

  &::before {
    left: -3px;
  }

  .button-wrapper {
    background: #a7b5c1;
    display: flex;
    z-index: 10;
    justify-content: space-between;
    position: absolute;
    top: 20px;
    ${buttonWrapperExtraStyle}
  }
`

const rightCollaps = css`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: ${({ collapseDirection }) =>
    collapseDirection === 'right' ? 'none' : ''};
`

const leftCollaps = css`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: ${({ collapseDirection }) =>
    collapseDirection === 'left' ? 'none' : ''};
`

const midCollaps = css`
  .vertical-line {
    border: 1px solid #d4d8dc;
    height: 16px;
    &.first {
      display: ${({ collapseDirection }) =>
        collapseDirection === 'left' ? 'none' : ''};
      margin-right: 2px;
    }
    &.third {
      margin-left: 2px;
      display: ${({ collapseDirection }) =>
        collapseDirection === 'right' ? 'none' : ''};
    }
  }
`

export const CollapseBtn = styled.div`
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 6px;
    height: 11px;
    fill: ${white};
    &:hover {
      fill: ${white};
    }
  }
  ${({ right, left, mid }) => {
    if (right) {
      return rightCollaps
    }
    if (mid) {
      return midCollaps
    }
    if (left) {
      return leftCollaps
    }
  }}
`

export const IconArrow = styled(Icon)`
  color: ${(props) => props.theme.testItemPreview.iconArrowColor};
`

export const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  span {
    font-size: 15px;
    font-weight: 600;
  }
  span > i {
    color: red;
    padding-right: 5px;
  }
`

export const ReportIssueContainer = styled.div`
  width: 100%;
  .fr-box:hover,
  .fr-box:focus {
    border-color: red;
  }
  padding-bottom: 3rem;
`

export const CloseButton = styled(Button)`
  border-radius: 50%;
  border: none;
  background: transparent;
`

export const TextAreaSendButton = styled(Button)`
  float: right;
  margin-top: 10px;
  background: ${themeColor};
  color: ${white};
  &:hover,
  &:focus {
    color: ${themeColor};
  }
`

export const StyledFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${({ style }) => style};
`

export const StyledText = styled(Text)`
  color: ${({ danger }) => (danger ? red : themeColor)};
  font-size: 11px;
  font-weight: normal;
  padding-right: 15px;
  display: none;
  @media (min-width: ${mediumDesktopExactWidth}) {
    display: block;
  }
`

export const RejectButton = styled(EduButton)`
  &.ant-btn.ant-btn-primary {
    svg {
      transition: none;
    }
    &:hover,
    &[disabled] {
      border-color: ${red} !important;
      background: #fff !important;
      span {
        color: ${red};
      }
      svg {
        fill: ${red} !important;
      }
    }
  }
`

export const SyledSpan = styled.span`
  line-height: 0;
  padding: 0 11px;
`

export const StyledInput = styled(Input.TextArea)`
  padding: 8px 22px;
  height: 40px;
`
export const StyledRejectionSubmitBtn = styled(Button)`
  background: ${themeColor};
  height: 40px;
  width: 194px;
  text-transform: uppercase;
  margin-left: 10px;
  color: ${white};
  &:hover {
    background: green;
    font-weight: 500;
    color: ${white};
  }
`

export const StyledFlexContainer = styled(FlexContainer)`
  .review-scratchpad {
    position: absolute;
    background: ${white};
    left: 50px;
    top: 138px;
    min-height: 380px;
    > div {
      min-height: 380px;
    }
    .ant-btn {
      margin-bottom: 8px;
      background: ${themeColor};
      width: 40px;
      height: 40px;
      &:hover {
        background: green;
      }
    }
    .ant-select {
      width: 40px;
      height: 40px;
      .ant-select-selection__rendered {
        line-height: 40px;
      }
    }
    #tool {
      margin-bottom: 4px;
      .rc-color-picker-wrap {
        width: 40px !important;
        height: 40px !important;
        .rc-color-picker-trigger {
          width: 40px !important;
          height: 40px !important;
          position: absolute;
        }
      }
    }
    .scratchpad-back-btn {
      background: ${themeColor};
      color: ${white};
      padding: 10px 0px;
      border-radius: 4px;
    }
    .scratchpad-fillcolor-container {
      background: ${themeColor};
      padding: 0 4px;
      border-radius: 4px;
    }
    .active-btn {
      background: green;
    }
    > div {
      justify-content: unset;
    }
    #tool div > div {
      color: unset;
      font-size: 13px;
    }
    @media (max-width: ${smallDesktopWidth}) {
      top: 170px;
      left: 45px;
      .ant-btn {
        margin-bottom: 4px;
        background: ${themeColor};
        width: 30px;
        height: 30px;
        &:hover {
          background: green;
        }
      }
      .ant-select {
        width: 30px;
        height: 30px;
        .ant-select-selection__rendered {
          line-height: 30px;
        }
      }
      #tool {
        margin-bottom: 4px;
        .rc-color-picker-wrap {
          width: 30px !important;
          height: 30px !important;
          .rc-color-picker-trigger {
            width: 30px !important;
            height: 30px !important;
          }
        }
      }
    }
  }
`

export const QuestionDetails = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  font-weight: 600;
  line-height: 20px;
  padding: 20px !important;
  width: 100%;
`

export const DetailRow = styled.div`
  display: flex;
  align-items: ${(props) => props.alignItems || 'center'};
  flex-direction: ${(props) => props.direction || 'row'};
  padding: 5px 50px 5px 0px;

  &:last-child {
    padding-right: 0px;
  }

  &.standards,
  &.tags {
    padding-right: 0px;
    align-items: flex-start;
    label {
      min-width: 120px;
    }
    span {
      font-size: 9px;
      background: #cbd1d6;
      color: #676e74;
      border-radius: 4px;
      margin-bottom: 5px;
      margin-right: 5px;
      padding: 1px 10px;
      width: unset;
    }
  }

  &.standards {
    span {
      background: #d1f9eb;
      color: #4aac8b;
      text-transform: uppercase;
    }
  }

  label {
    font-size: 10px;
    text-transform: uppercase;
    color: #aaafb5;
    font-weight: 600;
    margin-right: 10px;
    min-width: ${(props) => props.labelWidth || 'auto'};
  }
  span {
    font-size: ${(props) => props.font || 13}px;
    color: #434b5d;
    width: 100%;
    display: inline-block;
  }
`

export const FlexWrap = styled.div`
  display: flex;
  align-items: ${(props) => props.align || 'center'};
  justify-content: ${(props) => props.justify || 'space-between'};
  flex-direction: ${(props) => props.direction || 'row'};
  padding: 4px 15px;
  border: ${(props) => props.border || '1px solid #E8E8E8'};
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
`

export const ScratchpadAndWidgetWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const PremiumItemBannerWrapper = styled.div`
  display: flex;
  margin: 70px 0px;
  position: relative;
  margin-left: 10px;
  section {
    position: absolute;
    top: -40px;
  }
`
export const StyledWrapper = styled(FlexContainer)`
  background: ${({ background }) => background};
  height: ${({ height }) => height};
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  overflow: auto;
`
const ArrowStyle = css`
  max-width: 30px;
  font-size: 26px;
  border-radius: 0px;
  left: 0px;
  svg {
    fill: #878a91;
    path {
      fill: unset;
    }
  }
  .help-text {
    color: #878a91;
  }

  &:hover {
    svg {
      fill: ${white};
    }
    .help-text {
      color: ${white};
      font-size: 20;
      font-weight: 600;
    }
  }
`

export const PrevArrow = styled(Nav.BackArrow)`
  ${ArrowStyle};
`

export const NextArrow = styled(Nav.NextArrow)`
  ${ArrowStyle};
  left: unset;
  right: 0px;
`
export const PrevArrowTTS = styled(PrevArrow)`
  .help-text {
    color: #878a91;
    font-size: 11px;
  }
  &:hover {
    .help-text {
      color: ${white};
    }
  }
  transform: unset;
`
export const NextArrowTTS = styled(NextArrow)`
  .help-text {
    color: #878a91;
    font-size: 11px;
  }
  &:hover {
    .help-text {
      color: ${white};
    }
  }
  transform: unset;
`
export const Title = styled(FlexContainer)`
  font-weight: bold;
  font-size: 20px;
  user-select: none;
`

export const ModalContentArea = styled.div`
  border-radius: ${({ tts }) => (tts ? '8px' : '0px')};
  padding: 0px 30px;
  height: ${({ isMobile }) => (isMobile ? 'calc(100vh - 100px)' : '100%')};
  width: ${({ width }) => width};
`
