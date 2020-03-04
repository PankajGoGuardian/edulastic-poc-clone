import React from "react";
import { connect } from "react-redux";
import { getStatus } from "../../../src/utils/getStatus";
import { isPublisherUserSelector } from "../../../src/selectors/user";
import PropTypes from "prop-types";

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
  isPublisherUser: isPublisherUserSelector(state)
}))(TestStatusWrapper);
