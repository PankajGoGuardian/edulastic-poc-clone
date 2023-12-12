import styled from 'styled-components'
import {
  themeColor,
  white,
  largeDesktopWidth,
  tabletWidth,
  extraDesktopWidthMax,
  title,
  lightGrey9,
  borderGrey2,
  lightGrey,
  boxShadowColor4,
  darkTitle,
  lightGreen9,
  lightGrey13,
  lightGrey14,
  filterIconColor,
  darkGrey2,
  lightGrey15,
  lightBlue10,
  lightGreen10,
  deleteRed2,
  themeColorBlue,
} from '@edulastic/colors'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'
import { Spin, Tag } from 'antd'

export const Img = styled.img`
  height: 35px;
`
export const AddonSection = styled.section`
  padding: 50px 25px;
  background: ${white};
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 2px 10px ${boxShadowColor4};
  h2 {
    justify-content: center;
  }
`
export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: ${darkTitle};
  font-weight: bold;
  margin: 0px;
`
export const SectionDescription = styled.p`
  font-size: 14px;
  color: rgba(55, 58, 62, 0.8);
  padding-right: 30px;
`
export const SectionContainer = styled.div`
  width: 100%;
  margin: 0px auto;
`
export const CardContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`
export const AddonCard = styled.div`
  width: 100%;
  padding: 30px;
  h3 {
    font-size: 13px;
    color: ${title};
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 15px;
  }
  @media (min-width: ${tabletWidth}) {
    width: 50%;
  }
  @media (min-width: ${largeDesktopWidth}) {
    width: calc(100% / 3);
    padding: 30px 50px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: calc(100% / 4);
    padding: 40px;
  }
`
export const AddonImg = styled.div`
  height: ${(props) => (props.$type === 'enterprise' ? '40px' : '95px')};
`
export const AddonDescription = styled.div`
  font-size: 13px;
  color: ${lightGrey9};
`
export const TopSection = styled.section`
  padding: 10px 30px 30px;
  h1 {
    margin: 0px;
    font-size: 35px;
    color: ${darkTitle};
    font-weight: bold;
    letter-spacing: -1.75px;
  }
  p {
    margin: 0px;
    font-size: 16px;
    color: ${title};
  }
`
export const EnterpriseSection = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 40px 30px;
  background: ${white};
  border-radius: 10px;
  margin: 0px auto 20px;
  box-shadow: 0px 2px 10px ${boxShadowColor4};
`
export const CardsSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 25px 30px;
  background: ${white};
  border-radius: 10px;
  margin: 0px auto 20px;
  box-shadow: 0px 2px 10px ${boxShadowColor4};
`

export const PremiumRequiredMsg = styled.span`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  margin-left: 15px;
  span {
    margin-left: 5px;
    font-size: 10px;
    color: #e5923f;
  }
`
export const ExpiryMsg = styled(PremiumRequiredMsg)`
  span {
    color: #0b9ad2;
  }
`

export const IconWrapper = styled.div`
  margin-right: 30px;
`
export const CardDetails = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 0px;
`
export const GradeWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 8px;
  background: ${lightGreen9};
  height: 21px;
  padding: 0px 15px;
  border-radius: 2px;
  text-transform: uppercase;
  font-weight: bold;
  color: ${white};
  white-space: nowrap;
`
export const OtherFilters = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  font-size: 12px;
  color: ${lightGrey13};
  text-transform: uppercase;
  font-weight: 600;
`
export const CardRightWrapper = styled(FlexContainer)`
  .ant-btn {
    margin-top: 5px;
    &.disabled {
      opacity: 0.3;
      cursor: not-allowed;
      &:focus,
      &:hover {
        background: transparent;
        color: ${themeColorBlue};
        border-color: ${themeColorBlue};
      }
    }
    &.add {
      &:focus,
      &:active {
        background: ${themeColor};
        border-color: ${themeColor};
      }
    }
    &.remove {
      background: ${deleteRed2};
      border-color: ${deleteRed2};
      &:focus,
      &:active {
        background: ${deleteRed2};
        border-color: ${deleteRed2};
      }
    }
  }
