import React, { useEffect, useState } from 'react'
import Tabs from 'antd/lib/tabs'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { actions } from './ducks/actionReducers'
import {
  goalsList,
  isGoalsDataLoading,
  interventionsList,
  isInterventionsDataLoading,
} from './ducks/selectors'
import { firstScreenContent } from './constants/common'
import { SAVE_GOAL, SAVE_INTERVENTION } from './constants/form'
import { StyledReportContainer } from '../../../common/styled'
import { SubHeader } from '../../../common/components/Header'
import MainContainer from './component/MainContainer'
import FirstScreen from './component/FirstScreen'
import GITable from './component/GITable'
import DataForm from './component/DataForm'
import GroupList from './component/GroupList/GroupList'
import CreateGroup from './component/CreateGroups'

const { TabPane } = Tabs

const GoalsAndInterventions = ({
  breadcrumbData,
  isCliUser,
  goalsData,
  goalsDataLoading,
  fetchGoalsList,
  interventionsData,
  interventionsDataLoading,
  fetchInterventionsList,
}) => {
  const [activeKey, setActiveKey] = useState('1')
  const [subActiveKey, setSubActiveKey] = useState('1')
  const [group, setGroup] = useState()

  const switchSubTab = (key) => {
    setSubActiveKey(key)
  }

  const switchTab = (key, _group) => {
    setGroup(_group)
    setActiveKey(key)
    if (_group) {
      switchSubTab('2')
    }
  }

  useEffect(() => {
    switch (Number(activeKey)) {
      case 2:
        if (goalsData.length === 0) {
          fetchGoalsList()
        }
        break
      case 3:
        if (interventionsData.length === 0) {
          fetchInterventionsList()
        }
        break
      default:
        break
    }
  }, [activeKey])

  const content = {
    1: [
      {
        key: '1',
        label: `STUDENT GROUP LIST`,
        children: (
          <GroupList
            noDataContent={
              <FirstScreen
                content={firstScreenContent[activeKey]}
                onClick={() => setSubActiveKey('2')}
              />
            }
            onGoal={(_group) => switchTab('2', _group)}
            onIntervention={(_group) => switchTab('3', _group)}
          />
        ),
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
        children:
          goalsData.length === 0 ? (
            <FirstScreen
              content={firstScreenContent[activeKey]}
              onClick={() => setSubActiveKey('2')}
            />
          ) : (
            <GITable loading={goalsDataLoading} data={goalsData} />
          ),
      },
      {
        key: '2',
        label: `ADD NEW GOAL`,
        children: (
          <DataForm
            view={SAVE_GOAL}
            group={group}
            onCancel={() => switchSubTab('1')}
          />
        ),
      },
    ],
    3: [
      {
        key: '1',
        label: `INTERVENTION LIST`,
        children:
          interventionsData.length === 0 ? (
            <FirstScreen
              content={firstScreenContent[activeKey]}
              onClick={() => setSubActiveKey('2')}
            />
          ) : (
            <GITable
              loading={interventionsDataLoading}
              data={interventionsData}
            />
          ),
      },
      {
        key: '2',
        label: `ADD NEW INTERVENTION`,
        children: (
          <DataForm
            view={SAVE_INTERVENTION}
            group={group}
            onCancel={() => switchSubTab('1')}
          />
        ),
      },
    ],
  }

  const items = [
    {
      key: '1',
      label: `STUDENT GROUPS`,
      children: (
        <MainContainer
          tabs={content[activeKey]}
          activeKey={subActiveKey}
          onChange={switchSubTab}
        />
      ),
    },
    {
      key: '2',
      label: `GOALS`,
      children: (
        <MainContainer
          tabs={content[activeKey]}
          activeKey={subActiveKey}
          onChange={switchSubTab}
        />
      ),
    },
    {
      key: '3',
      label: `INTERVENTION`,
      children: (
        <MainContainer
          tabs={content[activeKey]}
          activeKey={subActiveKey}
          onChange={switchSubTab}
        />
      ),
    },
  ]

  return (
    <StyledReportContainer>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      />
      <SwitchTabs animated={false} activeKey={activeKey} onChange={switchTab}>
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
    border-top: 1px solid #d8d8d8;
    padding: 10px;
    height: 600px;
  }
`

export default connect(
  (state) => ({
    goalsData: goalsList(state),
    goalsDataLoading: isGoalsDataLoading(state),
    interventionsData: interventionsList(state),
    interventionsDataLoading: isInterventionsDataLoading(state),
  }),
  {
    fetchGoalsList: actions.getGoalsList,
    fetchInterventionsList: actions.getInterventionsList,
  }
)(GoalsAndInterventions)
