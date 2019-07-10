import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import styled from "styled-components";
import { compose } from "redux";
import { trim } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { themeColor, themeColorLighter } from "@edulastic/colors";
import { connect } from "react-redux";
import { loginAction, googleLoginAction, cleverLoginAction, msoLoginAction } from "../ducks";
import { isDistrictPolicyAllowed, emailSpecialCharCheck } from "../../../common/utils/helpers";
import { ForgotPasswordPopup } from "./forgotPasswordPopup";

import mailIcon from "../../assets/mail-icon.svg";
import keyIcon from "../../assets/key-icon.svg";
import googleIcon from "../../assets/google-btn.svg";
import icon365 from "../../assets/icons8-office-365.svg";
import cleverIcon from "../../assets/clever-icon.svg";

const FormItem = Form.Item;

class LoginContainer extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  state = {
    confirmDirty: false,
    forgotPasswordVisible: false
  };

  handleSubmit = e => {
    const { form, login } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email }) => {
      if (!err) {
        login({
          password,
          username: trim(email)
        });
      }
    });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  onForgotPasswordClick = () => {
    this.setState(state => ({
      ...state,
      forgotPasswordVisible: true
    }));
  };

  onForgotPasswordCancel = () => {
    this.setState(state => ({
      ...state,
      forgotPasswordVisible: false
    }));
  };

  onForgotPasswordOk = () => {
    this.setState(state => ({
      ...state,
      forgotPasswordVisible: false
    }));
  };

  render() {
    const {
      form: { getFieldDecorator },
      t,
      Partners,
      isSignupUsingDaURL,
      districtPolicy,
      districtShortName,
      googleLogin,
      cleverLogin,
      msoLogin
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 }
      },
      wrapperCol: {
        xs: { span: 24 }
      }
    };

    return (
      <LoginContentWrapper>
        <Col xs={18} offset={3}>
          <RegistrationBody type="flex" justify={Partners.position}>
            <Col xs={24} sm={18} md={10} lg={9} xl={9}>
              <FormWrapper>
                <FormHead>
                  <h3 align="center">
                    {Partners.boxTitle === "Login" ? (
                      <b>{Partners.boxTitle}</b>
                    ) : (
                      <PartnerBoxTitle src={Partners.boxTitle} alt={Partners.name} />
                    )}
                  </h3>
                  {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "googleSignOn") ||
                  !isSignupUsingDaURL ? (
                    <ThirdPartyLoginBtn
                      span={20}
                      offset={2}
                      onClick={() => {
                        googleLogin();
                      }}
                    >
                      <img src={googleIcon} alt="" /> {t("common.googlesigninbtn")}
                    </ThirdPartyLoginBtn>
                  ) : null}
                  {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "office365SignOn") ||
                  !isSignupUsingDaURL ? (
                    <ThirdPartyLoginBtn
                      span={20}
                      offset={2}
                      onClick={() => {
                        msoLogin();
                      }}
                    >
                      <img src={icon365} alt="" /> {t("common.office365signinbtn")}
                    </ThirdPartyLoginBtn>
                  ) : null}
                  {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "cleverSignOn") ||
                  !isSignupUsingDaURL ? (
                    <ThirdPartyLoginBtn
                      span={20}
                      offset={2}
                      onClick={() => {
                        cleverLogin();
                      }}
                    >
                      <img src={cleverIcon} alt="" /> {t("common.cleversigninbtn")}
                    </ThirdPartyLoginBtn>
                  ) : null}
                </FormHead>
                {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "userNameAndPassword") ||
                !isSignupUsingDaURL ? (
                  <FormBody>
                    <Col span={20} offset={2}>
                      <h5 align="center">{t("common.formboxheading")}</h5>
                      <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label={t("common.loginidinputlabel")}>
                          {getFieldDecorator("email", {
                            validateFirst: true,
                            initialValue: "",
                            rules: [
                              {
                                transform: value => trim(value)
                              },
                              {
                                required: true,
                                message: t("common.validation.emptyemailid")
                              },
                              {
                                type: "email",
                                message: t("common.validation.validemail")
                              },
                              {
                                validator: (rule, value, callback) =>
                                  emailSpecialCharCheck(rule, value, callback, t("common.validation.validemail"))
                              }
                            ]
                          })(<Input data-cy="email" prefix={<img src={mailIcon} alt="" />} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={t("common.loginpasswordinputlabel")}>
                          {getFieldDecorator("password", {
                            rules: [
                              {
                                required: true,
                                message: t("common.validation.emptypassword")
                              }
                            ]
                          })(<Input data-cy="password" prefix={<img src={keyIcon} alt="" />} type="password" />)}
                        </FormItem>
                        <FormItem>
                          {getFieldDecorator("remember", {
                            valuePropName: "checked",
                            initialValue: true
                          })(<RememberCheckBox>{t("common.remembermetext")}</RememberCheckBox>)}
                          <ForgetPassword
                            href="javascript:void(0);"
                            style={{ marginTop: 1 }}
                            onClick={this.onForgotPasswordClick}
                          >
                            {t("common.forgotpasswordtext")}
                          </ForgetPassword>
                          <LoginButton data-cy="login" type="primary" htmlType="submit">
                            {t("common.signinbtn")}
                          </LoginButton>
                        </FormItem>
                      </Form>
                    </Col>
                  </FormBody>
                ) : null}
              </FormWrapper>
            </Col>
          </RegistrationBody>
        </Col>
        <Copyright>
          <Col span={24}>{t("common.copyright")}</Col>
        </Copyright>
        {this.state.forgotPasswordVisible ? (
          <ForgotPasswordPopup
            visible={this.state.forgotPasswordVisible}
            onCancel={this.onForgotPasswordCancel}
            onOk={this.onForgotPasswordOk}
          />
        ) : null}
      </LoginContentWrapper>
    );
  }
}

