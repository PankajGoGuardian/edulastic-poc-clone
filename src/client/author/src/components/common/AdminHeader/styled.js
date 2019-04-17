import styled from "styled-components";
import { Tabs } from "antd";

const TabPane = Tabs.TabPane;

export const AdminHeaderContent = styled.div`
	padding: 0px 3%;
	display: flex;
  justify-content:flex-start
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #E8E8E8;
`;

export const StyledTitle = styled.h1`
  color: gray;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

export const StyledTabs = styled(Tabs)`
  margin-left: 100px;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
`;

export const StyledTabPane = styled(TabPane)``;

export const StyledSubMenu = styled(StyledTabs)`
  padding: 0 3%;
  margin-left: 0;
  background-color: #fff;
`;
