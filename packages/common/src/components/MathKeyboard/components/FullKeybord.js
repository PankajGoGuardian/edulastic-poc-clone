import React from "react";
import styled from "styled-components";
import { Tabs as AntTabs } from "antd";
import MainKeyboard from "./MainKeyboard";
import { TAB_BUTTONS } from "../constants/keyboardButtons";

const { TabPane } = AntTabs;

const FullKeybord = ({ onInput }) => (
  <Tabs defaultActiveKey="GREEK">
    {TAB_BUTTONS.map(({ label, key, buttons }) => (
      <TabPane tab={label} key={key}>
        <MainKeyboard onInput={onInput} btns={buttons} fullKeybord />
      </TabPane>
    ))}
  </Tabs>
);

export default FullKeybord;

const Tabs = styled(AntTabs)`
  & .ant-tabs-nav .ant-tabs-tab {
    margin: 0px;
    padding: 8px 8px;
  }

  & .ant-tabs-bar {
    margin-bottom: 4px;
  }
`;
