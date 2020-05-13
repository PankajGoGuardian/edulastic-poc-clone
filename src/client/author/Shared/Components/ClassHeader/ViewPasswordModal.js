import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import useInterval from "@use-it/interval";
import { Typography } from "antd";
import styled from "styled-components";
import moment from "moment";
import { test } from "@edulastic/constants";
import { themeColor, themeColorSecondaryLighter, white } from "@edulastic/colors";
import {
  getViewPasswordSelector,
  getAssignmentPasswordDetailsSelector,
  getPasswordPolicySelector
} from "../../../ClassBoard/ducks";
import { toggleViewPasswordAction, regeneratePasswordAction } from "../../../src/actions/classBoard";
import { ModalWrapper, InitOptions, StyledButton } from "../../../../common/components/ConfirmationModal/styled";

const { Paragraph } = Typography;
const { passwordPolicy: passwordPolicyValues } = test;

const formatTime = diffMs => {
  return moment.utc(moment.duration(diffMs, "ms").asMilliseconds()).format("HH:mm:ss");
};

const ViewPasswordModal = ({
  isViewPassword,
  toggleViewPassword,
  passwordDetails = {},
  regeneratePassword,
  passwordPolicy,
  match
}) => {
  const { assignmentPassword, passwordExpireTime, passwordExpireIn } = passwordDetails;
  const isStaticPassword = passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC;
  const isDynamicPassword = passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC;
  const [timer, setTimer] = useState(null);
  const [canGenerate, setCanGenerate] = useState(true);

  useEffect(() => {
    if (isViewPassword && isDynamicPassword && !isNaN(passwordExpireTime)) {
      setTimer(passwordExpireTime - Date.now());
      setCanGenerate(false);
    }
  }, [passwordExpireTime]);

  useInterval(() => {
    if (isViewPassword && isDynamicPassword && !isNaN(passwordExpireTime)) {
      if (timer > 1000 && !isNaN(timer)) {
        setTimer(timer - 1000);
      } else if (!canGenerate && !isNaN(passwordExpireTime)) {
        setCanGenerate(true);
      }
    }
  }, 1000);

  const handleRegeneratePassword = () => {
    const { assignmentId, classId } = match.params;
    regeneratePassword({ assignmentId, classId, passwordExpireIn });
  };

  if (!isViewPassword) return null;

  return (
    <PasswordModalWrapper
      centered
      title="View Password"
      visible={isViewPassword}
      onCancel={toggleViewPassword}
      width={700}
      footer={[]}
      destroyOnClose={true}
    >
      <InitOptions bodyStyle={{ marginBottom: 0 }}>
        {isStaticPassword && (
          <>
            <Heading>THIS ASSIGNMENT REQUIRES A PASSWORD</Heading>
            <Content>Student must enter the password shown below to start the assignment.</Content>
            <AssignmentPassword>{assignmentPassword}</AssignmentPassword>
            <TitleCopy copyable={{ text: assignmentPassword }} />
          </>
        )}
        {isDynamicPassword && !canGenerate && (
          <>
            <Heading>THIS ASSIGNMENT REQUIRES A PASSWORD</Heading>
            <Content>
              Student must enter the password shown below to start the assignment. This password will expire in{" "}
              <span style={{ color: themeColorSecondaryLighter }}>{formatTime(timer)}</span> seconds
            </Content>
            <AssignmentPassword data-cy="password">{assignmentPassword}</AssignmentPassword>
            <TitleCopy copyable={{ text: assignmentPassword }} />
          </>
        )}
        {isDynamicPassword && canGenerate && (
          <>
            <Heading>PASSWORD EXPIRED</Heading>
            <Content>
              <p>If you need to regenerate the password, please click Regenerate Password</p>
            </Content>
            <p>
              <StyledButton onClick={handleRegeneratePassword}>Regenerate Password</StyledButton>
            </p>
          </>
        )}
      </InitOptions>
    </PasswordModalWrapper>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      isViewPassword: getViewPasswordSelector(state),
      passwordDetails: getAssignmentPasswordDetailsSelector(state),
      passwordPolicy: getPasswordPolicySelector(state)
    }),
    {
      toggleViewPassword: toggleViewPasswordAction,
      regeneratePassword: regeneratePasswordAction
    }
  )
);

export default enhance(ViewPasswordModal);

const PasswordModalWrapper = styled(ModalWrapper)`
  background: ${white};
  padding: 15px 30px;
  .ant-modal-body {
    & > div {
      background: none;
      box-shadow: none;
      padding: 20px 50px;
    }
  }
`;

const Heading = styled.h3`
  font-weight: 600;
`;

const Content = styled.div`
  margin: 20px 0px;
  font-weight: 600;
`;

const AssignmentPassword = styled.div`
  margin: 10px 0px;
  font-size: 30px;
  font-weight: 600;
`;

export const TitleCopy = styled(Paragraph)`
  &.ant-typography {
    color: ${themeColor};
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: center;
    font-weight: normal;
  }
  button {
    margin-right: 10px;
  }
  i.anticon {
    display: flex;
    align-items: center;
    margin-right: 10px;
    &:after {
      content: "COPY PASSWORD";
      color: ${themeColor};
      margin-left: 10px;
  }
  svg {
    width: 20px;
    height: 20px;
    color: ${themeColor};
  }
`;
