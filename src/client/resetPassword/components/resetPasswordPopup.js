import React, { useState, useEffect } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import styled from "styled-components";
import { Modal, Button, Icon, Form, Input } from "antd";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { white, greenDark, orange } from "@edulastic/colors";
import { resetPasswordUserAction, resetPasswordAction } from "../../student/Login/ducks";
import qs from "qs";

const ResetPasswordPopup = props => {
  const { className, t, history, resetPasswordAction, resetPasswordUserAction, user } = props;
  const { resetPasswordUser, requestingNewPassword } = user;
  const [urlParams, setUrlParams] = useState({});

  useEffect(() => {
    const params = qs.parse(location.search.substring(1));
    resetPasswordUserAction(params);
    setUrlParams(params);
  }, []);

  const onCancel = () => {
    history.push("/login");
  };

  const onSubmit = password => {
    const params = {
      ...urlParams,
      password
    };
    resetPasswordAction(params);
  };

  return (
    <>
      {resetPasswordUser ? (
        <Modal visible={true} footer={null} className={className} width={"500px"}>
          <div className="forgot-password-actions">
            <p>Reset Password</p>
            <p>
              Hi, <Icon type="user" />{" "}
              {resetPasswordUser.firstName +
                " " +
                (resetPasswordUser.middleName ? resetPasswordUser.middleName + " " : "") +
                (resetPasswordUser.lastName ? resetPasswordUser.lastName : "")}
            </p>
            <ConnectedInputPasswordForm
              onSubmit={onSubmit}
              onCancel={onCancel}
              t={t}
              requestingNewPassword={requestingNewPassword}
            />
          </div>
        </Modal>
      ) : null}
    </>
  );
};

const InputPasswordForm = props => {
  const { getFieldDecorator } = props.form;
  const { t, onCancel, onSubmit: _onSubmit, requestingNewPassword } = props;
  const [passwd, setPasswd] = useState("");

  const checkPassword = (rule, value, callback) => {
    if (value.length < 4) {
      callback(t("component.signup.teacher.shortpassword"));
    } else if (value.includes(" ")) {
      callback(t("component.signup.teacher.validpassword"));
    }
    setPasswd(value);
    callback();
  };

  const checkConfirmPassword = (rule, value, callback) => {
    if (value.length < 4) {
      callback(t("component.signup.teacher.shortpassword"));
    } else if (value.includes(" ")) {
      callback(t("component.signup.teacher.validpassword"));
    } else if (value !== passwd) {
      callback(t("Passwords don't match"));
    }
    callback();
  };

  const onSubmit = event => {
    event.preventDefault();
    const { form } = props;
    form.validateFieldsAndScroll((err, { newPassword, confirmPassword }) => {
      _onSubmit(newPassword);
    });
  };

  return (
    <Form onSubmit={onSubmit} autoComplete="new-password">
      <Form.Item>
        {getFieldDecorator("newPassword", {
          validateFirst: true,
          initialValue: "",
          rules: [
            {
              required: true,
              message: t("component.signup.teacher.validpassword")
            },
            {
              validator: checkPassword
            }
          ]
        })(
          <Input
            className="password-input"
            type="password"
            placeholder="New Password"
            autoComplete="new-password"
            prefix={<Icon type="key" style={{ color: "white" }} />}
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("confirmPassword", {
          validateFirst: true,
          initialValue: "",
          rules: [
            {
              required: true,
              message: t("component.signup.teacher.validpassword")
            },
            {
              validator: checkConfirmPassword
            }
          ]
        })(
          <Input
            className="password-input"
            type="password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            prefix={<Icon type="key" style={{ color: "white" }} />}
          />
        )}
      </Form.Item>
      <div className="model-buttons">
        <Form.Item>
          <Button className={"cancel-button"} key="cancel" onClick={onCancel}>
            Cancel
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            className={"reset-password-button"}
            key="resetPassword"
            htmlType="submit"
            disabled={requestingNewPassword}
          >
            Reset Password
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

const ConnectedInputPasswordForm = Form.create({ name: "resetPasswordForm" })(InputPasswordForm);

const StyledResetPasswordPopup = styled(ResetPasswordPopup)`
  .ant-modal-content {
    background-color: #40444f;
    color: ${white};
    .ant-modal-close {
      display: none;
    }
    .forgot-password-actions {
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;

      p {
        margin: 13px;
      }

      form {
        display: contents;

        .ant-row {
          margin: 13px;
      }

      .password-input {
        input {
          background-color: #40444f;
          color: white;
        }
      }

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
        .cancel-button {
          border: solid 1px ${orange};
          color: ${orange};
        }
        .reset-password-button {
          border: solid 1px ${greenDark};
          color: ${greenDark};
        }
      }
    }
  }
`;

const enhance = compose(
  withNamespaces("login"),
  connect(
    state => ({
      user: get(state, "user", null)
    }),
    { resetPasswordAction, resetPasswordUserAction }
  )
);

const ConnectedStyledResetPasswordPopup = enhance(StyledResetPasswordPopup);

export { ConnectedStyledResetPasswordPopup as ResetPasswordPopup };
