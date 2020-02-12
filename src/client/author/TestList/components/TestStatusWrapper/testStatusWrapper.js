import React from "react";
import { connect } from "react-redux";
import { userSelector } from "../../../src/selectors/assignments";
import { getStatus } from "../../../src/utils/getStatus";

const TestStatusWrapper = ({ children: TestStatus, status, user }) => {
  const isAuthorOrCurator = user => {
    if (user.permissions.includes("author") || user.permissions.includes("curator")) {
      return true;
    }
    return false;
  };

  if (!isAuthorOrCurator(user)) {
    return null;
  }

  return <TestStatus status={status}>{getStatus(status)}</TestStatus>;
};

export default connect(state => ({
  user: userSelector(state.user)
}))(TestStatusWrapper);
