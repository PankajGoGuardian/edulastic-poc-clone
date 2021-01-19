import styled from 'styled-components'
import {
  themeColor,
  white,
  largeDesktopWidth,
  tabletWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  title,
  whiteSmoke,
  lightGrey9,
  borderGrey2,
} from '@edulastic/colors'
import { CustomModalStyled, EduButton } from '@edulastic/common'

export const ContentSection = styled.section`
  min-height: 300px;
  padding: 0px 50px;
  background: transparent linear-gradient(111deg, #0d9c8c 0%, #095592 100%) 0%
    0% no-repeat padding-box;
  display: flex;
  justify-content: center;
`
export const ContentCards = styled.div`
  width: 100%;
  position: relative;
  top: -50px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  @media (min-width: ${mediumDesktopExactWidth}) {
    justify-content: space-between;
    width: 1200px;
  }
`
export const ContentCard = styled.div`
  width: 290px;
  height: 200px;
  background: ${white};
  box-shadow: 0px 3px 20px #99bdd380;
  margin: 0px 10px 10px 0px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  h3 {
    font-size: 14px;
    color: ${title};
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 15px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    &:nth-child(4n + 4) {
      margin-right: 0px;
    }
    padding: 20px 35px;
  }
`
export const FeatureDescription = styled.p`
  font-size: 14px;
  color: ${lightGrey9};
  text-align: center;
`
export const Img = styled.img`
  height: 35px;
`
export const AddonSection = styled.section`
  padding: 50px 15px;
  background: ${white};
  text-align: center;
`
export const SectionTitle = styled.h2`
  font-size: 26px;
  color: #292f3c;
  font-weight: bold;
`
export const SectionDescription = styled.p`
  font-size: 14px;
  color: #373a3e;
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
  justify-content: space-around;
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
    padding: 30px 70px;
  }
`
export const AddonImg = styled.img`
  height: 40px;
`
export const AddonDescription = styled.div`
  font-size: 13px;
  color: ${lightGrey9};
`
export const EnterpriseSection = styled.div`
  width: 100%;
  padding: 50px;
  background: ${whiteSmoke};
  border-radius: 4px;
  text-align: center;
  margin: 0px auto 50px;
  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 1200px;
    border-radius: 10px;
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
