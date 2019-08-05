import styled from "styled-components";
import { mediumDesktopWidth, mainBgColor } from "@edulastic/colors";
import { Col } from "antd";

export const ReviewPageContainer = styled.div`
  padding: 20px 30px;
  .fixed-second-header {
    background: ${mainBgColor};
    top: 96px;
    position: fixed;
    left: 100px;
    right: 0;
    z-index: 2;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 10px 24% 10px 10px;
    transition: top 1s ease-in;
    > div {
      margin: 0;
      .ant-breadcrumb {
        display: none;
      }
    }
    @media (max-width: ${mediumDesktopWidth}) {
      top: 60px;
    }
  }
`;

export const ReviewSummaryWrapper = styled(Col)`
  padding-left: 20px;
`;

export const SecondHeader = styled.div`
  display: flex;
  flex-direction: ${props => (props.isMobileSize ? "row" : "column")}
  justify-content: space-between;
  margin-bottom: 10px;
  
  & > div > .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
    & > button {
      height: 24px;
      margin-top: -1px;
    }
  }
`;
