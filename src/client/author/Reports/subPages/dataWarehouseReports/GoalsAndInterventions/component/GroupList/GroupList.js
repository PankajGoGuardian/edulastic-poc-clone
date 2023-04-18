import React, { useEffect } from 'react'

import connect from 'react-redux/es/connect/connect'
import ActionButton from '../../common/components/ActionButton'
import StyledTable from '../../common/components/Table'
import { actions } from '../../ducks/actionReducers'
import { groupList, isGroupLoading } from '../../ducks/selectors'

// const viewReportOptions = [
//   { id: 'summary', label: 'View Summary' },
//   { id: 'trends', label: 'View Trends' },
//   { id: 'attendance', label: 'View Attendance' },
//   { id: 'earlyWarning', label: 'View Early Warning' },
//   { id: 'efficacy', label: 'View Efficacy' },
// ]

const actionOptions = [
  { id: 'goal', label: 'Set Goal' },
  { id: 'trends', label: 'Set Intervention' },
]

const { getGroupList } = actions

const GroupList = ({
  _getGroupList,
  _groupList,
  _isGroupLoading,
  onGoal,
  onIntervention,
}) => {
  useEffect(() => {
    _getGroupList()
  }, [])

  const onAction = ({ key }) => {
    switch (key) {
      case 'item_1':
        onGoal()
        break
      case 'item_2':
        onIntervention()
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
      sorter: (a, b) => a.studentCount - b.studentCount,
    },
    {
      title: 'Goals',
      dataIndex: 'goals',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Interventions',
      dataIndex: 'interventions',
      align: 'center',
      sorter: (a, b) => a.studentCount - b.studentCount,
    },
    // {
    //   key: 'viewReport',
    //   render: () => {
    //     return (
    //       <ActionButton options={options} onAction={onAction}>
    //         View Reports
    //       </ActionButton>
    //     )
    //   },
    // },
    {
      key: 'viewReport',
      render: () => {
        return (
          <ActionButton options={actionOptions} onAction={onAction}>
            Actions
          </ActionButton>
        )
      },
    },
  ]
  return (
    <StyledTable
      loading={_isGroupLoading}
      dataSource={_groupList || []}
      columns={columns}
    />
  )
}

export default connect(
  (state) => ({
    _groupList: groupList(state),
    _isGroupLoading: isGroupLoading(state),
  }),
  {
    _getGroupList: getGroupList,
  }
)(GroupList)
