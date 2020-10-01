import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

// components
import { Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { StyledTable, StyledTableCell } from '../styled'

// constants
import { STATUS_LIST } from '../../transformers'

const GradebookTable = ({
  dataSource,
  assessments,
  selectedRows,
  setSelectedRows,
  windowWidth,
  windowHeight,
  t,
}) => {
  const colWidth = windowWidth >= parseInt(extraDesktopWidthMax) ? 170 : 150
  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      fixed: 'left',
      width: colWidth + 40,
      render: (data, row) => (
        <Tooltip title={data}>
          <Link to={`/author/gradebook/student/${row._id}`}>
            {data || t('common.anonymous')}
          </Link>
        </Tooltip>
      ),
      sorter: (a, b) =>
        (a.studentName || '-')
          .toLowerCase()
          .localeCompare((b.studentName || '-').toLowerCase()),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      width: colWidth + 80,
      render: (data) => <Tooltip title={data}>{data || '-'}</Tooltip>,
      sorter: (a, b) =>
        (a.className || '-')
          .toLowerCase()
          .localeCompare((b.className || '-').toLowerCase()),
    },
    {
      title: 'Last Activity Date',
      dataIndex: 'laDate',
      width: colWidth + 20,
      render: (data) =>
        data ? moment(data).format('MMM Do, YYYY h:mm A') : '-',
      sorter: (a, b) => (a.laDate || 0) - (b.laDate || 0),
    },
    ...assessments.map((ass) => ({
      title: ass.name,
      key: ass.id,
      align: 'center',
      width: colWidth,
      render: (_, row) => {
        const { classId, assessments: assMap } = row
        // assignmentId might not be equal to assessmentId (ass.id)
        // due to grouping of assignments by report key & name (check "../transformers")
        const { assignmentId, status, percentScore } = assMap[ass.id] || {}
        const color = STATUS_LIST.find((s) => s.id === status)?.color
        return assignmentId && classId && status !== 'UN ASSIGNED' ? (
          <Link to={`/author/classBoard/${assignmentId}/${classId}`}>
            <StyledTableCell color={color}>
              {percentScore || '-'}
            </StyledTableCell>
          </Link>
        ) : (
          <StyledTableCell>{percentScore || '-'}</StyledTableCell>
        )
      },
      sorter: (a, b) =>
        (a.assessments[ass.id]?.percentScore || '-').localeCompare(
          b.assessments[ass.id]?.percentScore || '-'
        ),
    })),
  ]
  return (
    <StyledTable
      rowKey={(row) => `${row._id}_${row.classId}`}
      columns={columns}
      dataSource={dataSource}
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: setSelectedRows,
      }}
      pagination={false}
      scroll={{ x: '100%', y: windowHeight - 250 }}
    />
  )
}

export default withNamespaces('student')(GradebookTable)
