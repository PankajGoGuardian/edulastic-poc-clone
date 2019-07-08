import React, { useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Modal, Button, Input, Icon, Form } from "antd";
import { get, trim } from "lodash";
import { white, greenDark, orange } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { requestNewPasswordAction } from "./../ducks";

const ForgotPasswordPopup = props => {
  const { visible, className, onCancel, onOk, t, requestNewPasswordAction, user } = props;
  const { requestingNewPassword, requestNewPasswordSuccess } = user;

  const onCancelForgotPassword = () => {
    onCancel();
  };

  const onSendLink = email => {
    requestNewPasswordAction({ email });
  };

  const onClickClose = () => {
    onCancel();
  };

  return (
    <Modal visible={visible} footer={null} className={className} width={"500px"} onCancel={onCancelForgotPassword}>
      <div className="third-party-signup-select-role">
        {!requestNewPasswordSuccess ? (
          <div className="link-not-sent">
            <p>Forgot Password?</p>
            <p>Username or Email</p>
            <ConnectedForgotPasswordForm
              onSubmit={onSendLink}
              onCancel={onCancelForgotPassword}
              t={t}
              requestingNewPassword={requestingNewPassword}
            />
          </div>
        ) : (
          <div className="link-sent">
            <div className="message-container">
              <p>
                <Icon type="check" /> You've got mail
              </p>
              <p>We sent you an email with instruction on how to reset your password.</p>
            </div>
            <div className="model-buttons">
              <Button className="close-button" key="close" onClick={onClickClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const ForgotPasswordForm = props => {
  const { getFieldDecorator } = props.form;
  const { t, onCancel, onSubmit: _onSubmit, requestingNewPassword } = props;

  const onSubmit = event => {
    event.preventDefault();
    const { form } = props;
    form.validateFieldsAndScroll((err, { email }) => {
      _onSubmit(email);
    });
  };

  return (
    <Form onSubmit={onSubmit} autoComplete="new-password">
      <Form.Item>
        {getFieldDecorator("email", {
          validateFirst: true,
          initialValue: "",
          rules: [
            {
              transform: value => trim(value)
            },
            {
              required: true,
              message: t("component.signup.teacher.validemail")
            },
            {
              type: "email",
              message: t("component.signup.teacher.validemail")
            }
          ]
        })(
          <Input
            className="email-input"
            type="email"
            placeholder="Enter Registered Username or Email"
            autoComplete="new-password"
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
          <Button className={"send-link-button"} key="sendLink" htmlType="submit" disabled={requestingNewPassword}>
            Send Link
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

const ConnectedForgotPasswordForm = Form.create({ name: "forgotPasswordForm" })(ForgotPasswordForm);

const StyledForgotPasswordPopup = styled(ForgotPasswordPopup)`
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

      p {
        text-align: left;
        margin: 13px;
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
      }

      .link-not-sent {
        display: contents;

        form {
          display: contents;

          .ant-row {
            margin: 13px;

            .email-input {
              background-color: #40444f;
              color: white;
            }
          }
        }

        .model-buttons {
          .cancel-button {
            border: solid 1px ${greenDark};
            color: ${greenDark};
          }
          .send-link-button {
            border: solid 1px ${orange};
            color: ${orange};
          }
        }
      }
      .link-sent {
        display: contents;
        .message-container {
          i {
            border: solid 3px green;
            border-radius: 20px;
            font-size: 25px;
            padding: 5px;
            background-color: green;
            margin: 5px;
          }
        }
        .model-buttons {
          .close-button {
            border: solid 1px ${greenDark};
            color: ${greenDark};
          }
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
    { requestNewPasswordAction }
  )
);

const ConnectedStyledForgotPasswordPopup = enhance(StyledForgotPasswordPopup);

export { ConnectedStyledForgotPasswordPopup as ForgotPasswordPopup };
