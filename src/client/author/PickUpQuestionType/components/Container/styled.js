import styled from "styled-components";
import {
  mobileWidth,
  desktopWidth,
  mobileWidthLarge,
  themeColor,
  textColor,
  boxShadowDefault,
  white,
  extraDesktopWidthMax,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { Menu, Affix } from "antd";
import { MainContentWrapper } from "@edulastic/common";

export const Content = styled.div`
  display: flex;
  background: #f3f3f3;

  @media (max-width: ${mobileWidth}) {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const AffixWrapper = styled(Affix)`
  position: fixed;
  width: 280px;
  top: ${props => props.theme.HeaderHeight.xs + 41}px; // 41 is value of extra offset e.g. padding, heading
  padding: 30px 0px 10px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    top: ${props => props.theme.HeaderHeight.md + 41}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    top: ${props => props.theme.HeaderHeight.xl + 41}px;
  }
`;

export const PickQuestionWrapper = styled(MainContentWrapper)`
  display: flex;
  justify-content: space-between;
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

  @media (max-width: ${desktopWidth}) {
    position: relative;
  }
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

  @media (max-width: ${desktopWidth}) {
    padding: 0px;
    .ant-menu-inline {
      .ant-menu-item-selected {
        max-width: 100%;
      }
      svg {
        margin-right: 10px;
      }
    }
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
  color: ${white};
  text-transform: uppercase;
  margin-left: auto;
  border-radius: 3px;
  min-width: 170px;
  text-align: center;

  @media (max-width: ${mobileWidthLarge}) {
    min-width: auto;
    padding: 0 15px
  }
`;

export const BackLink = styled(Link)`
  background: ${white};
  border-radius: 3px;
  height: 28px;
  font-size: 11px;
  font-weight: 600;
  line-height: 28px;
  padding: 0 20px;
  color: ${themeColor};
  text-transform: uppercase;
  box-shadow: ${boxShadowDefault};
  cursor: pointer;

  @media (max-width: ${mobileWidthLarge}) {
    padding: 0 15px;
  }
`;
