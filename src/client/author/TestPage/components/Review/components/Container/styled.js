import styled from "styled-components";
import {
  mainBgColor,
  mobileWidthMax,
  tabletWidth,
  desktopWidth,
  smallDesktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";
import { Col, Row } from "antd";

export const ReviewPageContainer = styled.div`
  padding: 20px 30px;
  .fixed-second-header {
    background: ${mainBgColor};
    top: ${props => props.theme.HeaderHeight.xs}px;
    position: fixed;
    left: 100px;
    right: 0;
    z-index: 999;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 10px 24% 10px 55px;
    transition: top 1s ease-in;
    > div {
      margin: 0;
      .ant-breadcrumb {
        display: none;
      }
    }

    @media (min-width: ${mediumDesktopExactWidth}) {
      top: ${props => props.theme.HeaderHeight.md}px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      top: ${props => props.theme.HeaderHeight.xl}px;
    }
    @media (max-width: ${smallDesktopWidth}) {
      padding: 10px 10px 10px 55px;
    }
    @media (max-width: ${desktopWidth}) {
      padding: 10px;
      top: 0px;
    }
    @media (max-width: ${tabletWidth}) {
      left: 0px;
    }
  }
`;

export const ReviewContentWrapper = styled(Row)`
  @media (max-width: 1199px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const ReviewLeftContainer = styled(Col)`
  @media (max-width: 1199px) {
    order: 2;
  }
`;

export const ReviewSummaryWrapper = styled(Col)`
  padding-left: 20px;

  @media (max-width: 1199px) {
    order: 1;
    width: 100%;
    padding: 0px;
    margin-bottom: 10px;
  }
`;

export const SecondHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
