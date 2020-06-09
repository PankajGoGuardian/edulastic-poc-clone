import styled from "styled-components";

import {
  tabletWidth,
  largeDesktopWidth,
  extraDesktopWidthMax,
  mobileWidthMax,
  textColor,
  titleColor,
  title,
  backgrounds,
  white,
  themeColor,
  linkColor
} from "@edulastic/colors";

export const Wrapper = styled.div`
  min-height: ${props => props.minHeight || "75vh"};
  margin: 15px 0px;
  border-radius: 10px;
  background-color: ${props => props.bgColor || props.theme.assignment.cardContainerBgColor};
  position: relative;
  display: ${props => props.display || ""};
  justify-content: ${props => (props.display === "flex" ? "space-between" : "")};
  @media screen and (max-width: ${mobileWidthMax}) {
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
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0px;
  margin-top: 0;

  .ant-breadcrumb-link {
    color: ${props => props.theme.breadcrumbs.breadcrumbTextColor};
    text-transform: uppercase;

    a {
      color: ${props => props.theme.breadcrumbs.breadcrumbLinkColor};
    }
  }

  @media (max-width: ${largeDesktopWidth}) {
    .ant-breadcrumb-link {
      font-size: 9px;
    }
  }

  @media screen and (max-width: ${tabletWidth}) {
    flex-direction: column;
  }
`;

export const Title = styled.h3`
  font-size: ${props => props.theme.header.headerTitleSecondaryTextSize};
  font-weight: bold;
  line-height: 24px;
  color: ${props => props.theme.headerTitleSecondaryTextColor || title};
  display: block;
  margin-left: 12px;
  margin: 15px 0px;
`;

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
  margin: 20px 0px 0px;
  padding: 0 5px;
  font-size: 11px;
  color: ${linkColor};
  .ant-pagination-item-active {
    a {
      color: ${white};
    }
    background-color: ${themeColor};
  }
  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
    border: 0;
    a {
      border: none;
    }
  }

  .ant-pagination {
    margin: 0 10px;
    &li {
      .ant-pagination-item a {
        color: ${linkColor};
      }
    }
  }
`;
