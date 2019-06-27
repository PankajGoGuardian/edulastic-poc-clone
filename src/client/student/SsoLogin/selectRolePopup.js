import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Button } from "antd";
import { get } from "lodash";
import { white, greenDark, orange } from "@edulastic/colors";
import { updateUserRoleAction } from "../Login/ducks";

const SelectRolePopup = props => {
  const { className, updateUserRoleAction } = props;

  const onSignupAsStudent = () => {
    updateUserRoleAction("student");
  };

  const onSignupAsTeacher = () => {
    updateUserRoleAction("teacher");
  };

  return (
    <Modal visible={true} footer={null} className={className} width={"500px"}>
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
      display: none;
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
    { updateUserRoleAction }
  )
);

const ConnectedStyledSelectRolePopup = enhance(StyledSelectRolePopup);

export { ConnectedStyledSelectRolePopup as SelectRolePopup };
