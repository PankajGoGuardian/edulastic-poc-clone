import React from 'react'
import { connect } from 'react-redux'
import { roleuser } from '@edulastic/constants'

import { SubHeaderWrapper, StyledTabPane, StyledSubMenu } from './styled'

import { getUserRole } from '../../../selectors/user'

const AdminHeader = ({ active, role, history, premium }) => {
  const isDistrictAdmin =
    [...roleuser.DA_SA_ROLE_ARRAY, roleuser.EDULASTIC_ADMIN].includes(role) &&
    premium

  const onSubTab = (key) => {
    if (key === 'Collaboration-Groups') {
      history.push(`/author/groups/collaborations`)
      return
    }

    history.push(`/author/groups/students`)
  }

  return (
    <SubHeaderWrapper>
      {active.mainMenu === 'Groups' && (
        <StyledSubMenu
          mode="horizontal"
          defaultActiveKey={active.subMenu}
          onTabClick={onSubTab}
        >
          {isDistrictAdmin && (
            <StyledTabPane
              tab="Collaboration Groups"
              key="Collaboration-Groups"
            />
          )}

          {isDistrictAdmin && (
            <StyledTabPane tab="Student Groups" key="Student-Groups" />
          )}
        </StyledSubMenu>
      )}
    </SubHeaderWrapper>
  )
}

export default connect(
  (state) => ({
    role: getUserRole(state),
    premium: state.user.user?.features?.premium,
  }),
  {}
)(AdminHeader)
