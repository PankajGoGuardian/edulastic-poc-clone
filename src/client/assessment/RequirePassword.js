import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { Modal, Input, Button, message } from "antd";
import styled from "styled-components";
import { red, green } from "@edulastic/colors";

import { getAssigmentPasswordAction, setPasswordStatusAction } from "./actions/test";

const RequirePassword = ({
  isPasswordValidated,
  passwordStatusMessage,
  getAssignmentPassword,
  setPasswordStatus,
  history
}) => {
  useEffect(() => {
    return () => {
      setPasswordStatus("");
    };
  }, []);
  const [assignmentPassword, setAssignmentPassword] = useState("");
  const validatePassword = () => {
    if (!assignmentPassword) return message.error("This assessment requies password");
    getAssignmentPassword(assignmentPassword);
  };

  const handleSetPassword = value => {
    setAssignmentPassword(value);
    setPasswordStatus("");
  };
  const onCancel = () => {
    history.push("/home/assignments");
  };

  return (
    <Modal
      title="Require Password"
      visible={!isPasswordValidated}
      onCancel={onCancel}
      maskClosable={false}
      centered={true}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={validatePassword} disabled={!assignmentPassword.length}>
          Start
        </Button>
      ]}
    >
      <p>Enter password to start the assessment</p>
      <br />
      <p>
        <PasswordInput
          placeholder="Enter assignment password"
          value={assignmentPassword}
          type={"text"}
          onChange={e => handleSetPassword(e.target.value)}
          message={passwordStatusMessage}
        />
        {passwordStatusMessage ? (
          <MessageSpan message={passwordStatusMessage}>{passwordStatusMessage}</MessageSpan>
        ) : (
          ""
        )}
      </p>
    </Modal>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      passwordStatusMessage: state.test.passwordStatusMessage,
      isPasswordValidated: state.test.isPasswordValidated
    }),
    {
      getAssignmentPassword: getAssigmentPasswordAction,
      setPasswordStatus: setPasswordStatusAction
    }
  )
);
export default enhance(RequirePassword);

const MessageSpan = styled.span`
  color: ${props => (props.message === "successful" ? green : red)};
`;

const PasswordInput = styled(Input)`
  border-color: ${props => props.message && props.message !== "successful" && red};
`;
