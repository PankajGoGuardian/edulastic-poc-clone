import React from "react";
import PropTypes from "prop-types";
import { trim } from "lodash";
import { Col, Form, Input, message } from "antd";
import { Link, Redirect } from "react-router-dom";
import { compose } from "redux";
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
import {
  signupAction,
  googleLoginAction,
  cleverLoginAction,
  msoLoginAction,
  setInviteDetailsAction
} from "../../../Login/ducks";
import {
  getPartnerKeyFromUrl,
  validatePartnerUrl,
  getPartnerLoginUrl,
  getPartnerStudentSignupUrl,
  getPartnerDASignupUrl,
  isDistrictPolicyAllowed,
  getDistrictLoginUrl,
  getDistrictStudentSignupUrl,
  getFullNameFromString,
  isEmailValid
} from "../../../../common/utils/helpers";
import { Partners } from "../../../../common/utils/static/partnerData";

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
    confirmDirty: false,
    signupError: {}
  };

  regExp = new RegExp("^[A-Za-z0-9 ]+$");

  handleSubmit = e => {
    const { form, signup, t, invitedUser, invitedUserDetails, setInviteDetailsAction } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email, name }) => {
      if (!err) {
        if (!invitedUser) {
          signup({
            password,
            email: trim(email),
            name: trim(name),
            role: "teacher",
            policyViolation: t("common.policyviolation"),
            errorCallback: this.errorCallback
          });
        } else if (invitedUser) {
          const fullName = getFullNameFromString(trim(name));
          setInviteDetailsAction({
            uid: invitedUserDetails._id,
            email: invitedUserDetails.email,
            username: invitedUserDetails.email,
            ...fullName,
            password
          });
        }
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

  onChangeEmail = () => {
    this.setState(state => ({
      ...state,
      signupError: {
        ...state.signupError,
        email: ""
      }
    }));
  };

  errorCallback = error => {
    if (error === "Email already exists. Please sign in to your account.") {
      this.setState(state => ({
        ...state,
        signupError: {
          ...state.signupError,
          email: "error"
        }
      }));
    } else {
      message.error(error);
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError },
      t,
      image,
      isSignupUsingDaURL,
      districtPolicy,
      districtShortName,
      googleLoginAction,
      cleverLoginAction,
      msoLoginAction,
      invitedUser = false,
      invitedUserDetails = {}
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

    const emailError =
      (this.state.signupError.email && (
        <span>
          Email already exists. Please{" "}
          <Link to={isSignupUsingDaURL ? getDistrictLoginUrl(districtShortName) : getPartnerLoginUrl(partner)}>
            sign in
          </Link>{" "}
          to your account.
        </span>
      )) ||
      getFieldError("email");

    return (
      <div>
        {!isSignupUsingDaURL && !validatePartnerUrl(partner) ? <Redirect exact to="/login" /> : null}
        <RegistrationWrapper image={image}>
          <RegistrationHeader type="flex" align="middle">
            <Col span={12}>
              <img src="//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png" alt="Edulastic" />
            </Col>
            <Col span={12} align="right">
              <AlreadyhaveAccount>{t("component.signup.alreadyhaveanaccount")}</AlreadyhaveAccount>
              <Link to={isSignupUsingDaURL ? getDistrictLoginUrl(districtShortName) : getPartnerLoginUrl(partner)}>
                {t("common.signinbtn")}
              </Link>
            </Col>
          </RegistrationHeader>
          <RegistrationBody type="flex" align="middle">
            <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
              <FlexWrapper type="flex" align="middle">
                <BannerText xs={24} sm={10} md={11} lg={12} xl={14}>
                  <h1>
                    {t("common.edulastictext")} <br /> {t("component.signup.teacher.forteacher")}
                  </h1>
                  <DesktopVieLinks>
                    {!isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link to={getPartnerDASignupUrl(partner)}>{t("component.signup.signupasadmin")}</Link>
                      </LinkDiv>
                    ) : null}
                    {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp") ||
                    !isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link
                          to={
                            isSignupUsingDaURL
                              ? getDistrictStudentSignupUrl(districtShortName)
                              : getPartnerStudentSignupUrl(partner)
                          }
                        >
                          {t("component.signup.signupasstudent")}
                        </Link>
                      </LinkDiv>
                    ) : null}
                  </DesktopVieLinks>
                </BannerText>
                <Col xs={24} sm={14} md={13} lg={12} xl={10}>
                  <FormWrapper>
                    <FormHead>
                      <h3 align="center">
                        <b>{t("component.signup.signupboxheading")}</b>
                      </h3>
                      {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "googleSignOn") ||
                      !isSignupUsingDaURL ? (
                        <ThirdPartyLoginBtn
                          span={20}
                          offset={2}
                          onClick={() => {
                            googleLoginAction({ role: "teacher" });
                          }}
                        >
                          <img src={googleIcon} alt="" /> {t("component.signup.googlesignupbtn")}
                        </ThirdPartyLoginBtn>
                      ) : null}
                      {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "office365SignOn") ||
                      !isSignupUsingDaURL ? (
                        <ThirdPartyLoginBtn
                          span={20}
                          offset={2}
                          onClick={() => {
                            msoLoginAction({ role: "teacher" });
                          }}
                        >
                          <img src={icon365} alt="" /> {t("component.signup.office365signupbtn")}
                        </ThirdPartyLoginBtn>
                      ) : null}
                      {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "cleverSignOn") ||
                      !isSignupUsingDaURL ? (
                        <ThirdPartyLoginBtn
                          span={20}
                          offset={2}
                          onClick={() => {
                            cleverLoginAction("teacher");
                          }}
                        >
                          <img src={cleverIcon} alt="" /> {t("common.cleversigninbtn")}
                        </ThirdPartyLoginBtn>
                      ) : null}

                      <InfoBox span={20} offset={2}>
                        <InfoIcon span={3}>
                          <img src={lockIcon} alt="" />
                        </InfoIcon>
                        <Col span={21}>{t("component.signup.infotext")}</Col>
                      </InfoBox>
                    </FormHead>
                    {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "userNameAndPassword") ||
                    !isSignupUsingDaURL ? (
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
                                    validator: this.checkName
                                  }
                                ]
                              })(
                                <Input
                                  data-cy="name"
                                  prefix={<img src={userIcon} alt="" />}
                                  placeholder="Enter your full name"
                                  autoComplete="new-password"
                                />
                              )}
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              label={t("component.signup.teacher.signupidlabel")}
                              validateStatus={emailError ? "error" : "success"}
                              help={emailError}
                            >
                              {getFieldDecorator("email", {
                                validateFirst: true,
                                initialValue: invitedUser ? invitedUserDetails.email : "",
                                rules: [
                                  {
                                    transform: value => trim(value)
                                  },
                                  {
                                    required: true,
                                    message: t("component.signup.teacher.validemail")
                                  },
                                  {
                                    type: "string",
                                    message: t("component.signup.teacher.validemail")
                                  },
                                  {
                                    validator: (rule, value, callback) =>
                                      isEmailValid(
                                        rule,
                                        value,
                                        callback,
                                        "email",
                                        t("component.signup.teacher.validemail")
                                      )
                                  }
                                ]
                              })(
                                <Input
                                  data-cy="email"
                                  prefix={<img src={mailIcon} alt="" />}
                                  placeholder="Enter your school email"
                                  type="email"
                                  autoComplete="new-password"
                                  disabled={invitedUser}
                                  onChange={this.onChangeEmail}
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
                                  data-cy="password"
                                  prefix={<img src={keyIcon} alt="" />}
                                  type="password"
                                  placeholder="Enter your password"
                                  autoComplete="new-password"
                                />
                              )}
                            </FormItem>
                            <FormItem>
                              <RegisterButton data-cy="signup" type="primary" htmlType="submit">
                                {t("component.signup.teacher.signupteacher")}
                              </RegisterButton>
                            </FormItem>
                          </Form>
                        </Col>
                      </FormBody>
                    ) : null}
                  </FormWrapper>
                </Col>
                <MobileViewLinks>
                  <BannerText>
                    {!isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link to={getPartnerDASignupUrl(partner)}>{t("component.signup.signupasadmin")}</Link>
                      </LinkDiv>
                    ) : null}
                    {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "studentSignUp") ||
                    !isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link
                          to={
                            isSignupUsingDaURL
                              ? getDistrictStudentSignupUrl(districtShortName)
                              : getPartnerStudentSignupUrl(partner)
                          }
                        >
                          {t("component.signup.signupasstudent")}
                        </Link>
                      </LinkDiv>
                    ) : null}
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

const SignupForm = Form.create()(Signup);

const enhance = compose(
  withNamespaces("login"),
  connect(
    null,
    { signup: signupAction, googleLoginAction, cleverLoginAction, msoLoginAction, setInviteDetailsAction }
  )
);

export default enhance(SignupForm);
