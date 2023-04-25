import { get, isEmpty, isNumber, uniq } from 'lodash'
import React, { useState } from 'react'
import StyledTable from '../../../common/components/Table'

const StudentList = ({ studentsData, isStudentLoading, handleQuickFilter }) => {
  if (isEmpty(studentsData)) return null

  const countOfStudents = get(studentsData, [0, 'totalRows'])
  const page = get(studentsData, [0, 'page'])

  const fixedTo2Decimal = (input) => {
    if (isNumber(input)) {
      return parseFloat(parseFloat(input).toFixed(2))
    }
    return input
  }

  const [tableParams, setTableParams] = useState({
    page: page || 1,
    pageSize: 10,
    sortKey: 'dimension',
    sortOrder: 'asc',
  })

  const handleTableChange = (pagination, filters, sorter) => {
    const { order = 'asc', columnKey = 'dimension' } = sorter || {}
    const { current = 1, pageSize = 10 } = pagination || {}
    setTableParams({
      page: current,
      pageSize,
      sortKey: columnKey,
      sortOrder: order.replace('end', ''),
    })
    handleQuickFilter({
      page: current,
      pageSize,
      sortKey: columnKey,
      sortOrder: order.replace('end', ''),
    })
  }

  const getUniqueSortedGrades = (grades) => {
    return uniq(
      grades
        .split(',')
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    ).join(',')
  }

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'studentName',
      key: 'dimension',
      align: 'left',
      sorter: true,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      align: 'left',
    },
    {
      title: 'Grades',
      dataIndex: 'grades',
      key: 'grades',
      align: 'left',
      render: (grades) => getUniqueSortedGrades(grades),
    },
    {
      title: 'School',
      dataIndex: 'schoolNames',
      key: 'schoolNames',
      align: 'center',
    },
    {
      title: 'Avg Score (Edulastic)',
      dataIndex: 'avgScore',
      key: 'score',
      sorter: true,
      render: (text) => {
        return fixedTo2Decimal(text)
      },
      align: 'center',
    },
    {
      title: 'Avg Attendance',
      dataIndex: 'avgAttendance',
      key: 'attendance',
      sorter: true,
      render: (text) => {
        return fixedTo2Decimal(text)
      },
      align: 'center',
    },
  ]

  const { current, pageSize } = tableParams

  return (
    <>
      <StyledTable
        loading={isStudentLoading}
        dataSource={studentsData || []}
        columns={columns}
        size="default"
        pagination={{
          pageSize,
          current: current || page,
          defaultPageSize: 10,
          total: countOfStudents,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} Students`,
        }}
        onChange={handleTableChange}
      />
    </>
  )
}

export default StudentList
