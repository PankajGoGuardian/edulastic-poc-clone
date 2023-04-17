import React from 'react'

import { StyledTable } from '../../../../../common/styled'
import { groups } from './demodata'

const GroupsList = () => {
  // prevent button click to propagate to row click
  // const safeClick = (func) => (e) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   func()
  // }
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
  ]

  return <StyledTable dataSource={groups} columns={columns} />
}

export default GroupsList
