import React, { useEffect } from 'react'

import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import connect from 'react-redux/es/connect/connect'
import { fetchGroupsAction } from '../../../../../../sharedDucks/groups'
import { actions } from '../../ducks'
import {
  goalsList,
  groupList,
  interventionsList,
  isGoalsDataLoading,
  isGroupLoading,
  isInterventionsDataLoading,
} from '../../ducks/selectors'
import ActionMenu from '../../common/components/ActionMenu'
import { getDataSource } from './utils'
import StyledTable from '../../common/components/Table'
import EllipsisText from '../../common/components/EllipsisText'

// const viewReportOptions = [
//   { id: 'summary', label: 'View Summary' },
//   { id: 'trends', label: 'View Trends' },
//   { id: 'attendance', label: 'View Attendance' },
//   { id: 'earlyWarning', label: 'View Early Warning' },
//   { id: 'efficacy', label: 'View Efficacy' },
// ]

const actionOptions = [
  { id: 'goal', label: 'Set Goal' },
  { id: 'intervention', label: 'Set Intervention' },
  // { id: 'edit', label: 'Edit' },
]

const GroupList = ({
  _getGroupList,
  _groupList,
  _isGroupLoading,
  onGoal,
  onIntervention,
  noDataContent,
  _goalsList,
  _interventionList,
  _getGoalsList,
  _isGoalsDataLoading,
  _getInterventionsList,
  _isInterventionsDataLoading,
}) => {
  useEffect(() => {
    if ((_groupList || []).length === 0) _getGroupList()
    if ((_goalsList || []).length === 0) _getGoalsList()
    if ((_interventionList || []).length === 0) _getInterventionsList()
  }, [])

  const onAction = (key, record) => {
    switch (key) {
      case 'goal':
        onGoal(record)
        break
      case 'intervention':
        onIntervention(record)
        break
      default:
    }
  }

  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'name',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      align: 'center',
      sorter: (a, b) => (a.studentCount || 0) - (b.studentCount || 0),
    },
    {
      title: 'Goals',
      dataIndex: 'goals',
      ellipsis: true,
      sorter: (a, b) =>
        (a.goals || '')
          .toLowerCase()
          .localeCompare((b.goals || '').toLowerCase()),
      render: (goals) => <EllipsisText lines={2}>{goals}</EllipsisText>,
    },
    {
      title: 'Interventions',
      dataIndex: 'interventions',
      ellipsis: true,
      sorter: (a, b) =>
        (a.interventions || '')
          .toLowerCase()
          .localeCompare((b.interventions || '').toLowerCase()),
      render: (interventions) => (
        <EllipsisText lines={2}>{interventions}</EllipsisText>
      ),
    },
    // {
    //   key: 'viewReport',
    //   render: () => {
    //     return (
    //       <ActionMenu
    //         type="group"
    //         includeDelete={false}
    //         title="VIEW REPORTS"
    //         options={viewReportOptions}
    //         onAction={() => {}}
    //       />
    //     )
    //   },
    // },
    {
      key: 'viewReport',
      width: 150,
      render: (data, record) => {
        return (
          <ActionMenu
            type="group"
            title="ACTIONS"
            options={actionOptions}
            onAction={({ key }) => onAction(key, record)}
          />
        )
      },
    },
  ]

  const dataSource = getDataSource(_groupList, _goalsList, _interventionList)
  const loading =
    _isGroupLoading || _isGoalsDataLoading || _isInterventionsDataLoading

  return (
    <EduIf condition={loading}>
      <EduThen>
        <SpinLoader />
      </EduThen>
      <EduElse>
        <>
          <EduIf condition={!loading && dataSource.length > 0}>
            <StyledTable
              loading={_isGroupLoading}
              dataSource={dataSource}
              columns={columns}
              size="middle"
              pagination={false}
              scroll={{
                y: 500,
              }}
            />
          </EduIf>
          <EduIf condition={!loading && dataSource.length === 0}>
            {noDataContent}
          </EduIf>
        </>
      </EduElse>
    </EduIf>
  )
}

export default connect(
  (state) => ({
    _groupList: groupList(state),
    _isGroupLoading: isGroupLoading(state),
    _goalsList: goalsList(state),
    _interventionList: interventionsList(state),
    _isGoalsDataLoading: isGoalsDataLoading(state),
    _isInterventionsDataLoading: isInterventionsDataLoading(state),
  }),
  {
    _getGroupList: fetchGroupsAction,
    _getGoalsList: actions.getGoalsList,
    _getInterventionsList: actions.getInterventionsList,
  }
)(GroupList)
