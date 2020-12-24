import styled from 'styled-components'
import {
  themeColor,
  secondaryTextColor,
  white,
  linkColor1,
  largeDesktopWidth,
  tabletWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  title,
} from '@edulastic/colors'

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
  color: #6a737f;
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
  color: #6a737f;
`
export const EnterpriseSection = styled.div`
  width: 100%;
  padding: 50px;
  background: #f5f5f5;
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

export const CurrentPlanContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`

export const PlanStatus = styled.h3`
  color: ${linkColor1};
  font-weight: 700;
  margin: 0;
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

export const StyledParagraph = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  color: ${secondaryTextColor};
  margin-top: ${({ isSubscribed }) => isSubscribed && '50px'};
  letter-spacing: 0.22px;
`

export const StyledLink = styled.span`
  color: ${themeColor};
`
