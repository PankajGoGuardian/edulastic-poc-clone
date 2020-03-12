import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { SubHeaderWrapper, StyledTabPane, StyledSubMenu } from "./styled";

import { getUser } from "../../../selectors/user";

const ContentSubHeader = ({ active, history, user }) => {
  const userType = user.role === "edulastic-admin" ? "admin" : "author";
  const onSubTab = (key, e) => {
    switch (key) {
      case "Collections":
        history.push(`/${userType}/content/collections`);
        return;
      case "Buckets":
        history.push(`/${userType}/content/buckets`);
        return;
      case "ExternalTools":
        history.push(`/${userType}/content/tools`);
    }
  };
  return (
    <SubHeaderWrapper>
      {active.mainMenu === "Content" && (
        <StyledSubMenu mode="horizontal" defaultActiveKey={active.subMenu} onTabClick={onSubTab}>
          <StyledTabPane tab="Collections" key="Collections" />
          <StyledTabPane tab="Buckets" key="Buckets" />
          <StyledTabPane tab="External Tools" key="ExternalTools" />
        </StyledSubMenu>
      )}
    </SubHeaderWrapper>
  );
};

export default connect(
  state => ({
    user: getUser(state)
  }),
  {}
)(ContentSubHeader);
