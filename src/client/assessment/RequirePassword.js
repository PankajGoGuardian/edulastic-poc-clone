import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { EduButton, notification } from "@edulastic/common";
import { Input } from "antd";
import styled from "styled-components";
import { red, green } from "@edulastic/colors";

import { getAssigmentPasswordAction, setPasswordStatusAction } from "./actions/test";
import { ConfirmationModal } from "../author/src/components/common/ConfirmationModal";

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
    if (!assignmentPassword) {
      return notification({ messageKey: "assignmentRequiredPass" });
    }
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
    <ConfirmationModal
      title="Require Password"
      visible={!isPasswordValidated}
      onCancel={onCancel}
      maskClosable={false}
      centered
      footer={[
        <EduButton height="40px" isGhost key="back" onClick={onCancel}>
          CANCEL
        </EduButton>,
        <EduButton
          height="40px"
          data-cy="start"
          key="submit"
          onClick={validatePassword}
          disabled={!assignmentPassword.length}
        >
          START
        </EduButton>
      ]}
    >
      <BodyStyled>
        <p>Enter password to start the assignment</p>
        <br />
        <p>
          <PasswordInput
            placeholder="Enter assignment password"
            value={assignmentPassword}
            type="password"
            onChange={e => handleSetPassword(e.target.value)}
            message={passwordStatusMessage}
          />
          {!!passwordStatusMessage && (
            <MessageSpan message={passwordStatusMessage}>{passwordStatusMessage}</MessageSpan>
          )}
        </p>
      </BodyStyled>
    </ConfirmationModal>
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

const BodyStyled = styled.div`
  text-align: left;
  width: 100%;
`;
