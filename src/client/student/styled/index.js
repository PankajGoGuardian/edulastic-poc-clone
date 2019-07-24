import styled from "styled-components";

import {
  tabletWidth,
  largeDesktopWidth,
  extraDesktopWidthMax,
  mobileWidthMax,
  textColor,
  titleColor
} from "@edulastic/colors";

export const Wrapper = styled.div`
  min-height: 78vh;
  margin: 24px 46px 16px;
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background-color: ${props => props.theme.assignment.cardContainerBgColor};
  padding: 5px 30px;
  position: relative;

  @media screen and (min-width: ${extraDesktopWidthMax}) {
    min-height: 75vh;
    margin: 16px 44px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    margin: 12px 30px;
  }

  @media screen and (max-width: 1300px) {
    padding: 5px 15px;
  }

  @media screen and (max-width: ${mobileWidthMax}) {
    padding: 5px 20px;
    margin: 16px 20px;
    min-height: 65vh;
    display: block;
  }
`;

export const NoDataBox = styled.div`
  background: #f3f3f3;
  width: 396px;
  height: 351px;
  position: absolute;
  left: 50%;
  border-radius: 6px;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 54px 30px 50px;

  img {
    width: 65px;
    margin-bottom: 20px;

    @media (min-width: ${extraDesktopWidthMax}) {
      margin-bottom: 35px;
    }

    @media (max-width: ${largeDesktopWidth}) {
      margin-bottom: 15px;
    }
  }

  h4 {
    color: ${titleColor};
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;

    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 22px;
      margin-bottom: 15px;
    }

    @media (max-width: ${largeDesktopWidth}) {
      font-size: 16px;
      margin-bottom: 15px;
    }
  }

  p {
    color: ${textColor};
    font-size: 14px;
    line-height: 26px;
    margin: 0;
    max-width: 290px;

    @media (max-width: ${largeDesktopWidth}) {
      font-size: 12px;
    }
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 414px;
    height: 386px;
    padding: 66px 30px 50px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 295px;
    height: 263px;
    padding: 66px 30px 50px;
  }

  @media screen and (max-width: ${mobileWidthMax}) {
    width: calc(100% - 50px);
    min-height: 50vh;
    padding: 36px 30px;
    height: auto;
  }
`;

export const BreadcrumbWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 46px;
  margin-right: 40px;

  .ant-breadcrumb-link {
    color: ${props => props.theme.breadcrumbs.breadcrumbTextColor};
    font-size: ${props => props.theme.breadcrumbs.breadcrumbTextSize};
    text-transform: uppercase;
    font-weight: 600;

    a {
      color: ${props => props.theme.breadcrumbs.breadcrumbLinkColor};
    }
  }

  @media screen and (min-width: ${extraDesktopWidthMax}) {
    margin-left: 44px;
    margin-right: 44px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    margin-left: 30px;
    margin-right: 30px;

    .ant-breadcrumb-link {
      font-size: 9px;
    }
  }

  @media screen and (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;
