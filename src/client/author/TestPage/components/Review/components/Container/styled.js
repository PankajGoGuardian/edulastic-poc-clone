import styled from "styled-components";
import {
  mediumDesktopWidth,
  mainBgColor,
  mobileWidthMax,
  tabletWidth,
  desktopWidth,
  smallDesktopWidth
} from "@edulastic/colors";
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
    padding: 10px 24% 10px 55px;
    transition: top 1s ease-in;
    > div {
      margin: 0;
      .ant-breadcrumb {
        display: none;
      }
    }
    @media (max-width: ${mediumDesktopWidth}) {
      top: 59px;
    }
    @media (max-width: ${smallDesktopWidth}) {
      padding: 10px 10px 10px 55px;
    }
    @media (max-width: ${desktopWidth}) {
      padding: 10px;
      top: 45px;
    }
    @media (max-width: ${tabletWidth}) {
      left: 0px;
    }
    @media (max-width: ${mobileWidthMax}) {
      top: 0px;
    }
  }
`;

export const ReviewSummaryWrapper = styled(Col)`
  padding-left: 20px;

  @media (max-width: 991px) {
    padding-left: 0px;
    margin-top: 15px;
  }
`;

export const SecondHeader = styled.div`
  display: flex;
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

  @media (max-width: ${desktopWidth}) {
    flex-direction: column;
  }
`;
