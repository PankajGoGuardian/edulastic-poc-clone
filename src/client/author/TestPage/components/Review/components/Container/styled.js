import styled from "styled-components";
import {
  mainBgColor,
  fadedGrey,
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

export const TestItemsRow = styled(Row)`
  @media (max-width: ${smallDesktopWidth}) {
    display: flex;
    flex-direction: column-reverse;
  }
`;

export const ReviewSummaryWrapper = styled(Col)`
  padding-left: 20px;

  @media (max-width: ${mediumDesktopExactWidth}) {
    display: ${({ show }) => (show ? "block" : "none")};
  }

  @media (max-width: ${smallDesktopWidth}) {
    padding: 0px;
    margin-bottom: 16px;
  }

  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    width: 100%;
  }

  @media (max-width: ${desktopWidth}) {
    display: block;
    padding-left: 0px;
    margin-top: 15px;
  }
`;

export const ReviewSummaryBar = styled.div`
  display: none;

  @media (max-width: ${mediumDesktopExactWidth}) {
    display: block;
    top: 0px;
    right: -30px;
    z-index: 0;
    width: 20px;
    height: 70vh;
    position: absolute;
    border-radius: 4px;
    background: ${fadedGrey};
  }

  @media (max-width: ${smallDesktopWidth}) {
    display: none;
  }
`;

export const TestItemsCol = styled(Col)`
  position: relative;

  @media (max-width: ${mediumDesktopExactWidth}) {
    ${({ showSummary }) => !showSummary && "width: 100%;"}
  }
`;
