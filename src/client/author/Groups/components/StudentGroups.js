import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router'

// components
import { withNamespaces } from '@edulastic/localization'
import GroupListContainer from './GroupListContainer'

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

const StudentGroups = ({
  t,
  match,
  history,
  userRole,
  districtId,
  loading,
  groups,
  archivedGroups,
  fetchGroups,
  fetchArchiveGroups,
  archiveGroup,
  unarchiveGroup,
}) => {
  const [showActive, setShowActive] = useState(true)
  const [studentGroups, setStudentGroups] = useState([])

  useEffect(() => {
    if (showActive) {
      fetchGroups()
    } else {
      fetchArchiveGroups()
    }
  }, [showActive])

  useEffect(() => {
    setStudentGroups(
      (showActive ? groups : archivedGroups)
        .filter(({ _id, type }) => _id && type === 'custom')
        .map((g) => ({
          ...g,
          name: g.name || '-',
          studentCount: g.studentCount || 0,
        }))
    )
  }, [groups, archivedGroups])

  return (
    <GroupListContainer
      t={t}
      match={match}
      history={history}
      userRole={userRole}
      districtId={districtId}
      loading={loading}
      studentGroups={studentGroups}
      showActive={showActive}
      setShowActive={setShowActive}
      archiveGroup={archiveGroup}
      unarchiveGroup={unarchiveGroup}
    />
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

export default enhance(StudentGroups)

StudentGroups.propTypes = {
  userRole: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  fetchArchiveGroups: PropTypes.func.isRequired,
}
