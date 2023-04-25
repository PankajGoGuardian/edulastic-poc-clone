import { IconQuestionCircle } from '@edulastic/icons'
import Tabs from 'antd/lib/tabs'
import React from 'react'
import styled from 'styled-components'
import { darkGrey, textBlackColor } from '@edulastic/colors'
import { StyledEduButton } from '../../../../../common/styled'

const { TabPane } = Tabs

const MainContainer = ({ tabs, activeKey, onChange }) => {
  return (
    <Header>
      <SwitchTabs animated={false} activeKey={activeKey} onChange={onChange}>
        {tabs.map((item) => (
          <TabPane tab={item.label} key={item.key}>
            {item.children}
          </TabPane>
        ))}
      </SwitchTabs>
      <HelpButton data-cy="help" data-testid="help" isGhost>
        <IconQuestionCircle width={10} height={10} />
        HELP
      </HelpButton>
    </Header>
  )
}

const HelpButton = styled(StyledEduButton)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const SwitchTabs = styled(Tabs)`
  width: 100%;
  .ant-tabs-bar {
    border-bottom: none;
  }
  .ant-tabs-tab {
    font-size: 12px !important;
  }
  .ant-tabs-ink-bar {
    background-color: #1ab394 !important;
  }
  .ant-tabs-nav .ant-tabs-tab-active,
  .ant-tabs-nav .ant-tabs-tab:hover {
    color: #000;
  }
  .ant-tabs-content {
    border: none !important;
    padding: 10px;
  }
  .ant-tabs-tab {
    color: ${darkGrey};
  }
  .ant-tabs-tab-active.ant-tabs-tab {
    color: ${textBlackColor};
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

export default MainContainer
