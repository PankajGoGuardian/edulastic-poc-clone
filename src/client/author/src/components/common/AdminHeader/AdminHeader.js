import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { roleuser } from "@edulastic/constants";
import { get } from "lodash";
import { AdminHeaderContent, StyledTabs, StyledTabPane, AdminHeaderWrapper, Title } from "./styled";
import { getUserRole, isPublisherUserSelector } from "../../../selectors/user";

class AdminHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired,
    count: PropTypes.number
  };

  onHeaderTabClick = (key, e) => {
    const { history, role } = this.props;
    switch (key) {
      case "District Profile":
        history.push(`/author/districtprofile`);
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
        history.push(`/author/settings/districtpolicies`);
        return;
      case "Users":
        history.push(`/author/users/district-admin`);
        return;
      case "Content":
        history.push(`/author/content/collections`);
        return;
    }
  };

  render() {
    const { active, count = 0, role, schoolLevelAdminSettings, isPublisherUser } = this.props;
    const SchoolTabtext = count > 0 ? `Schools (${count})` : "Schools";
    let title = "";
    if (isPublisherUser) {
      title = "Organization";
    } else if (role === roleuser.DISTRICT_ADMIN) {
      title = "Manage District";
    } else {
      title = "Manage School";
    }
    return (
      <AdminHeaderWrapper>
        <AdminHeaderContent>
          <Title>{title}</Title>
          <StyledTabs type="card" defaultActiveKey={active.mainMenu} onTabClick={this.onHeaderTabClick}>
            {role === "district-admin" ? <StyledTabPane tab="District Profile" key={"District Profile"} /> : null}
            <StyledTabPane tab={SchoolTabtext} key={"Schools"} />
            <StyledTabPane tab="Users" key={"Users"} />
            <StyledTabPane tab="Classes" key={"Classes"} />
            <StyledTabPane tab="Courses" key={"Courses"} />
            <StyledTabPane tab="Class Enrollment" key={"Class Enrollment"} />
            {/* <StyledTabPane tab="Groups" key={"Groups"} /> */}
            <StyledTabPane tab="Content" key={"Content"} />
            {role === roleuser.DISTRICT_ADMIN || (role === roleuser.SCHOOL_ADMIN && schoolLevelAdminSettings) ? (
              <StyledTabPane tab="Settings" key={"Settings"} />
            ) : null}
          </StyledTabs>
        </AdminHeaderContent>
      </AdminHeaderWrapper>
    );
  }
}

export default connect(
  state => ({
    role: getUserRole(state),
    schoolLevelAdminSettings: get(state, "districtPolicyReducer.data.schoolAdminSettingsAccess", false),
    isPublisherUser: isPublisherUserSelector(state)
  }),
  {}
)(AdminHeader);
