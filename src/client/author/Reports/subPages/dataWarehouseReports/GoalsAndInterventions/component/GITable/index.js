import React from 'react'
import Table from 'antd/lib/table'
import styled from 'styled-components'
import './index.scss'
import StatusBox from '../StatusBox'
import TableRow from '../TableRow'
import { summaryTileColors } from '../../constants'

const GITable = () => {
  const getSummaryStatusCount = (key, data) => {
    switch (key) {
      case 'met': {
        return data.filter((record) => record.current >= record.target).length
      }
      case 'not-met': {
        return data.filter((record) => record.current < record.target).length
      }
      case 'off-track': {
        return data.filter(
          (record) => record.time_left / record.total_time < 0.2
        ).length
      }
      case 'rest': {
        return data.filter(
          (record) => record.time_left / record.total_time > 0.2
        ).length
      }
      case 'fully-executed':
      case 'done': {
        return data.filter((record) => record.time_left === 0).length
      }
      case 'on-going':
      case 'in-progress': {
        return data.filter((record) => record.time_left > 0).length
      }
      default:
        return 0
    }
  }

  const data = [
    {
      key: 1,
      name: 'Goal 1',
      type: 'Academic',
      target_students: 1024,
      isExpandable: false,
      status: 'In progress',
      comments: 'Requires some modification',
      studentGroupIds: ['1', '2'],
      owner: 'ABC',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      goalCriteria: {
        applicableTo: {
          testTypes: ['T1', 'T2'],
          subjects: ['Math', 'Science'],
          standardDetails: null,
        },
        target: {
          measureType: 'Average',
          performanceBandId: '1234',
          metric: 'Average',
        },
      },
      baseline: 60,
      current: 70,
      threshold: 80,
      startDate: 1681084800000,
      endDate: 1681776000000,
      relatedInterventionIds: [1],
      createdBy: '5eee2a6b1f8f0b73355a0db3',
      userRole: 'teacher',
      districtId: '6eee2a6b1f8f0b73355a0db3',
      createdAt: 1681084800000,
      updatedAt: 1681689600000,
    },
    {
      key: 2,
      name: 'Goal 2',
      type: 'Attendance',
      target_students: 1024,
      isExpandable: true,
      status: 'In progress',
      comments: 'Requires some modification',
      studentGroupIds: ['1', '2'],
      owner: 'ABC',
      description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      goalCriteria: {
        applicableTo: {
          testTypes: ['T1', 'T2'],
          subjects: ['Math', 'Science'],
          standardDetails: null,
        },
        target: {
          measureType: 'Average',
          performanceBandId: '1234',
          metric: 'Average',
        },
      },
      baseline: 60,
      current: 80,
      threshold: 80,
      startDate: 1681516800000,
      endDate: 1682553600000,
      relatedInterventionIds: [1],
      createdBy: '5eee2a6b1f8f0b73355a0db3',
      userRole: 'teacher',
      districtId: '6eee2a6b1f8f0b73355a0db3',
      createdAt: 1681084800000,
      updatedAt: 1681689600000,
    },
  ]

  const expandData = [
    {
      key: 1,
      name: 'Intervention 1',
      type: 'Academic',
      target_students: 1024,
      baseline: 80,
      current: 80,
      target: 80,
      time_left: 30,
      total_time: 180,
      isExpandable: false,
      status: 'In progress',
      comments: 'Requires some modification',
    },
  ]

  const statusList = [
    {
      key: 1,
      items: [
        {
          id: 1,
          text: 'Done',
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusCount('done', data),
        },
        {
          id: 2,
          text: 'Not met',
          color: summaryTileColors.RED,
          unit: getSummaryStatusCount('not-met', data),
        },
        {
          id: 3,
          text: 'Met',
          color: summaryTileColors.GREEN,
          unit: getSummaryStatusCount('met', data),
        },
      ],
    },
    {
      key: 2,
      items: [
        {
          id: 1,
          text: 'Ongoing',
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusCount('on-going', data),
        },
        {
          id: 2,
          text: 'Off-track',
          color: summaryTileColors.RED,
          unit: getSummaryStatusCount('off-track', data),
        },
        {
          id: 3,
          text: 'Rest',
          color: summaryTileColors.GREEN,
          unit: getSummaryStatusCount('rest', data),
        },
      ],
    },
  ]

  return (
    <Table
      className="gi-table"
      title={() => (
        <Header>
          {statusList.map((ele) => (
            <StatusBox key={ele.key} items={ele.items} />
          ))}
        </Header>
      )}
      columns={TableRow}
      rowClassName={(record) => {
        if (!record.isExpandable) {
          return 'not-expandible'
        }
      }}
      expandedRowRender={() => (
        <Table
          className="gi-table"
          columns={TableRow}
          dataSource={expandData}
          pagination={false}
        />
      )}
      pagination={false}
      dataSource={data}
    />
  )
}

const Header = styled.div`
  display: flex;
  gap: 10px;
  div {
    flex: 1;
  }
`

export default GITable
