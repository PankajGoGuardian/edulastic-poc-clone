import styled from "styled-components";
import { Tabs } from "antd";

const TabPane = Tabs.TabPane;

export const AdminHeaderContent = styled.div`
	display: flex;
  justify-content:flex-start
  align-items: center;
  background-color: #fff;
  padding: 20px 40px 0 40px;
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
  background-color: #fff;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
`;
