import styled from "styled-components";
import { themeColor, themeLightGrayBgColor, white, mediumDesktopExactWidth } from "@edulastic/colors";

export const SubscriptionMainWrapper = styled.div`
  width: calc(100% - 100px);
  margin: 50px auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
`;

export const CurrentPlanContainer = styled.div`
  width: 100%;
  background: ${white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 18px 28px;
  height: 100px;
`;

export const PlanStatus = styled.h3`
  color: ${themeColor};
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
  filter: ${({ isEnterprise }) => isEnterprise && "blur(5px)"};
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
  width: calc(100% - 380px);
  text-align: left;

  @media (max-width: ${mediumDesktopExactWidth}) {
    width: calc(100% - 200px);
  }
`;
