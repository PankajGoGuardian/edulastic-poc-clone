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
  setReportToArchive,
  currentUserId,
}) => {
  const columns = [
    {
      title: 'Report Name',
      key: 'title',
      dataIndex: 'title',
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
    },
    {
      title: 'Report Type',
      key: 'reportGroupTypeTitle',
      dataIndex: 'reportGroupTypeTitle',
      sorter: (a, b) =>
        a.reportGroupTypeTitle
          .toLowerCase()
          .localeCompare(b.reportGroupTypeTitle.toLowerCase()),
    },
    {
      title: 'Shared By',
      key: 'sharedBy',
      dataIndex: 'sharedBy',
      render: ({ _id, name }) => (_id === currentUserId ? 'me' : name),
      sorter: (a, b) => {
        const aName = a.sharedBy._id === currentUserId ? 'me' : a.sharedBy.name
        const bName = b.sharedBy._id === currentUserId ? 'me' : b.sharedBy.name
        return aName.toLowerCase().localeCompare(bName.toLowerCase())
      },
    },
    {
      title: 'Shared With',
      key: 'sharedWithNamesStr',
      dataIndex: 'sharedWithNamesStr',
      sorter: (a, b) =>
        a.sharedWithNamesStr.localeCompare(b.sharedWithNamesStr),
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
      render: (_id, { title, isGroupAdmin, sharedBy }) => (
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
              title="Revoke Sharing"
              onClick={safeClick(() => setReportToArchive({ _id, title }))}
            >
              <Tooltip title="Revoke Sharing">
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
