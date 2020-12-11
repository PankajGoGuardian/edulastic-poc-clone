import React, { useEffect, useState, useMemo } from 'react'
import Modal from "antd/es/Modal";
import { omitBy, isEmpty } from 'lodash'
import { EduButton, notification } from '@edulastic/common'
import { StyledTable } from '../../../common/styled'
import { ModalHeader, Search, ModalFooter, GroupsContainer } from './styles'

const tableColumns = () => {
  return [
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Members',
      dataIndex: 'groupMembers',
      key: 'groupMembers',
      align: 'center',
      render: (members) => members.length,
    },
  ]
}

const CollaborationGroupsModal = ({
  visible,
  handleCancel,
  userData,
  fetchCollaborationGroups,
  collaborationGroupList,
  isFetchingGroups,
  updateUserMembershipsRequest,
  groupId,
}) => {
  const [searchString, setSearchString] = useState('')
  const [selectedGroups, setSelectedGroups] = useState([])

  const filteredGroupList = useMemo(
    () =>
      collaborationGroupList.filter((g) =>
        g.name.toLowerCase().includes(searchString.toLowerCase())
      ),
    [collaborationGroupList, searchString]
  )

  useEffect(() => {
    fetchCollaborationGroups()
  }, [])

  useEffect(() => {
    const groupsAlreadySelected = []
    filteredGroupList.forEach((g) => {
      if (g.groupMembers.some((m) => m._id === userData._id)) {
        groupsAlreadySelected.push(g._id)
      }
    })
    setSelectedGroups(groupsAlreadySelected)
  }, [userData, filteredGroupList])

  const handleUpdateGroups = () => {
    const removeMembershipFrom = []
    const addMembershipTo = []
    filteredGroupList.forEach((g) => {
      if (
        !g.groupMembers.some((m) => m._id === userData._id) &&
        selectedGroups.includes(g._id)
      ) {
        addMembershipTo.push(g._id)
      } else if (
        g.groupMembers.some((m) => m._id === userData._id) &&
        !selectedGroups.includes(g._id)
      ) {
        removeMembershipFrom.push(g._id)
      }
    })

    if (!removeMembershipFrom.length && !addMembershipTo.length) {
      return notification({
        msg: `Please select or unselect some groups(s) to update Memberships for ${userData.name}`,
      })
    }

    let data = {
      removeMembershipFrom,
      addMembershipTo,
      groupMember: {
        name: userData.name,
        username: userData.username,
        _id: userData._id,
        isAdmin: false,
      },
    }
    data = omitBy(data, isEmpty)
    updateUserMembershipsRequest({
      data,
      groupId,
    })
    handleCancel()
  }

  const header = (
    <ModalHeader>
      <span>Collaboration Groups</span>
      <span>
        Selected <span>{selectedGroups.length}</span>
      </span>
    </ModalHeader>
  )

  const footer = (
    <ModalFooter>
      <EduButton isGhost onClick={handleCancel}>
        Cancel
      </EduButton>
      <EduButton onClick={handleUpdateGroups}>Update Groups</EduButton>
    </ModalFooter>
  )

  const rowSelection = {
    selectedRowKeys: selectedGroups,
    onChange: (rowKeys) => {
      setSelectedGroups(rowKeys)
    },
  }

  return (
    <Modal
      title={header}
      visible={visible}
      onCancel={handleCancel}
      width="680px"
      footer={footer}
    >
      <div>
        <div>{`Group Membership of ${userData.name}`}</div>
        <div style={{ marginTop: '15px' }}>
          <Search
            placeholder="Search Group"
            style={{ height: '35px' }}
            onChange={(e) => setSearchString(e.target.value)}
            value={searchString}
          />
        </div>
        <GroupsContainer>
          <StyledTable
            dataSource={filteredGroupList}
            columns={tableColumns()}
            rowSelection={rowSelection}
            rowKey={(data) => data._id}
            pagination={false}
            scroll={{ y: 200, scrollToFirstRowOnChange: true }}
            loading={isFetchingGroups}
          />
        </GroupsContainer>
      </div>
    </Modal>
  )
}

export default CollaborationGroupsModal
