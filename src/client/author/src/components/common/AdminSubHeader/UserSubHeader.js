import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { SubHeaderWrapper, StyledTabPane, StyledSubMenu } from "./styled";

import { getUserRole } from "../../../selectors/user";

class AdminHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired
  };

  onSubTab = (key, e) => {
    const { history } = this.props;
    switch (key) {
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
      case "Content Authors":
        history.push(`/author/users/content-authors`);
        return;
      case "Content Approvers":
        history.push(`/author/users/content-approvers`);
        
    }
  };

  render() {
    const { active, role } = this.props;
    console.log({ role });
    return (
      <SubHeaderWrapper>
        {active.mainMenu === "Users" && (
          <StyledSubMenu
            mode="horizontal"
            defaultActiveKey={active.subMenu}
            onTabClick={this.onSubTab}
          >
            {role === "district-admin" && (
              <StyledTabPane tab="District Admin" key="District Admin" />
            )}
            <StyledTabPane tab="School Admin" key="School Admin" />
            <StyledTabPane tab="Teacher" key="Teacher" />
            <StyledTabPane tab="Student" key="Student" />
            {/* Below repeated conditions is bcz Fragment is not working here */}
            {role === "district-admin" && (
              <StyledTabPane tab="Content Authors" key="Content Authors" />
            )}
            {role === "district-admin" && (
              <StyledTabPane tab="Content Approvers" key="Content Approvers" />
            )}
          </StyledSubMenu>
        )}
      </SubHeaderWrapper>
    );
  }
}

export default connect(
  state => ({
    role: getUserRole(state)
  }),
  {}
)(AdminHeader);
