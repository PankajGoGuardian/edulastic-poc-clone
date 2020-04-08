import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { SubHeaderWrapper, StyledTabPane, StyledSubMenu } from "./styled";
import { getUserRole } from "../../../selectors/user";
import { get } from "lodash";
import { getSchoolAdminSettingsAccess } from "../../../../DistrictPolicy/ducks";

class AdminSubHeader extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    active: PropTypes.object.isRequired
  };

  onSubTab = (key, e) => {
    const { history } = this.props;
    switch (key) {
      case "District Policies":
        history.push(`/author/settings/districtpolicies`);
        return;
      case "School Policies":
        history.push(`/author/settings/schoolpolicies`);
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
      case "Interested Standards":
        history.push(`/author/settings/interested-standards`);
        return;
    }
  };

  render() {
    const { active, role, schoolLevelAdminSettings } = this.props;
    return (
      <SubHeaderWrapper>
        {active.mainMenu === "Settings" && (
          <StyledSubMenu mode="horizontal" defaultActiveKey={active.subMenu} onTabClick={this.onSubTab}>
            {role === "district-admin" ? <StyledTabPane tab="District Policies" key="District Policies" /> : null}
            {role === "school-admin" && schoolLevelAdminSettings ? (
              <StyledTabPane tab="School Policies" key="School Policies" />
            ) : null}
            <StyledTabPane tab="Test Settings" key="Test Settings" />
            <StyledTabPane tab="Term" key="Term" />
            <StyledTabPane tab="Interested Standards" key="Interested Standards" />
            <StyledTabPane tab="Performance Bands" key="Performance Bands" />
            <StyledTabPane tab="Standards Proficiency" key="Standards Proficiency" />
          </StyledSubMenu>
        )}
      </SubHeaderWrapper>
    );
  }
}

export default connect(
  state => ({
    role: getUserRole(state),
    schoolLevelAdminSettings: getSchoolAdminSettingsAccess(state)
  }),
  {}
)(AdminSubHeader);
