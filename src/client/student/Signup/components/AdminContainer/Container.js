import React from "react";
import PropTypes from "prop-types";
import { Col, Form, Input } from "antd";
import { Link, Redirect } from "react-router-dom";
import { compose } from "redux";
import { trim } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { connect } from "react-redux";
import {
  RegistrationWrapper,
  FlexWrapper,
  RegistrationHeader,
  BannerText,
  LinkDiv,
  RegistrationBody,
  Copyright,
  FormWrapper,
  FormHead,
  ThirdPartyLoginBtn,
  InfoBox,
  InfoIcon,
  FormBody,
  RegisterButton,
  CircleDiv,
  AlreadyhaveAccount,
  MobileViewLinks,
  DesktopVieLinks
} from "../../styled";
import { signupAction } from "../../../Login/ducks";
import {
  getPartnerKeyFromUrl,
  validatePartnerUrl,
  getPartnerLoginUrl,
  getPartnerStudentSignupUrl,
  getPartnerTeacherSignupUrl,
  isEmailValid
} from "../../../../common/utils/helpers";
import { Partners } from "../../../../common/utils/static/partnerData";

import adminBg from "../../../assets/bg-adm.png";
import userIcon from "../../../assets/user-icon.svg";
import mailIcon from "../../../assets/mail-icon.svg";
import keyIcon from "../../../assets/key-icon.svg";
import lockIcon from "../../../assets/lock-icon.svg";
import googleIcon from "../../../assets/google-btn.svg";
import icon365 from "../../../assets/icons8-office-365.svg";

const FormItem = Form.Item;

class AdminSignup extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  state = {
    confirmDirty: false
  };

  handleSubmit = e => {
    const { form, signup } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email, name }) => {
      if (!err) {
        signup({
          password,
          email,
          name,
          role: "admin"
        });
      }
    });
  };

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state;
    confirmDirty = confirmDirty || !!value;
    this.setState({ confirmDirty });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
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

    const partnerKey = getPartnerKeyFromUrl(location.pathname);
    const partner = Partners[partnerKey];

    return (
      <div>
        {!validatePartnerUrl(partner) ? <Redirect exact to="/login" /> : null}
        <RegistrationWrapper image={partner.partnerKey === "login" ? adminBg : partner.background}>
          <RegistrationHeader type="flex" align="middle">
            <Col span={12}>
              <img src="//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png" alt="Edulastic" />
            </Col>
            <Col span={12} align="right">
              <AlreadyhaveAccount>{t("component.signup.alreadyhaveanaccount")}</AlreadyhaveAccount>
              <Link to={getPartnerLoginUrl(partner)}>{t("common.signinbtn")}</Link>
            </Col>
          </RegistrationHeader>
          <RegistrationBody type="flex" align="middle">
            <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
              <FlexWrapper type="flex" align="middle">
                <BannerText xs={24} sm={10} md={11} lg={12} xl={14}>
                  <h1>
                    {t("common.edulastictext")} <br /> {t("component.signup.admin.foradmin")}
                  </h1>
                  <DesktopVieLinks>
                    <LinkDiv>
                      <Link to={getPartnerTeacherSignupUrl(partner)}>{t("component.signup.signupasteacher")}</Link>
                    </LinkDiv>
                    <LinkDiv>
                      <Link to={getPartnerStudentSignupUrl(partner)}>{t("component.signup.signupasstudent")}</Link>
                    </LinkDiv>
                  </DesktopVieLinks>
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
                        <Form onSubmit={this.handleSubmit}>
                          <FormItem {...formItemLayout} label={t("component.signup.admin.signupnamelabel")}>
                            {getFieldDecorator("name", {
                              rules: [
                                {
                                  required: true,
                                  message: t("component.signup.admin.validinputname")
                                }
                              ]
                            })(<Input prefix={<img src={userIcon} alt="" />} />)}
                          </FormItem>
                          <FormItem {...formItemLayout} label={t("component.signup.admin.signupidlabel")}>
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
                                  type: "string",
                                  message: t("common.validation.validemail")
                                },
                                {
                                  validator: (rule, value, callback) =>
                                    isEmailValid(rule, value, callback, "email", t("common.validation.validemail"))
                                }
                              ]
                            })(<Input prefix={<img src={mailIcon} alt="" />} />)}
                          </FormItem>
                          <FormItem {...formItemLayout} label={t("component.signup.signuppasswordlabel")}>
                            {getFieldDecorator("password", {
                              rules: [
                                {
                                  required: true,
                                  message: t("common.validation.emptypassword")
                                }
                              ]
                            })(<Input prefix={<img src={keyIcon} alt="" />} type="password" />)}
                          </FormItem>
                          <FormItem>
                            <RegisterButton type="primary" htmlType="submit">
                              {t("component.signup.admin.signupadminbtn")}
                            </RegisterButton>
                          </FormItem>
                        </Form>
                      </Col>
                    </FormBody>
                  </FormWrapper>
                </Col>
                <MobileViewLinks>
                  <BannerText>
                    <LinkDiv>
                      <Link to={getPartnerTeacherSignupUrl(partner)}>{t("component.signup.signupasteacher")}</Link>
                    </LinkDiv>
                    <LinkDiv>
                      <Link to={getPartnerStudentSignupUrl(partner)}>{t("component.signup.signupasstudent")}</Link>
                    </LinkDiv>
                  </BannerText>
                </MobileViewLinks>
              </FlexWrapper>
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

const SignupForm = Form.create()(AdminSignup);

const enhance = compose(
  withNamespaces("login"),
  connect(
    null,
    { signup: signupAction }
  )
);

export default enhance(SignupForm);
