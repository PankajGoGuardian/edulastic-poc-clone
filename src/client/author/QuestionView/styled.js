import styled from "styled-components";
import { mobileWidthMax, mobileWidth, themeColor, themeColorTagsBg } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";
import { Card } from "antd";

export const PaginationInfo = styled.div`
  font-weight: bold;
  font-size: 10px;
  word-spacing: 5px;
  display: inline-block;
  margin-left: 30px;
  color: #1890ffd9;
`;
export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin: 0px;
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1.4px solid #f7f7f7;
  padding-bottom: 15px;
  margin-bottom: 15px;
`;

export const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #dadae4;
  margin-bottom: 20px;
  .ant-card-body {
    padding: 20px 30px;
  }

  .recharts-rectangle {
    cursor: pointer;
  }
`;

export const StyledTitle = styled.p`
  font-size: 16px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 600;
  padding-left: 62px;
  margin-bottom: 20px;
`;

export const ResponseCard = styled(Card)`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #dadae4;
  .ant-card-body {
    padding: 7px 35px;
    display: flex;
    align-items: center;
  }

  @media (max-width: ${mobileWidthMax}) {
    white-space: nowrap;
    overflow: auto;
    .ant-card-body {
      padding: 7px 20px;
    }
  }
`;

export const ResponseCardTitle = styled.span`
  color: #7c848e;
  font-size: 11px;
  font-weight: 600;
  line-height: 15px;
  margin-right: 35px;
`;

export const CircularDiv = styled.div`
  background-color: ${themeColorTagsBg};
  min-width: 34px;
  width: 34px;
  height: 34px;
  line-height: 34px;
  border-radius: 50%;
  color: ${themeColor};
  font-weight: 600;
  margin-right: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
  &:last-child {
    margin-right: 0px;
  }
`;

export const Content = styled.div`
  display: flex;
  margin: 0px 40px 50px 40px;
  flex-wrap: nowrap;
  padding: 0;
  position: relative;

  @media (max-width: ${mobileWidth}) {
    margin: 50px 25px;
  }
`;

export const FeedBackCard = styled(Card)`
  margin: 0px 20px 0px 20px;
  width: 73%;
  display: flex;
  height: 550px;
  border-radius: 10px;
  border: 1px solid #dadae4;
`;

export const OptionDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const TooltipContainer = styled(Card)`
  border: 1px solid #dadae4;
  .ant-card-head {
    min-height: 40px;
    padding: 0px 16px;
    .ant-card-head-wrapper {
      padding-top: 5px;
    }
    .ant-card-head-title {
      padding: 8px 0px;
      font-weight: 600;
    }
  }
  .ant-card-body {
    padding: 15px 16px;
  }
`;
