import React, { Component } from "react";
import PropTypes from "prop-types";

import { AdminHeaderContent, StyledTitle, StyledTabs, StyledTabPane, StyledSubMenu } from "./styled";

class AdminHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  onHeaderTabClick = (key, e) => {
    const { history } = this.props;
    switch (key) {
      case "District Profile":
        history.push(`/author/districtprofile`);
        return;
      case "Schools":
        history.push(`/author/Schools`);
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
    }
  };

  render() {
    const { title, active } = this.props;

    return (
      <React.Fragment>
        <AdminHeaderContent>
          <StyledTitle>{title}</StyledTitle>
          <StyledTabs defaultActiveKey={active.mainMenu} onTabClick={this.onHeaderTabClick}>
            <StyledTabPane tab="District Profile" key={"District Profile"} />
            <StyledTabPane tab="Schools" key={"Schools"} />
            <StyledTabPane tab="Classes" key={"Classes"} />
            <StyledTabPane tab="Courses" key={"Courses"} />
            <StyledTabPane tab="Class Enrollment" key={"Class Enrollment"} />
            <StyledTabPane tab="Groups" key={"Groups"} />
            <StyledTabPane tab="Settings" key={"Settings"} />
          </StyledTabs>
        </AdminHeaderContent>
        {active.mainMenu === "Settings" && (
          <StyledSubMenu mode="horizontal" defaultActiveKey={active.subMenu} onTabClick={this.onSubTab}>
            <StyledTabPane tab="District Policies" key={"District Policies"} />
            <StyledTabPane tab="Test Settings" key={"Test Settings"} />
            <StyledTabPane tab="Term" key={"Term"} />
            <StyledTabPane tab="Performance Bands" key={"Performance Bands"} />
            <StyledTabPane tab="Standards Proficiency" key={"Standards Proficiency"} />
          </StyledSubMenu>
        )}
      </React.Fragment>
    );
  }
}

export default AdminHeader;
