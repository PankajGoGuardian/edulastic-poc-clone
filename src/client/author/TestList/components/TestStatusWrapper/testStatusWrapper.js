import React from "react";
import { connect } from "react-redux";
import { getStatus } from "../../../src/utils/getStatus";
import { isPublisherUserSelector } from "../../../src/selectors/user";

const TestStatusWrapper = ({ children: TestStatus, status, isPublisherUser }) => {
  if (isPublisherUser) {
    return null;
  }
  return <TestStatus status={status}>{getStatus(status)}</TestStatus>;
};

export default connect(state => ({
  isPublisherUser: isPublisherUserSelector(state)
}))(TestStatusWrapper);
