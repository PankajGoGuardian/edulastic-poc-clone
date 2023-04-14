import React from 'react'
import { isEmpty } from 'lodash'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import { StyledTable } from '../../../../../common/styled'

const SampleStudents = ({ studentsData }) => {
  if (isEmpty(studentsData)) return null

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstname',
      key: 'firstName',
      align: 'left',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      key: 'lastName',
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: 'School',
      dataIndex: 'school',
      key: 'school',
    },
    {
      title: 'Average Academic Edulastic',
      dataIndex: 'avg_academic_edulastic',
      key: 'avg_academic_edulastic',
    },
    {
      title: 'Average Academic NWEA',
      dataIndex: 'avg_academic_nwea',
      key: 'avg_academic_nwea',
    },
    {
      title: 'Average Attendance',
      dataIndex: 'avg_attendance',
      key: 'avg_attendance',
    },
  ]
  return (
    <CsvTable
      columns={columns}
      dataSource={studentsData}
      tableToRender={StyledTable}
      scroll={{ x: '100%' }}
      pagination={{
        pageSize: 10,
      }}
    />
  )
}

export default SampleStudents
