import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { SubHeaderWrapper, StyledTabPane, StyledSubMenu } from "./styled";

import { isPublisherUserSelector, getUser } from "../../../selectors/user";

const ContentSubHeader = ({ isPublisherUser, active, history, user }) => {
  const userType = user.role === "edulastic-admin" ? "admin" : "author";
  const onSubTab = (key, e) => {
    switch (key) {
      case "Collections":
        history.push(`/${userType}/content/collections`);
        return;
      case "Buckets":
        history.push(`/${userType}/content/buckets`);
        return;
      case "Subscriptions":
        history.push(`/${userType}/content/subscriptions`);
        return;
    }
  };
  return (
    <SubHeaderWrapper>
      {active.mainMenu === "Content" && (
        <StyledSubMenu mode="horizontal" defaultActiveKey={active.subMenu} onTabClick={onSubTab}>
          <StyledTabPane tab="Collections" key="Collections" />
          <StyledTabPane tab="Buckets" key="Buckets" />
          {!isPublisherUser && <StyledTabPane tab="Subscriptions" key="Subscriptions" />}
        </StyledSubMenu>
      )}
    </SubHeaderWrapper>
  );
};

export default connect(
  state => ({
    isPublisherUser: isPublisherUserSelector(state),
    user: getUser(state)
  }),
  {}
)(ContentSubHeader);
