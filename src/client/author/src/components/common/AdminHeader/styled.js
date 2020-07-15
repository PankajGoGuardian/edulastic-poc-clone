import styled from "styled-components";
import { Tabs } from "antd";
import {
  themeColor,
  white,
  tabletWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  largeDesktopWidth,
  smallDesktopWidth
} from "@edulastic/colors";

const { TabPane } = Tabs;

export const AdminHeaderWrapper = styled.div`
  position: fixed;
  left: 0px;
  right: 0px;
  z-index: 20;
  padding: 0px 30px 0px 130px;
  background: ${themeColor};
  height: ${props => props.theme.HeaderHeight.xs}px;
  display: flex;
  align-items: center;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => props.theme.HeaderHeight.xl}px;
  }

  @media (max-width: ${tabletWidth}) {
    padding: 0px 20px;
  }
`;

export const AdminHeaderContent = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-left: 10px;
  width: 100%;
  .ant-tabs-bar {
    margin: 0px;
  }
`;
export const Title = styled.span`
  display: inline-block;
  font-size: 18px;
  margin-right: 20px;
  color: ${white};
  font-weight: 600;
  white-space: nowrap;

  @media screen and (min-width: ${mediumDesktopExactWidth}) {
    font-size: 22px;
  }
`;
export const StyledTitle = styled.h1`
  color: gray;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
  min-width: 200px;
`;

export const StyledTabs = styled(Tabs)`
  width: 100%;
  @media (max-width: ${largeDesktopWidth}) {
    width: 650px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    width: 500px;
  }
  &.ant-tabs {
    height: 52px;
    margin-bottom: -11px;
    padding: 1px 0px;
    &.ant-tabs-card {
      .ant-tabs-card-bar {
        border: none;
        .ant-tabs-nav-container {
          height: 52px;
          .ant-tabs-nav-wrap,
          .ant-tabs-nav-scroll {
            overflow: visible;

            @media (max-width: ${largeDesktopWidth}) {
              overflow: hidden;
            }
          }
        }
        .ant-tabs-nav {
          div {
            display: flex;
            align-items: center;
          }
        }
        .ant-tabs-tab {
          cursor: pointer;
          padding: 0 12px;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          box-shadow: none;
          align-items: center;
          justify-content: center;
          height: 50px;
          border-radius: 0;
          background: #e5e5e5;
          color: #87929b;
          white-space: nowrap;
          border-radius: 4px 4px 0px 0px;
          margin: 0 2px;
          border: 1px solid #e5e5e5;

          &-active {
            background: ${white};
            color: #2f4151;
            height: 51px;
            margin-bottom: -1px;
            border: 1px solid #2f4151;
            border-bottom-color: ${white};
          }
        }
      }
    }
  }
`;

export const StyledTabPane = styled(TabPane)``;

export const StyledSubMenu = styled(Tabs)`
  padding: 0 3%;
  margin-left: 0;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
`;
