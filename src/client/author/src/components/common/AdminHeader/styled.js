import styled from "styled-components";
import { Tabs } from "antd";
import {
  themeColor,
  mediumDesktopWidth,
  white,
  tabletWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  greyThemeDark2
} from "@edulastic/colors";

const {TabPane} = Tabs;

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
  width: 100%;
  .ant-tabs-bar {
    margin: 0px;
  }
`;
export const Title = styled.span`
  display: inline-block;
  font-size: 22px;
  margin-right: 20px;
  color: ${white};
  font-weight: 600;
  white-space: nowrap;

  @media screen and (max-width: ${mediumDesktopWidth}) {
    font-size: 18px;
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
  &.ant-tabs {
    &.ant-tabs-card {
      .ant-tabs-card-bar {
        border: none;
        .ant-tabs-nav {
          div {
            display: flex;
            align-items: center;
          }
        }
        .ant-tabs-tab {
          cursor: pointer;
          color: ${white};
          padding: 0 20px;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          border: none;
          box-shadow: none;
          align-items: center;
          justify-content: center;
          height: 40px;
          border-radius: 0;
          background: #f2f3f2;
          color: ${greyThemeDark2};
          white-space: nowrap;
          border-radius: 5px;
          margin: 0 3px;
          &-active {
            background: #b3bcc4;
            color: ${white};
          }

          @media screen and (max-width: ${mediumDesktopWidth}) {
            height: 36px;
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
