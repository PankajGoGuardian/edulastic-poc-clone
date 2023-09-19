import React from 'react'
import styled from 'styled-components'
import { Tabs as AntTabs, Tooltip } from 'antd'
import MainKeyboard from './MainKeyboard'
import { TAB_BUTTONS } from '../constants/keyboardButtons'

const { TabPane } = AntTabs

const tabLabel = (label, name) => <Tooltip title={name}>{label}</Tooltip>

const renderTabBar = (props, DefaultTabBar) => {
  const handleTouchEnd = (node) => (e) => {
    e?.preventDefault()
    const { onTabClick } = props
    if (typeof onTabClick === 'function') {
      onTabClick(node.key, e)
    }
  }

  return (
    <DefaultTabBar {...props}>
      {(node) =>
        React.cloneElement(React.Children.only(node), {
          onTouchEnd: handleTouchEnd(node),
        })
      }
    </DefaultTabBar>
  )
}

const FullKeybord = ({ onInput, numbers }) => (
  <Tabs renderTabBar={renderTabBar}>
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
    padding: 8px 10px;
  }

  & .ant-tabs-bar {
    margin-bottom: 4px;
  }

  & .ant-tabs-nav-scroll {
    padding: 0px 24px;
  }
`
