import React, { Component } from "react";
import { AdminHeaderContent, StyledTitle, StyledTabs, StyledLink, StyledSubTabs, StyledLinkA } from "./styled";

class AdminHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, active } = this.props;

    return (
      <React.Fragment>
        <AdminHeaderContent>
          <StyledTitle>{title}</StyledTitle>
          <StyledTabs>
            <StyledLink isActive={active.mainMenu === "District Profile"} to={`/author/districtprofile`}>
              District Profile
            </StyledLink>
            <StyledLink isActive={active.mainMenu === "Schools"} to={`/author/Schools`}>
              Schools(20)
            </StyledLink>
            <StyledLink isActive={active.mainMenu === "Users"} to={`/author/Users`}>
              Users
            </StyledLink>
            <StyledLink isActive={active.mainMenu === "Classes"} to={`/author/Classes`}>
              Classes
            </StyledLink>
            <StyledLink isActive={active.mainMenu === "Courses"} to={`/author/Courses`}>
              Courses
            </StyledLink>
            <StyledLink isActive={active.mainMenu === "Class Enrollment"} to={`/author/Class Enrollment`}>
              Class Enrollment
            </StyledLink>
            <StyledLink isActive={active.mainMenu === "Groups"} to={`/author/Groups`}>
              Groups
            </StyledLink>
            <StyledLink isActive={active.mainMenu === "Settings"} to={`/author/settings/districtpolicies`}>
              Settings
            </StyledLink>
          </StyledTabs>
        </AdminHeaderContent>
        {active.mainMenu === "Settings" && (
          <StyledSubTabs>
            <StyledLinkA isActive={active.subMenu === "District Policies"} to={`/author/settings/districtpolicies`}>
              District Policies
            </StyledLinkA>
            <StyledLinkA isActive={active.subMenu === "Test Settings"} to={`/author/settings/testsettings`}>
              Test Settings
            </StyledLinkA>
            <StyledLinkA isActive={active.subMenu === "Term"} to={`/author/settings/term`}>
              Term
            </StyledLinkA>
            <StyledLinkA isActive={active.subMenu === "Performance Bands"} to={`/author/settings/performance-bands`}>
              Performance Bands
            </StyledLinkA>
            <StyledLinkA
              isActive={active.subMenu === "Standards Proficiency"}
              to={`/author/settings/standards-proficiency`}
            >
              Standards Proficiency
            </StyledLinkA>
          </StyledSubTabs>
        )}
      </React.Fragment>
    );
  }
}

export default AdminHeader;