`
export const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${lightGrey14};
  span {
    font-size: 20px;
    color: ${filterIconColor};
    font-weight: bold;
    margin-right: 10px;
  }
`
export const FilterSection = styled.div`
  padding: 30px 0px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-transform: uppercase;
  .line {
    width: 100%;
    background: ${lightGrey15};
    height: 1px;
  }
  ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
    display: flex;
    align-items: center;
    li {
      background: ${white};
      padding: 5px 15px;
      border: 1px solid ${themeColor};
      color: ${themeColor};
      min-width: 115px;
      font-size: 9px;
      font-weight: 600;
      text-align: center;
      cursor: pointer;
      &:first-child {
        border-radius: 4px 0px 0px 4px;
      }
      &:last-child {
        border-radius: 0px 4px 4px 0px;
      }
      &.active {
        background: ${themeColor};
        color: ${white};
      }
      &:hover {
        background: ${themeColor};
        color: ${white};
      }
    }
  }
`
export const Wrap = styled.div`
  background: ${lightGrey};
  margin-top: -12px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  span {
    font-size: 10px;
    color: ${lightGrey13};
    margin-right: 15px;
    font-weight: 600;
  }
`

export const HaveLicenseKey = styled.div`
  text-align: center;
  font-size: 9px;
  font-weight: 600;
  margin-top: 25px;
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
  color: ${white};
`

export const AvailablePlansContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 4px;
  margin-bottom: 10px;
`

export const PlansContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  margin: 6px auto;
  background: ${white};
  border-radius: 8px;
  padding: 18px;
  filter: ${({ isblur }) => isblur && 'blur(8px)'};
`

export const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  user-select: none;
`

export const PlanImage = styled.div`
  width: 180px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100px;
    height: 100px;
    border-radius: 100px;
    margin: 2px auto;
  }
`

export const PlanDetails = styled.div`
  width: calc(100% - 200px);
  text-align: left;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: calc(100% - 380px);
  }
`

export const StyledLink = styled.span`
  color: ${themeColor};
`
export const ModalBody = styled.div`
  font-size: 14px;
  color: ${darkGrey2};
`
export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`
export const CalendlyModal = styled(CustomModalStyled)`
  width: 350px !important;
  min-width: 350px;
  &.schedule {
    min-width: 100%;

    .ant-modal-content,
    .ant-modal-body {
      padding: 0px !important;
      background: none;
      border: none;
      box-shadow: none;
    }
    .ant-modal-footer {
      display: none;
    }
    .ant-modal-close-x {
      svg {
        width: 30px;
        height: 30px;
        fill: white;
      }
    }

    & div[data-container='booking-container'] {
      border: none !important;
      box-shadow: none !important;
      max-width: 100% !important;
    }
  }
`
export const CustomButton = styled(EduButton)`
  background: ${({ noBg }) => (noBg ? 'transparent !important' : null)};
  border-color: ${white} !important;
`
export const AddonFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9px;
  color: ${lightBlue10};
  padding-top: 12px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  span {
    height: 18px;
    border-right: 1px solid ${borderGrey2};
    padding: 0px 20px;
    display: flex;
    align-items: center;
    &:last-child {
      border: none;
    }
  }
`
export const PurchaseLink = styled.span`
  color: ${lightGreen10};
`
export const LearnMoreLink = styled.a`
  height: 18px;
  border-right: 1px solid ${borderGrey2};
  padding: 0px 20px;
  display: flex;
  align-items: center;
  color: ${lightBlue10};
  &:last-child {
    border: none;
  }
`
export const SpinContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: rgb(0, 0, 0, 0.3);
`

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

export const StyledTag = styled.span`
  font-size: 9px;
  top: -4px;
  padding-left: 6px;
  position: relative;
  color: ${themeColor};
`

export const StyledNewTag = styled(Tag)`
  border: 2px solid #b4065a;
  border-radius: 50px;
  color: #b4065a;
  background: transparent;
  line-height: 18px;
  font-size: 10px;
  font-weight: bold;
  top: -18px;
  position: relative;
  letter-spacing: 1px;
`

export const StyledLinkWrapper = styled.div`
  padding-top: 12px;
`

export const StyledLinkItem = styled.a`
  font-weight: bold;
  padding-right: 32px;
`
export const MiddleContentWrapper = styled(FlexContainer)`
  maxwidth: 100%;
  min-height: 150px;
  flexshrink: 0;
  border-radius: 10px;
  border: 1.5px solid ${themeColor};
  background: #fff;
  svg {
    margin-bottom: -25px;
  }
`
