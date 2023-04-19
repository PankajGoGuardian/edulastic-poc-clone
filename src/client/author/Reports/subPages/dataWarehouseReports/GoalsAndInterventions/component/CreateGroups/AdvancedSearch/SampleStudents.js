import React from 'react'
import { isEmpty } from 'lodash'
import CsvTable from '../../../../../../common/components/tables/CsvTable'
import { StyledTable } from '../../../../../../common/styled'

const SampleStudents = ({ studentsData }) => {
  if (isEmpty(studentsData)) return null

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      align: 'left',
    },
    {
      title: 'Grades',
      dataIndex: 'grades',
      key: 'grades',
    },
    {
      title: 'School',
      dataIndex: 'schoolNames',
      key: 'schoolNames',
    },
    {
      title: 'Average Academic Edulastic',
      dataIndex: 'avgAttendance',
      key: 'avgAttendance',
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
