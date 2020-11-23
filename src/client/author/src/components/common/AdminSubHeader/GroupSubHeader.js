import React from 'react'
import { connect } from 'react-redux'
import { roleuser } from '@edulastic/constants'

import { SubHeaderWrapper, StyledTabPane, StyledSubMenu } from './styled'

import { getUserRole } from '../../../selectors/user'

const AdminHeader = (props) => {
  const { active, role, history } = props

  const isDistrictAdmin = role === roleuser.DISTRICT_ADMIN

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
  }),
  {}
)(AdminHeader)
