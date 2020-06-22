import styled from "styled-components";
import {
  themeColor,
  secondaryTextColor,
  white,
  linkColor1,
  largeDesktopWidth,
  smallDesktopWidth,
  desktopWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";

export const CurrentPlanContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

export const PlanStatus = styled.h3`
  color: ${linkColor1};
  font-weight: 700;
  margin: 0;
`;

export const AvailablePlansContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const PlanContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${white};
  border-radius: 10px;
`;

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
  filter: ${({ isblur }) => isblur && "blur(8px)"};
`;

export const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  user-select: none;
`;

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
`;

export const PlanDetails = styled.div`
  width: calc(100% - 200px);
  text-align: left;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: calc(100% - 380px);
  }
`;

export const GridContainer = styled.div`
  display: grid;
  min-height: 250px;
  height: 100%;
  grid-template-columns: 30% 30% 30%;
  grid-column-gap: 35px;
  grid-row-gap: 25px;
  width: 100%;

  @media (max-width: ${largeDesktopWidth}) {
    grid-template-columns: 45% 45%;
  }

  @media (max-width: ${smallDesktopWidth}) {
    grid-template-columns: 45% 45%;
  }

  @media (max-width: ${desktopWidth}) {
    grid-template-columns: 85%;
  }
`;

export const FlexCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  margin: 10px;
`;

export const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 8px;
`;

export const FeatureDescription = styled.p`
  font-size: 16px;
  color: ${linkColor1};
  letter-spacing: 0.28px;
  font-size: 15px;
  text-align: left;
  width: 100%;
`;

export const Img = styled.img`
  width: 33px;
  height: 29px;
`;

export const StyledParagraph = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  color: ${secondaryTextColor};
  margin-top: ${({ isSubscribed }) => isSubscribed && "50px"};
  letter-spacing: 0.22px;
`;

export const StyledLink = styled.span`
  color: ${themeColor};
  cursor: pointer;
`;
