import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { SubHeaderWrapper, StyledTabPane, StyledSubMenu } from './styled'

import {
  getUserRole,
  isOrganizationDistrictSelector,
} from '../../../selectors/user'

class AdminHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
  }

  onSubTab = (key) => {
    const { history } = this.props
    history.push(`/author/${key}`)
  }

  render() {
    const { active, count = 0 } = this.props
    const schoolTabtext = count > 0 ? `Schools (${count})` : 'Schools'
    const activeKey = active.subMenu
    return (
      <SubHeaderWrapper>
        {active.mainMenu === 'Administration' && (
          <StyledSubMenu
            mode="horizontal"
            defaultActiveKey={activeKey}
            onTabClick={this.onSubTab}
          >
            <StyledTabPane tab={schoolTabtext} key="schools" />
            <StyledTabPane tab="Classes" key="classes" />
            <StyledTabPane tab="Courses" key="courses" />
            <StyledTabPane tab="Class Enrollment" key="class-enrollment" />
          </StyledSubMenu>
        )}
      </SubHeaderWrapper>
    )
  }
}

export default connect(
  (state) => ({
    role: getUserRole(state),
    isOrganizationDistrictAdmin: isOrganizationDistrictSelector(state),
  }),
  {}
)(AdminHeader)
