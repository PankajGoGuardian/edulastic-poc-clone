import styled from "styled-components";
import { mobileWidth, desktopWidth, mediumDesktopWidth, themeColor, textColor } from "@edulastic/colors";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { Menu, Affix } from "antd";

export const Content = styled.div`
  display: flex;
  background: #f3f3f3;

  @media (max-width: ${mobileWidth}) {
    display: flex;
    flex-wrap: wrap;

    & > div {
      &: nth-child(2) {
        transition: 0.3s;
        position: fixed;
        z-index: 999;
        min-width: 100vw;
        transform: ${props => (!props.showMobileView ? "translateX(-100vw)" : "translateX(0px)")};
      }
      &:last-child {
        min-width: 100vw;
        height: 100vh;
      }
    }
  }
`;

export const AffixWrapper = styled(Affix)`
  position: fixed;
  width: 280px;
  top: 140px;
  padding: 20px 0px;

  @media (max-width: ${mediumDesktopWidth}) {
    top: 96px;
  }
`;

export const PickQuestionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 126px 30px 30px;

  @media (max-width: ${mediumDesktopWidth}) {
    padding-top: 80px;
  }
`;

export const LeftSide = styled.div`
  width: 280px;
  padding: 0px;
  margin: 0px;
  position: relative;

  .scrollbar-container {
    height: calc(100vh - 150px);
    padding-right: 30px;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  .ant-menu-item:after {
    left: 0;
    right: auto;
    border-right: 4px solid #4aac8b;
  }

  .ant-menu-horizontal {
    padding-left: 26px;
    height: 62px;

    .ant-menu-item {
      height: 62px;
      font-size: 11px;
      padding-top: 15px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: ${themeColor};
      text-transform: uppercase;
    }
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    border-bottom: solid 2px ${themeColor};
  }

  .ant-menu-inline {
    margin-top: 16px;
  }

  .ant-menu-inline .ant-menu-item {
    font-size: 12px;
    font-weight: 600;
    color: #434b5d;
    display: flex;
    align-items: center;
    padding: 0px 16px !important;
    text-transform: uppercase;
  }

  .ant-menu-inline .ant-menu-item-selected {
    color: ${themeColor};
    background: #fff !important;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    border-radius: 0 10px 10px 0;

    svg {
      fill: ${themeColor};
    }

    &:after {
      border-color: ${themeColor};
    }
  }

  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 20px;
    margin-top: 0px;
  }

  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`;

export const RightSide = styled.div`
  position: relative;
  width: calc(100% - 280px);
  margin-left: auto;
  background: #f3f3f8;
  margin: 0px;

  .ant-breadcrumb {
    &-link,
    &-separator {
      font-size: 11.3px;
      text-transform: uppercase;
      color: ${textColor};

      a {
        color: ${textColor};
        font-size: 11.3px;
        text-transform: uppercase;
      }
    }
    &-separator {
      margin: 0 10px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    height: auto !important;
  }
`;

export const LeftMenuWrapper = styled(Menu)`
  background: transparent;
  border: 0;
  &.ant-menu-inline {
    margin: 0px;
  }
  svg {
    fill: #434b5d;
    width: 21px !important;
    height: 21px !important;
    margin-right: 20px;
  }
`;

export const MenuTitle = styled.div`
  display: block;
  width: 280px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
  position: fixed;
`;

export const StyledModal = styled(Modal)``;

export const StyledModalContainer = styled.div`
  padding: 40px 16px 0;

  .ant-menu-item:after {
    left: 0;
    right: auto;
    border-right: 3px solid #4aac8b;
  }

  .ant-menu-horizontal {
    padding-left: 26px;
    height: 62px;

    .ant-menu-item {
      height: 62px;
      font-size: 11px;
      padding-top: 15px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: ${themeColor};
      text-transform: uppercase;
    }
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    border-bottom: solid 2px ${themeColor};
  }

  .ant-menu-inline {
    margin-top: 16px;
  }

  .ant-menu-inline .ant-menu-item {
    font-size: 12px;
    font-weight: 600;
    color: #434b5d;
    display: flex;
    align-items: center;
    padding-left: 21px !important;
    text-transform: uppercase;
  }

  .ant-menu-inline .ant-menu-item-selected {
    color: ${themeColor};
    max-width: 275px;
    background: #fff !important;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
    border-radius: 0 10px 10px 0;

    svg {
      fill: ${themeColor};
    }

    &:after {
      border-color: ${themeColor};
    }
  }

  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 26px;
  }
`;

export const MobileButtons = styled.div`
  display: none;

  @media (max-width: ${desktopWidth}) {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
`;

export const SelectWidget = styled.div`
  height: 40px;
  line-height: 40px;
  padding: 0 20px
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  background: ${themeColor};
  color: #fff;
  text-transform: uppercase;
  margin-left: auto;
  border-radius: 3px;
  min-width: 170px;
  text-align: center;
`;

export const BackLink = styled(Link)`
  background: #fff;
  border-radius: 3px;
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  line-height: 28px;
  padding: 0 20px;
  color: ${themeColor};
  text-transform: uppercase;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  cursor: pointer;
`;
