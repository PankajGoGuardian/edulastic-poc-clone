import React from 'react'
import moment from 'moment'

import { Tooltip } from 'antd'
import { themeColor } from '@edulastic/colors'
import { IconTrash } from '@edulastic/icons'
import {
  TableContainer,
  StyledTable,
  StyledTableButton,
} from '../../../../common/styled'

// prevent button click to propagate to row click
const safeClick = (func) => (e) => {
  e.preventDefault()
  e.stopPropagation()
  func()
}

const SharedReportsTable = ({
  sharedReportsData,
  showReport,
  archiveReport,
  currentUserId,
}) => {
  const columns = [
    {
      title: 'Report Name',
      key: 'title',
      dataIndex: 'title',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Report Type',
      key: 'reportGroupTypeTitle',
      dataIndex: 'reportGroupTypeTitle',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Shared By',
      key: 'sharedBy',
      dataIndex: 'sharedBy',
      render: ({ name }) => name,
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Shared With',
      key: 'sharedWith',
      dataIndex: 'sharedWith',
      render: (data) => (data || []).map(({ name }) => name).join(', '),
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (data) => moment(data).format('MMMM DD, YYYY'),
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      key: '_id',
      dataIndex: '_id',
      align: 'right',
      render: (id, { isGroupAdmin, sharedBy }) => (
        <div style={{ whiteSpace: 'nowrap', padding: '0 10px' }}>
          {/* TODO: Uncomment to update shared report */}
          {/* {sharedBy._id === currentUserId ? (
            <StyledTableButton onClick={safeClick(() => {})} title="Edit">
              <Tooltip title="Edit">
                <IconPencilEdit color={themeColor} />
              </Tooltip>
            </StyledTableButton>
          ) : null} */}
          {isGroupAdmin || sharedBy._id === currentUserId ? (
            <StyledTableButton
              title="Archive"
              onClick={safeClick(() => archiveReport({ id }))}
            >
              <Tooltip title="Archive">
                <IconTrash color={themeColor} />
              </Tooltip>
            </StyledTableButton>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <TableContainer>
      <StyledTable
        columns={columns}
        dataSource={sharedReportsData}
        onRow={(record) => ({
          onClick: () => showReport(record),
        })}
      />
    </TableContainer>
  )
}

export default SharedReportsTable
