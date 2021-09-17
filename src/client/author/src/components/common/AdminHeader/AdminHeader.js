import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { get } from 'lodash'

// components
import { MainHeader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { IconSettings } from '@edulastic/icons'
import { AdminHeaderContent, StyledTabPane, StyledTabs } from './styled'

// ducks
import { getManageTabLabelSelector, getUserRole } from '../../../selectors/user'
import { getSchoolAdminSettingsAccess } from '../../../../DistrictPolicy/ducks'

class AdminHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
  }

  onHeaderTabClick = (key) => {
    const { history, role } = this.props
    // eslint-disable-next-line default-case
    switch (key) {
      case 'administration':
        history.push(`/author/schools`)
        return
      case 'users':
        if (role === 'district-admin' || role === 'school-admin') {
          history.push(`/author/users/teacher`)
        }
        return
      case 'settings':
        if (role === roleuser.DISTRICT_ADMIN) {
          history.push(`/author/settings/districtpolicies`)
        } else {
          history.push(`/author/settings/schoolpolicies`)
        }
        return
      case 'content':
        history.push(`/author/content/collections`)
        return
      // case "districtprofile":
      // case "schoolprofile":
      // case "schools":
      // case "classes":
      // case "groups":
      // case "courses":
      // case "class-enrollment":
      default:
        history.push(`/author/${key}`)
    }
  }

  render() {
    const {
      active,
      role,
      schoolLevelAdminSettings,
      manageTabLabel,
      children,
      enableStudentGroups,
    } = this.props
    const isDA = role === roleuser.DISTRICT_ADMIN
    const defaultTab = 'Profile'
    const defaultKey = isDA ? 'districtprofile' : 'schoolprofile'
    const activeKey = (active.mainMenu || '')
      .toLocaleLowerCase()
      .split(' ')
      .join('')
    return (
      <MainHeader
        Icon={IconSettings}
        headingText={manageTabLabel}
        mobileHeaderHeight={100}
      >
        <AdminHeaderContent>
          <StyledTabs
            type="card"
            tabPosition="top"
            activeKey={activeKey}
            defaultActiveKey=""
            onTabClick={this.onHeaderTabClick}
          >
            <StyledTabPane tab={defaultTab} key={defaultKey} />
            <StyledTabPane tab="Administration" key="administration" />
            <StyledTabPane tab="Users" key="users" />
            <StyledTabPane tab="Subscriptions" key="subscriptions" />
            {enableStudentGroups && <StyledTabPane tab="Groups" key="groups" />}
            {isDA && <StyledTabPane tab="Content" key="content" />}
            {(isDA ||
              (role === roleuser.SCHOOL_ADMIN && schoolLevelAdminSettings)) && (
              <StyledTabPane tab="Settings" key="settings" />
            )}
          </StyledTabs>
          {children}
        </AdminHeaderContent>
      </MainHeader>
    )
  }
}

export default connect(
  (state) => ({
    role: getUserRole(state),
    schoolLevelAdminSettings: getSchoolAdminSettingsAccess(state),
    manageTabLabel: getManageTabLabelSelector(state),
    enableStudentGroups: get(state, 'user.user.features.studentGroups'),
  }),
  {}
)(AdminHeader)
