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
    }
  };

  render() {
    const { active, role } = this.props;
    return (
      <SubHeaderWrapper>
        {active.mainMenu === "Users" && (
          <StyledSubMenu mode="horizontal" defaultActiveKey={active.subMenu} onTabClick={this.onSubTab}>
            {role === "district-admin" ? <StyledTabPane tab="District Admin" key="District Admin" /> : null}
            <StyledTabPane tab="School Admin" key="School Admin" />
            <StyledTabPane tab="Teacher" key="Teacher" />
            <StyledTabPane tab="Student" key="Student" />
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
