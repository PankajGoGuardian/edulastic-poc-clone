import React, { useState } from 'react'
import Tabs from 'antd/lib/tabs'
import styled from 'styled-components'
import { SAVE_GOAL, SAVE_INTERVENTION } from './constants/form'
import { StyledReportContainer } from '../../../common/styled'
import { SubHeader } from '../../../common/components/Header'
import MainContainer from './component/MainContainer'
import FirstScreen from './component/FirstScreen'
import DataForm from './component/DataForm'
import GroupsList from './component/GroupsList/GroupsList'
import CreateGroup from './component/CreateGroups'

const { TabPane } = Tabs

const GoalsAndInterventions = ({ breadcrumbData, isCliUser }) => {
  const [activeKey, setActiveKey] = useState('1')

  const firstScreenContent = {
    1: {
      list: [
        'Select Target Students',
        'Specify Goal Criteria',
        'Monitor Performance',
      ],
      description: 'No goal set. Please set first goal',
      buttonText: 'SET GOAL',
    },
    2: {
      list: [
        'Select Target Students',
        'Specify Criteria',
        'Monitor Performance',
      ],
      description: 'No intervention set. Please set first intervention',
      buttonText: 'SET INTERVENTION',
    },
  }

  const content = {
    1: [
      {
        key: '1',
        label: `STUDENT GROUP LIST`,
        children: <GroupsList />,
      },
      {
        key: '2',
        label: `ADD NEW STUDENT GROUP`,
        children: <CreateGroup />,
      },
    ],
    2: [
      {
        key: '1',
        label: `GOAL LIST`,
        children: <FirstScreen content={firstScreenContent[activeKey]} />,
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
        children: <FirstScreen content={firstScreenContent[activeKey]} />,
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
    font-size: 18px;
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
