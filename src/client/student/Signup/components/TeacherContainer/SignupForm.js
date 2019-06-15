import React from "react";
import PropTypes from "prop-types";
import { trim, debounce } from "lodash";
import { Row, Col, Form, Input, Button } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { connect } from "react-redux";
import {
  springGreen,
  greyGraphstroke,
  grey,
  darkBlue1,
  lightGreen2,
  greenDark1,
  greenDark2,
  greenDark3,
  white
} from "@edulastic/colors";
import { signupAction } from "../../../Login/ducks";

import teacherBg from "../../../assets/bg-teacher.png";
import userIcon from "../../../assets/user-icon.svg";
import mailIcon from "../../../assets/mail-icon.svg";
import keyIcon from "../../../assets/key-icon.svg";
import lockIcon from "../../../assets/lock-icon.svg";
import googleIcon from "../../../assets/google-btn.svg";
import icon365 from "../../../assets/icons8-office-365.svg";
import cleverIcon from "../../../assets/clever-icon.svg";

const FormItem = Form.Item;

class Signup extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  state = {
    confirmDirty: false
  };

  regExp = new RegExp("^[A-Za-z0-9 ]+$");

  handleSubmit = e => {
    const { form, signup } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email, name }) => {
      if (!err) {
        signup({
          password,
          email: trim(email),
          name: trim(name),
          role: "teacher"
        });
      }
    });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  checkPassword = (rule, value, callback) => {
    const { t } = this.props;
    if (value.length < 4) {
      callback(t("component.signup.teacher.shortpassword"));
    } else if (value.includes(" ")) {
      callback(t("component.signup.teacher.validpassword"));
    }
    callback();
  };

  checkName = (rule, value, callback) => {
    const { t } = this.props;
    if (!this.regExp.test(value.trim())) {
      callback(t("component.signup.teacher.validinputname"));
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      t
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 }
      },
      wrapperCol: {
        xs: { span: 24 }
      }
    };

    const changeValidValue = value => trim(value);

    return (
      <div>
        <RegistrationWrapper>
          <RegistrationHeader type="flex" align="middle">
            <Col span={12}>
              <img src="//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png" alt="Edulastic" />
            </Col>
            <Col span={12} align="right">
              <span>{t("component.signup.alreadyhaveanaccount")}</span>
              <Link to="/login">{t("common.signinbtn")}</Link>
            </Col>
          </RegistrationHeader>
          <RegistrationBody type="flex" align="middle">
            <Col xs={18} offset={3}>
              <Row type="flex" align="middle">
                <BannerText xs={24} sm={10} md={11} lg={12} xl={14}>
                  <h1>
                    {t("common.edulastictext")} <br /> {t("component.signup.teacher.forteacher")}
                  </h1>
                  <LinkDiv>
                    <Link to="/adminsignup">{t("component.signup.signupasadmin")}</Link>
                  </LinkDiv>
                  <LinkDiv>
                    <Link to="/studentsignup">{t("component.signup.signupasstudent")}</Link>
                  </LinkDiv>
                </BannerText>
                <Col xs={24} sm={14} md={13} lg={12} xl={10}>
                  <FormWrapper>
                    <FormHead>
                      <h3 align="center">
                        <b>{t("component.signup.signupboxheading")}</b>
                      </h3>
                      <ThirdPartyLoginBtn span={20} offset={2}>
                        <img src={googleIcon} alt="" /> {t("component.signup.googlesignupbtn")}
                      </ThirdPartyLoginBtn>
                      <ThirdPartyLoginBtn span={20} offset={2}>
                        <img src={icon365} alt="" /> {t("component.signup.office365signupbtn")}
                      </ThirdPartyLoginBtn>
                      <ThirdPartyLoginBtn span={20} offset={2}>
                        <img src={cleverIcon} alt="" /> {t("common.cleversigninbtn")}
                      </ThirdPartyLoginBtn>
                      <InfoBox span={20} offset={2}>
                        <InfoIcon span={3}>
                          <img src={lockIcon} alt="" />
                        </InfoIcon>
                        <Col span={21}>{t("component.signup.infotext")}</Col>
                      </InfoBox>
                    </FormHead>
                    <FormBody>
                      <Col span={20} offset={2}>
                        <h5 align="center">{t("component.signup.formboxheading")}</h5>
                        <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                          <FormItem {...formItemLayout} label={t("component.signup.teacher.signupnamelabel")}>
                            {getFieldDecorator("name", {
                              validateFirst: true,
                              initialValue: "",
                              rules: [
                                {
                                  required: true,
                                  message: t("component.signup.teacher.validinputname")
                                },
                                {
                                  type: "string",
                                  validator: this.checkName
                                }
                              ]
                            })(
                              <Input
                                prefix={<img src={userIcon} alt="" />}
                                placeholder="Enter your full name"
                                autoComplete="new-password"
                              />
                            )}
                          </FormItem>
                          <FormItem {...formItemLayout} label={t("component.signup.teacher.signupidlabel")}>
                            {getFieldDecorator("email", {
                              validateFirst: true,
                              rules: [
                                {
                                  transform: changeValidValue
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
                                prefix={<img src={mailIcon} alt="" />}
                                placeholder="Enter your school email"
                                type="email"
                                autoComplete="new-password"
                              />
                            )}
                          </FormItem>
                          <FormItem {...formItemLayout} label={t("component.signup.signuppasswordlabel")}>
                            {getFieldDecorator("password", {
                              validateFirst: true,
                              initialValue: "",
                              rules: [
                                {
                                  required: true,
                                  message: t("component.signup.teacher.validpassword")
                                },
                                {
                                  validator: this.checkPassword
                                }
                              ]
                            })(
                              <Input
                                prefix={<img src={keyIcon} alt="" />}
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="new-password"
                              />
                            )}
                          </FormItem>
                          <FormItem>
                            <RegisterButton type="primary" htmlType="submit">
                              {t("component.signup.teacher.signupteacher")}
                            </RegisterButton>
                          </FormItem>
                        </Form>
                      </Col>
                    </FormBody>
                  </FormWrapper>
                </Col>
              </Row>
            </Col>
          </RegistrationBody>
          <CircleDiv size={64} right={118} top={320} />
          <CircleDiv size={40} right={210} top={432} />
          <CircleDiv size={32} right={72} top={500} />
          <Copyright>
            <Col span={24}>{t("common.copyright")}</Col>
          </Copyright>
        </RegistrationWrapper>
      </div>
    );
  }
}

const SignupForm = Form.create()(Signup);

const enhance = compose(
  withNamespaces("login"),
  connect(
    null,
    { signup: signupAction }
  )
);

export default enhance(SignupForm);

const RegistrationWrapper = styled.div`
  background: ${greyGraphstroke} url(${teacherBg});
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0px;
  padding: 0px;
  min-height: 100vh;
  height: 100%;
  width: 100%;
`;

const RegistrationHeader = styled(Row)`
  padding: 16px 24px;
  color: white;
  span {
    font-size: 12px;
    margin-right: 20px;
  }
  a {
    padding: 8px 48px;
    text-decoration: none;
    color: white;
    text-transform: uppercase;
    border-radius: 4px;
    background: ${springGreen};
  }
`;

const BannerText = styled(Col)`
  color: white;
  h1 {
    color: white;
    font-size: 46px;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
  }
  a {
    font-size: 11px;
    margin-top: 10px;
    font-weight: 600;
    color: white;
  }
  div {
    font-size: 13px;
    margin-top: 10px;
  }
`;

const RegistrationBody = styled(Row)`
  min-height: calc(100vh - 120px);
`;

const Copyright = styled(Row)`
  font-size: 10px;
  color: ${grey};
  text-align: center;
  margin: 25px 0px 10px;
`;

const FormWrapper = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  z-index: 1;
`;

const FormHead = styled(Row)`
  background: ${darkBlue1};
  background: ${`-moz-radial-gradient(ellipse at center, ${lightGreen2} 16%, ${greenDark1} 100%)`};
  background: ${`-webkit-radial-gradient(ellipse at center,  ${lightGreen2} 16%, ${greenDark1} 100%)`};
  background: ${`radial-gradient(ellipse at center, ${lightGreen2} 16%, ${greenDark1} 100%)`};
  padding: 15px;
  h3 {
    color: white;
    margin: 5px 0px 15px;
  }
`;

const ThirdPartyLoginBtn = styled(Col)`
  background: ${white};
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

const InfoBox = styled(Col)`
  margin-top: 10px;
  font-size: 9px;
  color: white;
`;

const InfoIcon = styled(Col)`
  color: rgba(0, 0, 0, 0.44);
  text-align: center;
  padding-top: 4px;
  img {
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
      border: 1px solid ${greenDark2};
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

const RegisterButton = styled(Button)`
  width: 100%;
  background: ${greenDark2};
  font-size: 13px;
  color: ${white};
  border: 1px solid ${greenDark2};
  font-weight: 600;
`;

const LinkDiv = styled.div`
  a {
    padding-bottom: 2px;
    border-bottom: 2px ${springGreen} solid;
  }
`;

const CircleDiv = styled.div`
  height: ${({ size }) => size || 0}px;
  width: ${({ size }) => size || 0}px;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  bottom: ${({ bottom }) => bottom}px;
  right: ${({ right }) => right}px;
  background: ${greenDark3};
  border-radius: 50%;
  position: fixed;
  opacity: 0.6;
  z-index: 0;
`;