const LoginForm = Form.create()(LoginContainer);

const enhance = compose(
  withNamespaces("login"),
  connect(
    null,
    {
      googleLogin: googleLoginAction,
      cleverLogin: cleverLoginAction,
      msoLogin: msoLoginAction,
      login: loginAction
    }
  )
);

export default enhance(LoginForm);

const LoginContentWrapper = styled.div``;

const RegistrationBody = styled(Row)`
  padding-top: 30px;
  @media (min-width: 1366px) {
    justify-content: center;
  }
`;

const Copyright = styled(Row)`
  font-size: 10px;
  color: #dddddd;
  text-align: center;
  margin: 25px 0px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

const PartnerBoxTitle = styled.img`
  height: 25px;
`;

const FormWrapper = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 8px;
`;

const FormHead = styled(Row)`
  background: #157ad8;
  background: -moz-radial-gradient(ellipse at center, #94df5e 16%, #00b373 100%);
  background: -webkit-radial-gradient(ellipse at center, #94df5e 16%, #00b373 100%);
  background: radial-gradient(ellipse at center, #94df5e 16%, #00b373 100%);
  padding: 15px;
  h3 {
    color: white;
    margin: 5px 0px 15px;
  }
`;

const ThirdPartyLoginBtn = styled(Col)`
  background: #ffffff;
  margin-top: 5px;
  border-radius: 4px;
  text-align: center;
  font-size: 10px;
  padding: 8px;
  cursor: pointer;
  img {
    float: left;
    width: 14px;
  }
`;

const FormBody = styled(Row)`
  padding: 15px;
  h5 {
    margin-bottom: 20px;
    margin-top: 5px;
    font-size: 13px;
  }
  form {
    .ant-form-item {
      margin-bottom: 10px;
    }
    .ant-form-item-label {
      text-align: left;
      line-height: normal;
      margin-bottom: 3px;
      label {
        font-size: 12px;
        &.ant-form-item-required {
          &:before,
          &:after {
            content: "";
          }
        }
      }
    }
    .ant-input:focus {
      border: 1px solid #1fb58b;
    }
    .has-error {
      .ant-form-explain,
      .ant-form-split {
        font-size: 10px;
      }
    }
    .ant-form-item-children {
      width: 100%;
      float: left;
      label,
      a {
        line-height: normal;
        font-size: 10px;
      }
      label {
        float: left;
      }
    }
  }
  .ant-input-affix-wrapper .ant-input-prefix {
    width: 15px;
  }
`;

const ForgetPassword = styled("a")`
  float: right;
  color: ${themeColorLighter};

  &:hover {
    color: ${themeColorLighter};
    border-bottom: 1px ${themeColor} solid;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 13px;
  color: white;
  border: 1px solid #1fb58b;
  font-weight: 600;
  margin-top: 12px;

  &:hover,
  &:focus {
    border-color: ${themeColor};
    background: ${themeColor};
  }
`;

const RememberCheckBox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background: ${themeColor};
  }
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${themeColor};
  }
`;
