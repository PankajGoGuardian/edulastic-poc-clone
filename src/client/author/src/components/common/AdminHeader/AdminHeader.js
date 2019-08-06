import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { roleuser } from "@edulastic/constants";

import {
  AdminHeaderContent,
  StyledTitle,
  StyledTabs,
  StyledTabPane,
  StyledSubMenu,
  AdminHeaderWrapper,
  Title
} from "./styled";

import { getUserRole } from "../../../selectors/user";

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
      case "Groups":
        history.push(`/author/Groups`);
        return;
      case "Settings":
        history.push(`/author/settings/districtpolicies`);
        return;
      case "Users":
        history.push(`/author/users/district-admin`);
        return;
    }
  };

  onSubTab = (key, e) => {
    const { history } = this.props;
    switch (key) {
      case "District Policies":
        history.push(`/author/settings/districtpolicies`);
        return;
      case "Test Settings":
        history.push(`/author/settings/testsettings`);
        return;
      case "Term":
        history.push(`/author/settings/term`);
        return;
      case "Performance Bands":
        history.push(`/author/settings/performance-bands`);
        return;
      case "Standards Proficiency":
        history.push(`/author/settings/standards-proficiency`);
        return;
      case "Student":
        history.push(`/author/users/student`);
        return;
      case "Teacher":
        history.push(`/author/users/teacher`);
        return;
      case "District Admin":
        history.push(`/author/users/district-admin`);
        return;
      case "School Admin":
        history.push(`/author/users/school-admin`);
        return;
      case "Interested Standards":
        history.push(`/author/settings/interested-standards`);
        return;
    }
  };

  render() {
    const { title, active, count = 0, role } = this.props;
    const SchoolTabtext = count > 0 ? `Schools (${count})` : "Schools";
    return (
      <AdminHeaderWrapper>
        <AdminHeaderContent>
          <Title>{role === roleuser.DISTRICT_ADMIN ? "Manage District" : "Manage School"}</Title>
          <StyledTabs type="card" defaultActiveKey={active.mainMenu} onTabClick={this.onHeaderTabClick}>
            {role === "district-admin" ? <StyledTabPane tab="District Profile" key={"District Profile"} /> : null}
            <StyledTabPane tab={SchoolTabtext} key={"Schools"} />
            <StyledTabPane tab="Users" key={"Users"} />
            <StyledTabPane tab="Classes" key={"Classes"} />
            <StyledTabPane tab="Courses" key={"Courses"} />
            <StyledTabPane tab="Class Enrollment" key={"Class Enrollment"} />
            <StyledTabPane tab="Groups" key={"Groups"} />
            {role === roleuser.DISTRICT_ADMIN ? <StyledTabPane tab="Settings" key={"Settings"} /> : null}
          </StyledTabs>
        </AdminHeaderContent>
        {active.mainMenu === "Settings" && (
          <StyledSubMenu mode="horizontal" defaultActiveKey={active.subMenu} onTabClick={this.onSubTab}>
            {role === "district-admin" ? <StyledTabPane tab="District Policies" key={"District Policies"} /> : null}
            <StyledTabPane tab="Test Settings" key={"Test Settings"} />
            <StyledTabPane tab="Term" key={"Term"} />
            <StyledTabPane tab="Interested Standards" key={"Interested Standards"} />
            <StyledTabPane tab="Performance Bands" key={"Performance Bands"} />
            <StyledTabPane tab="Standards Proficiency" key={"Standards Proficiency"} />
          </StyledSubMenu>
        )}
        {active.mainMenu === "Users" && (
          <StyledSubMenu mode="horizontal" defaultActiveKey={active.subMenu} onTabClick={this.onSubTab}>
            {role === "district-admin" ? <StyledTabPane tab="District Admin" key={"District Admin"} /> : null}
            <StyledTabPane tab="School Admin" key={"School Admin"} />
            <StyledTabPane tab="Teacher" key={"Teacher"} />
            <StyledTabPane tab="Student" key={"Student"} />
          </StyledSubMenu>
        )}
      </AdminHeaderWrapper>
    );
  }
}

export default connect(
  state => ({
    role: getUserRole(state)
  }),
  {}
)(AdminHeader);
