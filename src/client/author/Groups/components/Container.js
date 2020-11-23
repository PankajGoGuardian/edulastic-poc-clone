import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'

// components
import { roleuser } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import {
  MainWrapper,
  StyledContent,
  StyledLayout,
} from '../../../admin/Common/StyledComponents'
import AdminHeader from '../../src/components/common/AdminHeader/AdminHeader'
import CollaborationGroups from './CollaborationGroups'
import StudentGroups from './StudentGroups'

// ducks
import { getUserRole, getUserOrgId } from '../../src/selectors/user'
import {
  getGroupsSelector,
  getArchiveGroupsSelector,
  groupsLoadingSelector,
  fetchGroupsAction,
  fetchArchiveGroupsAction,
} from '../../sharedDucks/groups'
import { archiveClassAction } from '../../Classes/ducks'
import { unarchiveClassAction } from '../../ManageClass/ducks'

const menuActive = { mainMenu: 'groups', subMenu: '' }

const Container = ({ history, loading, tab, userRole }) => {
  const showCollaborationsTab =
    userRole === roleuser.DISTRICT_ADMIN && tab === 'collaborations'
  return (
    <MainWrapper>
      <AdminHeader active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout loading={loading}>
          {showCollaborationsTab ? <CollaborationGroups /> : <StudentGroups />}
        </StyledLayout>
      </StyledContent>
    </MainWrapper>
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
      groups: getGroupsSelector(state),
      archivedGroups: getArchiveGroupsSelector(state),
    }),
    {
      fetchGroups: fetchGroupsAction,
      fetchArchiveGroups: fetchArchiveGroupsAction,
      archiveGroup: archiveClassAction,
      unarchiveGroup: unarchiveClassAction,
    }
  )
)

export default enhance(Container)

Container.propTypes = {
  userRole: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
}
