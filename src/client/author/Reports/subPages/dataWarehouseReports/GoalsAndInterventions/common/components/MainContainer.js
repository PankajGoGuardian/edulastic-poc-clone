import { IconQuestionCircle } from '@edulastic/icons'
import Tabs from 'antd/lib/tabs'
import React from 'react'
import styled from 'styled-components'
import { darkGrey, green } from '@edulastic/colors'
import { helpLinks, reportNavType } from '@edulastic/constants/const/report'
import { StyledEduButton } from '../../../../../common/styled'

const { TabPane } = Tabs

const MainContainer = ({ tabs, activeKey, onChange }) => {
  const helpUrl = helpLinks[reportNavType.DW_GOALS_AND_INTERVENTIONS_REPORT]
  return (
    <Header>
      <SwitchTabs
        destroyInactiveTabPane
        animated={false}
        activeKey={activeKey}
        onChange={onChange}
      >
        {tabs.map((item) => (
          <TabPane tab={item.label} key={item.key}>
            {item.children}
          </TabPane>
        ))}
      </SwitchTabs>
      <HelpButton
        data-cy="help"
        data-testid="help"
        isGhost
        href={helpUrl}
        target="_black"
        rel="noopener noreferrer"
      >
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
    font-weight: bold;
  }
  .ant-tabs-ink-bar {
    background-color: ${green} !important;
  }
  .ant-tabs-nav .ant-tabs-tab-active,
  .ant-tabs-nav .ant-tabs-tab:hover {
    color: ${green};
  }
  .ant-tabs-content {
    border: none !important;
    padding: 10px;
  }
  .ant-tabs-tab {
    color: ${darkGrey};
  }
  .ant-tabs-tab-active.ant-tabs-tab {
    color: ${green};
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

export default MainContainer
