import React from "react";
import { connect } from "react-redux";
import { showItemStatusSelector } from "../../../src/selectors/user";
import { getStatus } from "../../../src/utils/getStatus";

const TestStatusWrapper = ({ children: TestStatus, status, isPublisherUser, checkUser }) => {
  if (checkUser && !isPublisherUser) {
    return null;
  }
  return <TestStatus status={status}>{getStatus(status)}</TestStatus>;
};

TestStatusWrapper.defaultProps = {
  checkUser: true
};

export default connect(state => ({
  isPublisherUser: showItemStatusSelector(state)
}))(TestStatusWrapper);
