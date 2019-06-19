import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import styled from "styled-components";
import { compose } from "redux";
import { trim } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { springGreen, fadedBlack } from "@edulastic/colors";
import { connect } from "react-redux";
import { loginAction } from "../ducks";

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
    confirmDirty: false
  };

  handleSubmit = e => {
    const { form, login } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email }) => {
      if (!err) {
        login({
          password,
          email: trim(email)
        });
      }
    });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  render() {
    const {
      form: { getFieldDecorator },
      t,
      Partners,
      isSignupUsingDaURL,
      districtPolicy,
      districtShortName
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
                  {(isSignupUsingDaURL && districtPolicy && districtPolicy.googleSignOn) || !isSignupUsingDaURL ? (
                    <ThirdPartyLoginBtn span={20} offset={2}>
                      <img src={googleIcon} alt="" /> {t("common.googlesigninbtn")}
                    </ThirdPartyLoginBtn>
                  ) : null}
                  {(isSignupUsingDaURL && districtPolicy && districtPolicy.office365SignOn) || !isSignupUsingDaURL ? (
                    <ThirdPartyLoginBtn span={20} offset={2}>
                      <img src={icon365} alt="" /> {t("common.office365signinbtn")}
                    </ThirdPartyLoginBtn>
                  ) : null}
                  {(isSignupUsingDaURL && districtPolicy && districtPolicy.cleverSignOn) || !isSignupUsingDaURL ? (
                    <ThirdPartyLoginBtn span={20} offset={2}>
                      <img src={cleverIcon} alt="" /> {t("common.cleversigninbtn")}
                    </ThirdPartyLoginBtn>
                  ) : null}
                </FormHead>
                {(isSignupUsingDaURL && districtPolicy && districtPolicy.userNameAndPassword) || !isSignupUsingDaURL ? (
                  <FormBody>
                    <Col span={20} offset={2}>
                      <h5 align="center">{t("common.formboxheading")}</h5>
                      <Form onSubmit={this.handleSubmit}>
                        <FormItem {...formItemLayout} label={t("common.loginidinputlabel")}>
                          {getFieldDecorator("email", {
                            rules: [
                              {
                                required: true,
                                message: t("common.validation.emptyemailid")
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
                          <ForgetPassword href="#" style={{ marginTop: 1 }}>
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
      </LoginContentWrapper>
    );
  }
}

const LoginForm = Form.create()(LoginContainer);

const enhance = compose(
  withNamespaces("login"),
  connect(
    null,
    { login: loginAction }
  )
);

export default enhance(LoginForm);

const LoginContentWrapper = styled.div``;

const RegistrationBody = styled(Row)`
  padding-top: 30px;
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
  color: ${fadedBlack};

  &:hover {
    color: ${fadedBlack};
    border-bottom: 1px ${springGreen} solid;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  background: ${springGreen};
  font-size: 13px;
  color: white;
  border: 1px solid #1fb58b;
  font-weight: 600;
  margin-top: 12px;

  &:hover {
    background: ${springGreen};
  }
`;

const RememberCheckBox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background: ${springGreen};
  }
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${springGreen};
  }
`;
