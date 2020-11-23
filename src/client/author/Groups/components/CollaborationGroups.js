import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'

// components
import { Spin } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { roleuser } from '@edulastic/constants'
import { IconUsers } from '@edulastic/icons'
import { EduButton, FlexContainer } from '@edulastic/common'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { StyledFilterDiv } from '../../../admin/Common/StyledComponents'
import {
  LeftFilterDiv,
  MainContainer,
  SubHeaderWrapper,
  TableContainer,
  ClickableComponent,
} from '../../../common/styled'
import Breadcrumb from '../../src/components/Breadcrumb'
import AdminSubHeader from '../../src/components/common/AdminSubHeader/GroupSubHeader'

// ducks
import { getUserRole, getUserOrgId } from '../../src/selectors/user'
import {
  getArchiveGroupsSelector,
  groupsLoadingSelector,
} from '../../sharedDucks/groups'

import CreateCollabGroupModel from './CreateCollabGroupModel'
import {
  collaborationGroupSelector,
  fetchCollaborationGroupsAction,
} from '../ducks'
import CollaborationGroupsTable from './CollaborationGroupsTable'

const menuActive = { mainMenu: 'Groups', subMenu: 'Collaboration-Groups' }

const getBreadcrumbData = (userRole) => [
  {
    title:
      userRole === roleuser.SCHOOL_ADMIN ? 'MANAGE SCHOOL' : 'MANAGE DISTRICT',
    to:
      userRole === roleuser.SCHOOL_ADMIN
        ? '/author/classes'
        : '/author/districtprofile',
  },
  {
    title: 'GROUPS',
    to: '',
  },
]

const CollaborationGroups = ({
  t,
  history,
  userRole,
  loading,
  collabGroups = [],
  fetchCollaborationGroups,
}) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    fetchCollaborationGroups()
  }, [])

  const breadcrumbData = getBreadcrumbData(userRole)

  const handleCancelCreateGroup = () => setShowCreateGroup(false)

  const filteredGroups = collabGroups.filter(({ name }) =>
    name.toLowerCase().startsWith(searchName)
  )

  const handleShowGroup = (id) => history.push(`/author/collaborations/${id}`)

  const handleShowCreateGroup = () => setShowCreateGroup(true)

  return (
    <MainContainer>
      <SubHeaderWrapper>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </SubHeaderWrapper>
      <AdminSubHeader active={menuActive} history={history} />
      <StyledFilterDiv>
        <LeftFilterDiv width={60}>
          <SearchInputStyled
            placeholder={t('common.searchbyname')}
            onSearch={setSearchName}
            onChange={(e) => setSearchName(e.target.value.toLowerCase())}
            height="36px"
          />
          <EduButton
            style={{ fontSize: '11px' }}
            type="primary"
            onClick={setShowCreateGroup}
          >
            {t('group.createGroup')}
          </EduButton>
        </LeftFilterDiv>
      </StyledFilterDiv>

      <TableContainer>
        {collabGroups.length ? (
          loading ? (
            <Spin size="large" />
          ) : (
            <CollaborationGroupsTable
              t={t}
              data={filteredGroups}
              handleEditGroup={handleShowGroup}
              handleShowGroup={handleShowGroup}
              setArchiveModalProps={() => {}}
            />
          )
        ) : (
          <FlexContainer alignItems="center" justifyContent="center">
            <ClickableComponent onClick={handleShowCreateGroup}>
              <IconUsers height="70px" width="80px" />
              <p>No groups created.</p>
              <p>Click to create groups</p>
            </ClickableComponent>
          </FlexContainer>
        )}
      </TableContainer>

      {showCreateGroup && (
        <CreateCollabGroupModel
          visible={showCreateGroup}
          handleCancel={handleCancelCreateGroup}
        />
      )}
    </MainContainer>
  )
}

const enhance = compose(
  withRouter,
  withNamespaces('manageDistrict'),
  connect(
    (state) => ({
      userRole: getUserRole(state),
      districtId: getUserOrgId(state),
      loading: groupsLoadingSelector(state),
      collabGroups: collaborationGroupSelector(state),
      archivedGroups: getArchiveGroupsSelector(state),
    }),
    {
      fetchCollaborationGroups: fetchCollaborationGroupsAction,
    }
  )
)

export default enhance(CollaborationGroups)

CollaborationGroups.propTypes = {
  userRole: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  collabGroups: PropTypes.array.isRequired,
  fetchCollaborationGroups: PropTypes.func.isRequired,
}
