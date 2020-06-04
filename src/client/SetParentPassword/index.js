import React, { useEffect, useState } from "react";
import { notification } from "@edulastic/common";
import { Layout, Button, Icon, Form, Input, Row, Col, Spin, message } from "antd";
import { withRouter } from "react-router";
import { compose } from "redux";
import { connect } from "react-redux";
import { slice } from "./ducks";

const { Content } = Layout;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function SetParentPassword({
  match,
  form,
  loading,
  loadedUserId,
  sendParentCode,
  resetPassword,
  loadedUserName,
  passwordProgress
}) {
  useEffect(() => {
    if (match?.params?.code) {
      sendParentCode(match?.params?.code);
    }
  }, [match?.params?.code]);

  const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = form;

  const [confirmDirty, setConfirmDirty] = useState(false);

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      const { password, confirm } = values;
      if (password !== confirm) {
        notification({ messageKey:"passwordAndConfirmShouldMatch"});
        return;
      }
      if (password.length < 7) {
        notification({ messageKey:"passwordShouldBeAtleast7Characters"});
        return;
      }
      resetPassword({ password, username: loadedUserName });
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Layout>
        <Content style={{ paddingTop: 15 }}>
          <Row>
            <Col span={6} offset={9}>
              {loadedUserId ? (
                <>
                  <h2 style={{ textAlign: "center" }}>Set Password</h2>

                  <Form.Item label="Password">
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your password!"
                        },
                        {
                          validator: validateToNextPassword
                        }
                      ]
                    })(<Input.Password loading={passwordProgress} />)}
                  </Form.Item>
                  <Form.Item label="Confirm Password">
                    {getFieldDecorator("confirm", {
                      rules: [
                        {
                          required: true,
                          message: "Please confirm your password!"
                        },
                        {
                          validator: compareToFirstPassword
                        }
                      ]
                    })(<Input.Password loading={passwordProgress} onBlur={handleConfirmBlur} />)}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" disabled={passwordProgress} htmlType="submit">
                      Submit
                    </Button>
                  </Form.Item>
                </>
              ) : (
                <>
                  <Spin size="large" />
                  <h2 style={{ textAlign: "center" }}>Verifying code...</h2>
                </>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    </Form>
  );
}

const enhance = compose(
  withRouter,
  Form.create({ name: "ResetpasswordLogin" }),

  connect(
    state => ({
      loading: state?.resetPassword?.loading,
      passwordProgress: state?.resetPassword?.passwordProgress,
      loadedUserId: state?.resetPassword?.parentUserId,
      loadedUserName: state?.resetPassword?.username
    }),
    { sendParentCode: slice.actions.sendParentCodeRequest, resetPassword: slice.actions.resetPasswordRequest }
  )
);

export default enhance(SetParentPassword);
