import styled from 'styled-components'
import {
  themeColor,
  white,
  largeDesktopWidth,
  tabletWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  title,
  lightGrey9,
  borderGrey2,
  lightGrey,
} from '@edulastic/colors'
import { CustomModalStyled, EduButton, FlexContainer } from '@edulastic/common'

export const Img = styled.img`
  height: 35px;
`
export const AddonSection = styled.section`
  padding: 50px 25px;
  background: ${white};
  text-align: center;
  border-radius: 10px;
  box-shadow: 0px 2px 10px #51586829;
`
export const SectionTitle = styled.h2`
  font-size: 18px;
  color: #292f3c;
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
  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 1200px;
  }
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
`
export const AddonImg = styled.img`
  height: 40px;
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
    color: #292f3c;
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
  box-shadow: 0px 2px 10px #51586829;
`
export const CardsSection = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  padding: 25px 30px;
  background: ${white};
  border-radius: 10px;
  margin: 0px auto 20px;
  box-shadow: 0px 2px 10px #51586829;
`

export const IconWrapper = styled.div`
  min-width: 50px;
  height: 50px;
  margin-right: 30px;
  background: ${lightGrey};
  margin-top: 5px;
  svg {
    width: 50px;
    height: 50px;
  }
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
  background: #3dd29f;
  height: 21px;
  padding: 0px 15px;
  border-radius: 2px;
  text-transform: uppercase;
  font-weight: bold;
  color: ${white};
`
export const OtherFilters = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
  font-size: 12px;
  color: #607380;
  text-transform: uppercase;
  font-weight: 600;
`
export const CardRightWrapper = styled(FlexContainer)`
  .ant-btn {
    margin-top: 5px;
  }
`
export const Price = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #738294;
  span {
    font-size: 20px;
    color: #2f4151;
    font-weight: bold;
    margin-right: 10px;
  }
`
export const FilterSection = styled.div`
  padding: 20px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .line {
    width: 100%;
    background: #d4d4d4;
    height: 1px;
  }
  ul {
    list-style: none;
    margin: 0px;
    padding: 0px 20px;
    display: flex;
    align-items: center;
    background: ${lightGrey};
    margin-top: -12px;
    li {
      background: ${white};
      padding: 5px 15px;
      border: 1px solid ${themeColor};
      color: ${themeColor};
      min-width: 120px;
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 600;
      text-align: center;
      cursor: pointer;
      &:hover {
        background: ${themeColor};
        color: ${white};
      }
      &.active {
        background: ${themeColor};
        color: ${white};
      }
    }
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
  color: #304050;
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
  color: #3f85e5;
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
  color: #1ab395;
`
export const LearnMoreLink = styled.a`
  height: 18px;
  border-right: 1px solid ${borderGrey2};
  padding: 0px 20px;
  display: flex;
  align-items: center;
  color: #3f85e5;
  &:last-child {
    border: none;
  }
`
