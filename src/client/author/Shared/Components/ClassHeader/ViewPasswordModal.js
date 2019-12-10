import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import useInterval from "@use-it/interval";
import { Typography } from "antd";
import styled from "styled-components";
import moment from "moment";
import { test } from "@edulastic/constants";
import { themeColor, themeColorSecondaryLighter } from "@edulastic/colors";
import {
  getViewPasswordSelector,
  getAssignmentPasswordDetailsSelector,
  getPasswordPolicySelector
} from "../../../ClassBoard/ducks";
import { toggleViewPasswordAction, regeneratePasswordAction } from "../../../src/actions/classBoard";
import { ModalWrapper, InitOptions } from "../../../../common/components/ConfirmationModal/styled";

const { Paragraph } = Typography;
const { passwordPolicy: passwordPolicyValues } = test;

const formatTime = ms => {
  console.log(new Date(ms).toISOString());
  const date = new Date(ms);
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  console.log({ seconds, minutes, hours });
  // const diff =
  return `${hours}:${minutes}:${seconds}`;
};

const ViewPasswordModal = ({
  isViewPassword,
  toggleViewPassword,
  passwordDetails = {},
  regeneratePassword,
  passwordPolicy,
  match
}) => {
  const {
    assignmentPassword = "632629",
    passwordCreatedDate = 1575988309608,
    passwordExpireTime = 1575989331701
  } = passwordDetails;
  const [timer, setTimer] = useState(100000000);
  const [canGenerate, setCanGenerate] = useState(false);

  useState(() => {
    setTimer(passwordExpireTime - Date.now());
  }, [passwordExpireTime, passwordCreatedDate]);

  useInterval(() => {
    if (passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC) {
      if (timer > 0) {
        setTimer(timer - 1000);
      } else if (!canGenerate) {
        setCanGenerate(true);
      }
    }
  }, 1000);

  const handleRegeneratePassword = () => {
    const { assignmentId, classId } = match.params;
    regeneratePassword({ assignmentId, classId });
    setCanGenerate(false);
    console.log("api call for regenerate");
  };

  if (!isViewPassword) return null;

  const showRegerate = passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC && canGenerate;
  const showPassWord =
    passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC ||
    (passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC && !canGenerate);
  return (
    <ModalWrapper
      centered
      title="View Password"
      visible={isViewPassword}
      onCancel={toggleViewPassword}
      width={700}
      footer={[]}
      destroyOnClose={true}
    >
      <InitOptions bodyStyle={{ marginBottom: 0 }}>
        <Heading>THIS ASSESSMENT REQUIRES A PASSWORD</Heading>
        {showPassWord && (
          <>
            <Content>
              Student must enter the password shown below to start the assessment. This password will expire in{" "}
              <span style={{ color: themeColorSecondaryLighter }}>{formatTime(timer)}</span> seconds
            </Content>
            <AssignmentPassword>{assignmentPassword}</AssignmentPassword>
            <TitleCopy copyable={{ text: assignmentPassword }}>COPY PASSWORD</TitleCopy>
          </>
        )}
        {showRegerate && (
          <Content>
            password expired{" "}
            <span onClick={handleRegeneratePassword} style={{ color: themeColorSecondaryLighter, cursor: "pointer" }}>
              regenerate password
            </span>{" "}
            seconds
          </Content>
        )}
      </InitOptions>
    </ModalWrapper>
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
  }
  svg {
    width: 20px;
    height: 20px;
    color: ${themeColor};
  }
`;
