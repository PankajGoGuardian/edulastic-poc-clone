import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Spin } from 'antd'
import { roleuser } from '@edulastic/constants'
import { withRouter } from 'react-router-dom'
import Header from './Header'
import Members from './Members'
import {
  fetchGroupByIdAction,
  fetchUsersAction,
  addMembersAction,
  makeGroupAdminAction,
  removeGroupAdminAction,
  removeFromGroupAction,
  updateUserMembershipsAction,
  updateGroupNameAction,
} from '../ducks'
import { receiveSchoolsAction } from '../../Schools/ducks'
import { getUserOrgId } from '../../src/selectors/user'
import Breadcrumb from '../../src/components/Breadcrumb'
import { fetchCollaborationGroupsAction } from '../../Groups/ducks'
import CreateCollabGroupModel from '../../Groups/components/CreateCollabGroupModel'

const Container = ({
  groupDetails = {},
  isFetchingDetails = false,
  fetchGroupById,
  match,
  receiveSchools,
  schoolList = [],
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
  userId,
  role,
  updateGroupNameRequest,
}) => {
  const [currentTab, setCurrentTab] = useState('members')
  const [showEditGroupModal, setEditGroupModalVisibility] = useState(false)

  const { id: groupId } = match.params

  useEffect(() => {
    fetchGroupById(groupId)
  }, [])

  const breadcrumbData = [
    {
      title: 'COLLABORATION GROUPS',
      to: '/author/groups/collaborations',
    },
    {
      title: groupDetails?.name?.toUpperCase() || 'GROUP',
      to: '',
    },
  ]

  const membersList = groupDetails.groupMembers || []

  const isAdmin =
    membersList.find((x) => x._id === userId)?.isAdmin ||
    [
      roleuser.DISTRICT_ADMIN,
      roleuser.EDULASTIC_ADMIN,
      roleuser.SCHOOL_ADMIN,
    ].includes(role)

  return (
    <>
      <Header
        currentTab={currentTab}
        onClickHandler={(value) => setCurrentTab(value)}
        headingText={isFetchingDetails ? '' : groupDetails.name || ''}
        onTitleClick={() => setEditGroupModalVisibility(true)}
        isAdmin={isAdmin}
      />
      <Breadcrumb
        data={breadcrumbData}
        style={{ position: 'unset', padding: '15px' }}
      />

      {isFetchingDetails ? (
        <div style={{ height: '80vh' }}>
          <Spin />
        </div>
      ) : (
        currentTab === 'members' && (
          <Members
            membersList={membersList}
            isAdmin={isAdmin}
            groupId={groupId}
            receiveSchools={receiveSchools}
            schoolList={schoolList}
            districtId={districtId}
            fetchUsers={fetchUsers}
            userList={userList}
            addMembersRequest={addMembersRequest}
            isFetchingUsers={isFetchingUsers}
            isAddingMembers={isAddingMembers}
            makeGroupAdmin={makeGroupAdmin}
            removeGroupAdmin={removeGroupAdmin}
            removeFromGroup={removeFromGroup}
            fetchCollaborationGroups={fetchCollaborationGroups}
            collaborationGroupList={collaborationGroupList}
            isFetchingGroups={isFetchingGroups}
            updateUserMembershipsRequest={updateUserMembershipsRequest}
          />
        )
      )}
      {showEditGroupModal && (
        <CreateCollabGroupModel
          visible={showEditGroupModal}
          isEditMode
          handleCancel={() => setEditGroupModalVisibility(false)}
          name={groupDetails?.name}
          updateGroupNameRequest={updateGroupNameRequest}
          groupId={groupId}
        />
      )}
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      groupDetails: state.collaborationGroup.groupData,
      isFetchingDetails: state.collaborationGroup.fetchingGroupDetails,
      schoolList: state.schoolsReducer.data,
      userList: state.collaborationGroup.userList,
      isFetchingUsers: state.collaborationGroup.fetchingUsers,
      isAddingMembers: state.collaborationGroup.isAddingMembers,
      collaborationGroupList: state.groupsReducer.collaborationGroupsData,
      isFetchingGroups: state.groupsReducer.loading,
      districtId: getUserOrgId(state),
      userId: state.user.user?._id,
      role: state.user.user?.role,
    }),
    {
      fetchGroupById: fetchGroupByIdAction,
      receiveSchools: receiveSchoolsAction,
      fetchUsers: fetchUsersAction,
      addMembersRequest: addMembersAction,
      makeGroupAdmin: makeGroupAdminAction,
      removeGroupAdmin: removeGroupAdminAction,
      removeFromGroup: removeFromGroupAction,
      fetchCollaborationGroups: fetchCollaborationGroupsAction,
      updateUserMembershipsRequest: updateUserMembershipsAction,
      updateGroupNameRequest: updateGroupNameAction,
    }
  )
)

export default enhance(Container)
