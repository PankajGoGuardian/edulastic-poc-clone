import styled from "styled-components";
import { Tabs } from "antd";

const TabPane = Tabs.TabPane;

export const AdminHeaderWrapper = styled.div`
  width: 100%;
  position: fixed;
  z-index: 20;
  margin-top: 0;
  background: #fff;
`;
export const AdminHeaderContent = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  align-items: center;
  padding: 20px 40px 0 40px;
`;
export const Title = styled.span`
  display: inline-block;
  min-width: 140px;
  font-size: 16px;
  margin-right: 10px;
  color: gray;
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
