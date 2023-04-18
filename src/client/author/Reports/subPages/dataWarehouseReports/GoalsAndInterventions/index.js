import React, { useState } from 'react'
import Tabs from 'antd/lib/tabs'
import styled from 'styled-components'
import { firstScreenContent } from './constants/common'
import { SAVE_GOAL, SAVE_INTERVENTION } from './constants/form'
import { StyledReportContainer } from '../../../common/styled'
import { SubHeader } from '../../../common/components/Header'
import MainContainer from './component/MainContainer'
import FirstScreen from './component/FirstScreen'
import GITable from './component/GITable'
import DataForm from './component/DataForm'
import GroupList from './component/GroupList/GroupList'

const { TabPane } = Tabs

const GoalsAndInterventions = ({ breadcrumbData, isCliUser }) => {
  const [activeKey, setActiveKey] = useState('1')
  const [isSetGoal, setGoal] = useState(false)
  const [isSetIntervention, setIntervention] = useState(false)

  const content = {
    1: [
      {
        key: '1',
        label: `STUDENT GROUP LIST`,
        children: (
          <GroupList
            noDataContent={
              <FirstScreen content={firstScreenContent[activeKey]} />
            }
          />
        ),
      },
      {
        key: '2',
        label: `ADD NEW STUDENT GROUP`,
        children: <>Advance search</>,
      },
    ],
    2: [
      {
        key: '1',
        label: `GOAL LIST`,
        children: isSetGoal ? (
          <GITable />
        ) : (
          <FirstScreen
            content={firstScreenContent[activeKey]}
            handleSet={setGoal}
          />
        ),
      },
      {
        key: '2',
        label: `ADD NEW GOAL`,
        children: <DataForm view={SAVE_GOAL} />,
      },
    ],
    3: [
      {
        key: '1',
        label: `INTERVENTION LIST`,
        children: isSetIntervention ? (
          <GITable />
        ) : (
          <FirstScreen
            content={firstScreenContent[activeKey]}
            handleSet={setIntervention}
          />
        ),
      },
      {
        key: '2',
        label: `ADD NEW INTERVENTION`,
        children: <DataForm view={SAVE_INTERVENTION} />,
      },
    ],
  }

  const items = [
    {
      key: '1',
      label: `STUDENT GROUPS`,
      children: <MainContainer tabs={content[activeKey]} />,
    },
    {
      key: '2',
      label: `GOALS`,
      children: <MainContainer tabs={content[activeKey]} />,
    },
    {
      key: '3',
      label: `INTERVENTION`,
      children: <MainContainer tabs={content[activeKey]} />,
    },
  ]

  return (
    <StyledReportContainer>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      />
      <SwitchTabs
        animated={false}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
      >
        {items.map((item) => (
          <TabPane tab={item.label} key={item.key}>
            {item.children}
          </TabPane>
        ))}
      </SwitchTabs>
    </StyledReportContainer>
  )
}

const SwitchTabs = styled(Tabs)`
  .ant-tabs-bar {
    border-bottom: none;
  }
  .ant-tabs-tab {
    font-weight: bold;
    font-size: 16px;
  }
  .ant-tabs-ink-bar {
    background-color: transparent;
  }
  .ant-tabs-content {
    border: 1px solid #b8b7b7;
    padding: 10px;
    border-radius: 12px;
    position: relative;
    height: 600px;
  }
`

export default GoalsAndInterventions
