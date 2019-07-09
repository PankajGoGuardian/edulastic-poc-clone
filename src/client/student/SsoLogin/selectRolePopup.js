import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Button } from "antd";
import { get } from "lodash";
import { white, greenDark, orange } from "@edulastic/colors";
import { updateUserRoleAction, logoutAction } from "../Login/ducks";

const SelectRolePopup = props => {
  const { className, updateUserRoleAction, logoutAction } = props;

  const onSignupAsStudent = () => {
    updateUserRoleAction("student");
  };

  const onSignupAsTeacher = () => {
    updateUserRoleAction("teacher");
  };

  const onCancel = () => {
    logoutAction();
  };

  return (
    <Modal visible={true} footer={null} className={className} width={"500px"} maskClosable={false} onCancel={onCancel}>
      <div className="third-party-signup-select-role">
        <p>It seems you are new to Edulastic!</p>
        <p>Sign Up! It's Free</p>
        <div className="model-buttons">
          <Button className={"signupAsStudent-button"} key="signupAsStudent" onClick={onSignupAsStudent}>
            Sign up as Student
          </Button>
          <Button className={"signupAsTeacher-button"} key="signupAsTeacher" onClick={onSignupAsTeacher}>
            Sign up as Teacher
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const StyledSelectRolePopup = styled(SelectRolePopup)`
  .ant-modal-content {
    background-color: #40444f;
    color: ${white};
    .ant-modal-close {
      border: solid 3px white;
      border-radius: 20px;
      color: white;
      margin: -17px;
      height: 35px;
      width: 35px;
      .ant-modal-close-x {
        height: 100%;
        width: 100%;
        line-height: normal;
        padding: 5px;
        path {
          stroke: white;
          stroke-width: 150;
          fill: white;
        }
      }
    }
    .third-party-signup-select-role {
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      .model-buttons {
        display: flex;
        justify-content: space-between;
        margin: 8px;
        button {
          height: 40px;
          background-color: transparent;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 0 5px;
        }
        .signupAsStudent-button {
          border: solid 1px ${greenDark};
          color: ${greenDark};
        }
        .signupAsTeacher-button {
          border: solid 1px ${orange};
          color: ${orange};
        }
      }
    }
  }
`;

const enhance = compose(
  connect(
    state => ({
      user: get(state, "user.user", null)
    }),
    { updateUserRoleAction, logoutAction }
  )
);

const ConnectedStyledSelectRolePopup = enhance(StyledSelectRolePopup);

export { ConnectedStyledSelectRolePopup as SelectRolePopup };
