import React, { useEffect, useState, useMemo } from 'react'
import { EduButton, notification } from '@edulastic/common'
import { Tooltip } from 'antd'
import { IconPlus, IconTrash } from '@edulastic/icons'
import NoDataNotification from './NoDataNotification'
import { StyledTable } from '../../../common/styled'
import { Wrapper, ActionsContainer, Search, StyledSelect } from './styles'
import AddMembersModal from './AddMembersModal'
import CollaborationGroupsModal from './CollaborationGroupsModal'

const memberActions = {
  MAKE_GROUP_ADMIN: 'Make Group Admin',
  REMOVE_GROUP_ADMIN: 'Remove Group Admin',
  REMOVE_FROM_GROUP: 'Remove Selected From Group',
}

const tableColumns = (handleRemoveMember, handleMemberClick, isAdmin) => {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (data, { isAdmin: _isAdmin }) => {
        return (
          <div className="member-name">
            <span>{data}</span>
            {_isAdmin && <span className="admin-tag">Group Admin</span>}
          </div>
        )
      },
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Membership',
      dataIndex: 'membershipCount',
      key: 'membershipCount',
      align: 'center',
      render: (count, row) => {
        return <div onClick={() => handleMemberClick(row)}>{count || 0}</div>
      },
    },
    {
      title: '',
      dataIndex: '_id',
      width: '10%',
      render: (id) =>
        isAdmin ? (
          <span className="table-action" onClick={() => handleRemoveMember(id)}>
            <Tooltip title="Remove Member">
              <IconTrash />
            </Tooltip>
          </span>
        ) : null,
    },
  ]
}

const Members = ({
  membersList = [],
  groupId,
  receiveSchools,
  schoolList,
  districtId,
  fetchUsers,
  userList,
  addMembersRequest,
  makeGroupAdmin,
  removeGroupAdmin,
  removeFromGroup,
  isFetchingUsers,
  isAddingMembers,
  fetchCollaborationGroups,
  collaborationGroupList,
  isFetchingGroups,
  updateUserMembershipsRequest,
  isAdmin,
}) => {
  const [showAddMembersModal, setMembersModalVisibilty] = useState(false)
  const [showGroupsModal, setGroupsModalVisibility] = useState(false)
  const [selectedRowKeys, setSeletedRowKeys] = useState([])
  const [memberSearchString, setMemberSearchString] = useState('')
  const [selectedUserData, setSelectedUserData] = useState({})

  const filteredMembers = useMemo(
    () =>
      membersList.filter(
        (m) =>
          m.name.toLowerCase().includes(memberSearchString) ||
          m.username.toLowerCase().includes(memberSearchString)
      ),
    [membersList, memberSearchString]
  )

  useEffect(() => {
    if (!isAddingMembers) {
      setMembersModalVisibilty(false)
    }
  }, [isAddingMembers])

  const handleMemberAction = (action) => {
    if (!selectedRowKeys.length) {
      return notification({
        type: 'warning',
        msg: 'Atleast one member from the group must be selected.',
      })
    }

    const payload = {
      groupId,
      data: { groupMemberIds: selectedRowKeys },
      count: selectedRowKeys.length,
    }

    if (action === memberActions.MAKE_GROUP_ADMIN) {
      makeGroupAdmin({ ...payload, data: { ...payload.data, isAdmin: true } })
    } else if (action === memberActions.REMOVE_GROUP_ADMIN) {
      removeGroupAdmin({
        ...payload,
        data: { ...payload.data, isAdmin: false },
      })
    } else if (action === memberActions.REMOVE_FROM_GROUP) {
      removeFromGroup(payload)
    }
    setSeletedRowKeys([])
  }

  const handleRemoveMember = (id) => {
    const payload = {
      groupId,
      data: { groupMemberIds: [id] },
      count: 1,
    }
    removeFromGroup(payload)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys) => {
      setSeletedRowKeys(rowKeys)
    },
  }

  const handleMemberClick = (data) => {
    setSelectedUserData(data)
    setGroupsModalVisibility(true)
  }

  return (
    <Wrapper>
      <ActionsContainer>
        {isAdmin && (
          <EduButton mr={15} onClick={() => setMembersModalVisibilty(true)}>
            <IconPlus />
            Add Members
          </EduButton>
        )}
        <Search
          placeholder="Search by Members"
          onChange={(e) => setMemberSearchString(e.target.value)}
          value={memberSearchString}
        />
        {isAdmin && (
          <StyledSelect placeholder="Actions" width="330px" value="Actions">
            {Object.values(memberActions).map((text) => (
              <StyledSelect.Option
                key={text}
                onClick={() => handleMemberAction(text)}
              >
                {text}
              </StyledSelect.Option>
            ))}
          </StyledSelect>
        )}
      </ActionsContainer>

      {membersList.length > 0 ? (
        <StyledTable
          dataSource={filteredMembers}
          columns={tableColumns(handleRemoveMember, handleMemberClick, isAdmin)}
          rowSelection={isAdmin && rowSelection}
          rowKey={(data) => data._id}
          pagination={false}
        />
      ) : (
        <NoDataNotification
          heading="No members added to this group"
          description="Click here to start adding members."
          clickHandler={() => setMembersModalVisibilty(true)}
          height="80vh"
        />
      )}
      {showAddMembersModal && (
        <AddMembersModal
          visible={showAddMembersModal}
          handleCancel={() => setMembersModalVisibilty(false)}
          receiveSchools={receiveSchools}
          schoolList={schoolList}
          districtId={districtId}
          fetchUsers={fetchUsers}
          groupId={groupId}
          userList={userList}
          membersList={membersList}
          addMembersRequest={addMembersRequest}
          isFetchingUsers={isFetchingUsers}
          isAddingMembers={isAddingMembers}
        />
      )}

      {showGroupsModal && isAdmin && (
        <CollaborationGroupsModal
          visible={showGroupsModal}
          userData={selectedUserData}
          fetchCollaborationGroups={fetchCollaborationGroups}
          collaborationGroupList={collaborationGroupList}
          isFetchingGroups={isFetchingGroups}
          handleCancel={() => setGroupsModalVisibility(false)}
          updateUserMembershipsRequest={updateUserMembershipsRequest}
          groupId={groupId}
        />
      )}
    </Wrapper>
  )
}

export default Members
