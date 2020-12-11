import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'

import Spin from "antd/es/Spin";
import { withNamespaces } from '@edulastic/localization'
import { roleuser } from '@edulastic/constants'
import { EduButton, TypeToConfirmModal } from '@edulastic/common'
import { LightGreenSpan } from '@edulastic/common/src/components/TypeToConfirmModal/styled'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { StyledFilterDiv } from '../../../admin/Common/StyledComponents'
import {
  LeftFilterDiv,
  MainContainer,
  SubHeaderWrapper,
  TableContainer,
} from '../../../common/styled'
import Breadcrumb from '../../src/components/Breadcrumb'
import AdminSubHeader from '../../src/components/common/AdminSubHeader/GroupSubHeader'

// ducks
import { getUserRole, getUserOrgId } from '../../src/selectors/user'

import CreateCollabGroupModel from './CreateCollabGroupModel'
import {
  archiveCollaborationGroupAction,
  collaborationGroupSelector,
  fetchCollaborationGroupsAction,
  groupsLoadingSelector,
  resetCollaborationGroupsAction,
} from '../ducks'
import CollaborationGroupsTable from './CollaborationGroupsTable'
import NoDataNotification from '../../Collaboration/components/NoDataNotification'

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
  archiveGroup,
  resetCollaborationGroups,
  hideBreadcrumbs,
  hideEditableInstances,
}) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [archiveModalProps, setArchiveModalProps] = useState({
    visible: false,
    _id: '',
    name: '',
  })

  useEffect(() => {
    fetchCollaborationGroups()
    return () => resetCollaborationGroups()
  }, [])

  const breadcrumbData = getBreadcrumbData(userRole)
  const filteredGroups = collabGroups.filter(({ name }) =>
    name.toLowerCase().includes(searchName.toLowerCase())
  )

  const handleCancelCreateGroup = () => setShowCreateGroup(false)
  const handleShowGroup = (id) => history.push(`/author/collaborations/${id}`)
  const handleShowCreateGroup = () => setShowCreateGroup(!hideEditableInstances)
  const resetArchiveModalProps = () =>
    setArchiveModalProps({ visible: false, _id: '', name: '' })

  return (
    <MainContainer>
      {!hideBreadcrumbs && (
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
        </SubHeaderWrapper>
      )}
      <AdminSubHeader active={menuActive} history={history} />
      <StyledFilterDiv>
        <LeftFilterDiv width={60}>
          <SearchInputStyled
            placeholder={t('common.searchbyname')}
            onSearch={setSearchName}
            onChange={(e) => setSearchName(e.target.value.toLowerCase())}
            height="36px"
          />
          {!hideEditableInstances && (
            <EduButton
              style={{ fontSize: '11px' }}
              type="primary"
              onClick={handleShowCreateGroup}
            >
              {t('group.createGroup')}
            </EduButton>
          )}
        </LeftFilterDiv>
      </StyledFilterDiv>

      <TableContainer>
        {loading ? (
          <Spin size="large" />
        ) : collabGroups.length ? (
          <CollaborationGroupsTable
            t={t}
            data={filteredGroups}
            handleEditGroup={handleShowGroup}
            handleShowGroup={handleShowGroup}
            setArchiveModalProps={setArchiveModalProps}
            hideEditableInstances={hideEditableInstances}
          />
        ) : (
          <NoDataNotification
            heading={
              hideEditableInstances
                ? 'You are not part of any collaboration group(s).'
                : 'No groups created'
            }
            description={
              hideEditableInstances ? '' : 'Click here to create groups.'
            }
            clickHandler={handleShowCreateGroup}
            height="60vh"
            hideEditableInstances={hideEditableInstances}
          />
        )}
      </TableContainer>

      {showCreateGroup && (
        <CreateCollabGroupModel
          visible={showCreateGroup}
          handleCancel={handleCancelCreateGroup}
        />
      )}

      {archiveModalProps.visible && (
        <TypeToConfirmModal
          modalVisible={archiveModalProps.visible}
          title="Archive Group"
          handleOnOkClick={() => {
            archiveGroup({
              id: archiveModalProps._id,
              name: archiveModalProps.name,
            })
            resetArchiveModalProps()
          }}
          wordToBeTyped="ARCHIVE"
          primaryLabel="Are you sure you want to archive the following group?"
          secondaryLabel={
            <p style={{ margin: '5px 0' }}>
              <LightGreenSpan>{archiveModalProps.name}</LightGreenSpan>
            </p>
          }
          closeModal={resetArchiveModalProps}
          okButtonText="Archive"
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
    }),
    {
      fetchCollaborationGroups: fetchCollaborationGroupsAction,
      archiveGroup: archiveCollaborationGroupAction,
      resetCollaborationGroups: resetCollaborationGroupsAction,
    }
  )
)

export default enhance(CollaborationGroups)

CollaborationGroups.propTypes = {
  userRole: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  collabGroups: PropTypes.array.isRequired,
  fetchCollaborationGroups: PropTypes.func.isRequired,
  archiveGroup: PropTypes.func.isRequired,
  resetCollaborationGroups: PropTypes.func.isRequired,
}
