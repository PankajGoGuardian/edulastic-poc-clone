import React from 'react'

import moment from 'moment'
import Tooltip from "antd/es/Tooltip";
import { themeColor } from '@edulastic/colors'
import { IconPencilEdit, IconTrash } from '@edulastic/icons'
import { StyledTable, StyledTableButton } from '../../../common/styled'

const CollaborationGroupsTable = ({
  t,
  data,
  handleEditGroup,
  handleShowGroup,
  setArchiveModalProps,
  hideEditableInstances,
}) => {
  // prevent button click to propagate to row click
  const safeClick = (func) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    func()
  }
  const columns = [
    {
      title: t('group.name'),
      dataIndex: 'name',
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: t('group.createdAt'),
      dataIndex: 'name',
      sorter: (a, b) => a.createdAt - b.createdAt,
      render: (_, { createdAt }) => (
        <span>{moment(createdAt).format('DD-MMM-YYYY')}</span>
      ),
    },
    {
      title: t('group.groupMembers'),
      dataIndex: 'groupMembers',
      align: 'center',
      render: (_, { groupMembers }) => <span>{groupMembers.length}</span>,
    },
    {
      dataIndex: '_id',
      align: 'right',
      render: (_, { _id, name }) =>
        hideEditableInstances ? null : (
          <div style={{ whiteSpace: 'nowrap', padding: '0 10px' }}>
            <StyledTableButton
              onClick={safeClick(() => handleEditGroup(_id))}
              title="Edit"
            >
              <Tooltip title="Edit">
                <IconPencilEdit color={themeColor} />
              </Tooltip>
            </StyledTableButton>

            <StyledTableButton
              title="Archive"
              onClick={safeClick(() =>
                setArchiveModalProps({ visible: true, _id, name })
              )}
            >
              <Tooltip title="Archive">
                <IconTrash color={themeColor} />
              </Tooltip>
            </StyledTableButton>
          </div>
        ),
    },
  ]

  return (
    <StyledTable
      rowKey={(record) => record._id}
      dataSource={data}
      columns={columns}
      onRow={({ _id }) => ({
        onClick: () => handleShowGroup(_id),
      })}
    />
  )
}

export default CollaborationGroupsTable
