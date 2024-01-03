import Tabs from 'antd/lib/tabs'
import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { SubHeader } from '../../../common/components/Header'
import { StyledReportContainer } from '../../../common/styled'
import FirstScreen from './common/components/FirstScreen'
import MainContainer from './common/components/MainContainer'
import CreateGI from './component/CreateGI'
import AdvancedSearch from './component/CreateGroups/AdvancedSearch'
import GoalList from './component/GoalList/GoalList'
import GroupList from './component/GroupList/GroupList'
import InterventionList from './component/InterventionList/InterventionList'
import { firstScreenContent } from './constants/common'
import {
  GOAL,
  INTERVENTION,
  SAVE_GOAL,
  SAVE_INTERVENTION,
} from './constants/form'
import useUrlSearchParams from '../../../common/hooks/useUrlSearchParams'
import { DW_GOALS_AND_INTERVENTIONS_URL } from '../../../common/constants/dataWarehouseReports'

const { TabPane } = Tabs

const GoalsAndInterventions = ({
  history,
  location,
  breadcrumbData,
  isCliUser,
}) => {
  const search = useUrlSearchParams(location)
  const [activeKey, setActiveKey] = useState('1')
  const [subActiveKey, setSubActiveKey] = useState(search.subActiveKey || '1')
  const [group, setGroup] = useState()
  const [GIData, setGIData] = useState({})
  const prevTabAndSubTab = useRef([null, null])

  const { isEditFlow = false } = GIData

  const switchSubTab = (key, _group) => {
    setGroup(_group)
    setSubActiveKey(key)
    if (search.subActiveKey) {
      history.replace(DW_GOALS_AND_INTERVENTIONS_URL)
    }
  }

  const switchTab = (key, _group) => {
    setGroup(_group)
    setActiveKey(key)
    if (key != 1) {
      if (_group) {
        switchSubTab('2', _group)
      } else {
        switchSubTab('1', _group)
      }
    } else {
      switchSubTab('1', _group)
    }
  }

  const switchToTabAndSubTab = (tab, subTab, GIFormData) => {
    setActiveKey(tab)
    setSubActiveKey(subTab)
    if (GIFormData) {
      setGIData(GIFormData)
    }
    prevTabAndSubTab.current = [activeKey, subActiveKey]
  }

  const handleCancel = () => {
    switchToTabAndSubTab(
      prevTabAndSubTab.current[0] ?? activeKey,
      prevTabAndSubTab.current[1] ?? '1'
    )
    prevTabAndSubTab.current = [null, null]
  }

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
            onEdit={(_group) => switchSubTab('2', _group)}
          />
        ),
      },
      {
        key: '2',
        label: group ? `EDIT STUDENT GROUP` : `+ ADD NEW STUDENT GROUP`,
        children: <AdvancedSearch group={group} onCancel={handleCancel} />,
      },
    ],
    2: [
      {
        key: '1',
        label: `GOALS LIST`,
        children: (
          <GoalList
            noDataContent={
              <FirstScreen
                content={firstScreenContent[activeKey]}
                onClick={() => setSubActiveKey('2')}
              />
            }
            onEdit={(GIFormData) => {
              if (GIFormData?.isEditFlow)
                switchToTabAndSubTab(
                  GIFormData.formType === INTERVENTION ? '3' : '2',
                  '2',
                  GIFormData
                )
            }}
          />
        ),
      },
      {
        key: '2',
        label: isEditFlow ? 'EDIT GOAL' : '+ ADD NEW GOAL',
        children: (
          <CreateGI
            key="goals"
            view={SAVE_GOAL}
            group={group}
            GIData={GIData}
            setGIData={setGIData}
            onCancel={handleCancel}
            onClickCreateGroup={() => switchToTabAndSubTab('1', '2')}
          />
        ),
      },
    ],
    3: [
      {
        key: '1',
        label: `INTERVENTIONS LIST`,
        children: (
          <InterventionList
            noDataContent={
              <FirstScreen
                content={firstScreenContent[activeKey]}
                onClick={() => setSubActiveKey('2')}
              />
            }
            onEdit={(GIFormData) => {
              if (GIFormData?.isEditFlow)
                switchToTabAndSubTab('3', '2', GIFormData)
            }}
          />
        ),
      },
      {
        key: '2',
        label: isEditFlow ? 'EDIT INTERVENTION' : '+ ADD NEW INTERVENTION',
        children: (
          <CreateGI
            key="intervention"
            view={SAVE_INTERVENTION}
            group={group}
            GIData={GIData}
            setGIData={setGIData}
            onCancel={handleCancel}
            onClickCreateGroup={() => switchToTabAndSubTab('1', '2')}
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
          type={GOAL}
        />
      ),
    },
    {
      key: '3',
      label: `INTERVENTIONS`,
      children: (
        <MainContainer
          tabs={content[activeKey]}
          activeKey={subActiveKey}
          onChange={switchSubTab}
          type={INTERVENTION}
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
      <SwitchTabs
        destroyInactiveTabPane
        animated={false}
        activeKey={activeKey}
        onChange={switchTab}
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
    font-size: 14px;
    font-weight: 500px;
  }
  .ant-tabs-ink-bar {
    background-color: transparent;
  }
  .ant-tabs-content {
    border-top: 1px solid #d8d8d8;
    padding: 10px;
    min-height: 550px;
  }
`

export default GoalsAndInterventions
