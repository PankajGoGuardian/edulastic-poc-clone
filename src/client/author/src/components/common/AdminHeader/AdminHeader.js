import { MainHeader } from "@edulastic/common";
import { roleuser } from "@edulastic/constants";
import { IconSettings } from "@edulastic/icons";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getManageTabLabelSelector, getUserRole } from "../../../selectors/user";
import { AdminHeaderContent, StyledTabPane, StyledTabs } from "./styled";
import { getSchoolAdminSettingsAccess } from "../../../../DistrictPolicy/ducks";

class AdminHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired
  };

  onHeaderTabClick = key => {
    const { history, role } = this.props;
    // eslint-disable-next-line default-case
    switch (key) {
      case "District Profile":
        history.push(`/author/districtprofile`);
        return;
      case "School Profile":
        history.push(`/author/schoolprofile`);
        return;
      case "Schools":
        history.push(`/author/Schools`);
        return;
      case "Users":
        if (role === "district-admin") {
          history.push(`/author/users/district-admin`);
        } else if (role === "school-admin") {
          history.push(`/author/users/school-admin`);
        }
        return;
      case "Classes":
        history.push(`/author/Classes`);
        return;
      case "Courses":
        history.push(`/author/Courses`);
        return;
      case "Class Enrollment":
        history.push(`/author/Class-Enrollment`);
        return;
      // case "Groups":
      //   history.push(`/author/Groups`);
      //   return;
      case "Settings":
        if (role === roleuser.DISTRICT_ADMIN) {
          history.push(`/author/settings/districtpolicies`);
        } else {
          history.push(`/author/settings/schoolpolicies`);
        }
        return;
      case "Content":
        history.push(`/author/content/collections`);
    }
  };

  render() {
    const { active, count = 0, role, schoolLevelAdminSettings, manageTabLabel, children } = this.props;
    const SchoolTabtext = count > 0 ? `Schools (${count})` : "Schools";
    const isDA = role === roleuser.DISTRICT_ADMIN;
    return (
      <MainHeader Icon={IconSettings} headingText={manageTabLabel} mobileHeaderHeight={100}>
        <AdminHeaderContent>
          <StyledTabs type="card" defaultActiveKey={active.mainMenu} onTabClick={this.onHeaderTabClick}>
            <StyledTabPane
              tab={isDA ? "District Profile" : "School Profile"}
              key={isDA ? "District Profile" : "School Profile"}
            />
            <StyledTabPane tab={SchoolTabtext} key="Schools" />
            <StyledTabPane tab="Users" key="Users" />
            <StyledTabPane tab="Classes" key="Classes" />
            <StyledTabPane tab="Courses" key="Courses" />
            <StyledTabPane tab="Class Enrollment" key="Class Enrollment" />
            {/* <StyledTabPane tab="Groups" key={"Groups"} /> */}
            {isDA && <StyledTabPane tab="Content" key="Content" />}
            {isDA || (role === roleuser.SCHOOL_ADMIN && schoolLevelAdminSettings) ? (
              <StyledTabPane tab="Settings" key="Settings" />
            ) : null}
          </StyledTabs>
          {children}
        </AdminHeaderContent>
      </MainHeader>
    );
  }
}

export default connect(
  state => ({
    role: getUserRole(state),
    schoolLevelAdminSettings: getSchoolAdminSettingsAccess(state),
    manageTabLabel: getManageTabLabelSelector(state)
  }),
  {}
)(AdminHeader);
