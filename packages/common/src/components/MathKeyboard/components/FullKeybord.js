import React from 'react'
import styled from 'styled-components'
import AntTabs from "antd/es/Tabs";
import Tooltip from "antd/es/Tooltip";
import MainKeyboard from './MainKeyboard'
import { TAB_BUTTONS } from '../constants/keyboardButtons'

const { TabPane } = AntTabs

const tabLabel = (label, name) => <Tooltip title={name}>{label}</Tooltip>

const FullKeybord = ({ onInput, numbers }) => (
  <Tabs>
    {TAB_BUTTONS.map(({ label, name, key, buttons }) => (
      <TabPane tab={tabLabel(label, name)} key={key}>
        <MainKeyboard
          onInput={onInput}
          btns={buttons}
          numbers={key === 'GENERAL' ? numbers : null}
          fullKeybord
        />
      </TabPane>
    ))}
  </Tabs>
)

export default FullKeybord

const Tabs = styled(AntTabs)`
  & .ant-tabs-nav .ant-tabs-tab {
    margin: 0px;
    padding: 8px 12px;
  }

  & .ant-tabs-bar {
    margin-bottom: 4px;
  }

  & .ant-tabs-nav-scroll {
    padding: 0px 24px;
  }
`
