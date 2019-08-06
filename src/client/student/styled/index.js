import styled from "styled-components";

import {
  tabletWidth,
  largeDesktopWidth,
  extraDesktopWidthMax,
  mobileWidthMax,
  textColor,
  titleColor,
  title,
  backgrounds
} from "@edulastic/colors";

export const Wrapper = styled.div`
  min-height: 78vh;
  margin: 16px 46px 16px;
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
    margin: 12px 20px 12px 30px;
  }

  @media screen and (max-width: 1300px) {
    padding: 5px 15px;
  }

  @media screen and (max-width: ${mobileWidthMax}) {
    padding: 5px 20px;
    margin: 16px 26px;
    min-height: 75vh;
    display: block;
  }
`;

export const NoDataBox = styled.div`
  background: ${backgrounds.default};
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
      max-width: 48px;
      margin-bottom: 11px;
    }
    @media screen and (max-width: ${mobileWidthMax}) {
      max-width: 56px;
      margin-top: 19px;
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
      margin-bottom: 12px;
    }

    @media (max-width: ${mobileWidthMax}) {
      font-size: 18px;
      line-height: 24px;
      margin-bottom: 6px;
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
      line-height: 22px;
      max-width: 224px;
    }

    @media (max-width: ${mobileWidthMax}) {
      font-size: 13px;

      line-height: 26px;
      max-width: 100%;
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
    padding: 48px 30px 56px;
  }

  @media screen and (max-width: ${mobileWidthMax}) {
    width: calc(100% - 63px);
    min-height: 30vh;
    padding: 36px 25px;
    height: auto;
  }
`;

export const BreadcrumbWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: calc(100% - 92px);

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
    max-width: calc(100% - 88px);
  }

  @media (max-width: ${largeDesktopWidth}) {
    max-width: calc(100% - 50px);
    margin-left: 30px;

    .ant-breadcrumb-link {
      font-size: 9px;
    }
  }

  @media screen and (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;

export const Title = styled.h3`
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
  color: ${title};
  display: block;
  margin-top: 28px;
  margin-left: 12px;
  margin-bottom: 20px;
`;
