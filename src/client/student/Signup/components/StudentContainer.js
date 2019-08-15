import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Input, Button } from "antd";
import styled from "styled-components";
import { Link, Redirect } from "react-router-dom";
import { compose } from "redux";
import { trim, get } from "lodash";
import { isEmailValid } from "../../../common/utils/helpers";
import { withNamespaces } from "@edulastic/localization";
import {
  themeColor,
  greyGraphstroke,
  grey,
  lightGreen2,
  greenDark1,
  greenDark2,
  greenDark3,
  darkBlue1,
  white
} from "@edulastic/colors";
import { connect } from "react-redux";
import {
  signupAction,
  googleLoginAction,
  msoLoginAction,
  signupSetPolicyViolationAction,
  studentSignupCheckClasscodeAction
} from "../../Login/ducks";
import {
  getPartnerKeyFromUrl,
  validatePartnerUrl,
  getPartnerLoginUrl,
  getPartnerTeacherSignupUrl,
  getPartnerDASignupUrl,
  getDistrictLoginUrl,
  getDistrictTeacherSignupUrl,
  isDistrictPolicyAllowed
} from "../../../common/utils/helpers";
import { Partners } from "../../../common/utils/static/partnerData";

import studentBg from "../../assets/bg-student.png";
import hashIcon from "../../assets/hashtag-icon.svg";
import userIcon from "../../assets/user-icon.svg";
import mailIcon from "../../assets/mail-icon.svg";
import keyIcon from "../../assets/key-icon.svg";
import lockIcon from "../../assets/lock-icon.svg";
import googleIcon from "../../assets/google-btn.svg";
import icon365 from "../../assets/icons8-office-365.svg";

const FormItem = Form.Item;
const GOOGLE = "google";
const OFFICE = "office";
const formItemLayout = {
  labelCol: {
    xs: { span: 24 }
  },
  wrapperCol: {
    xs: { span: 24 }
  }
};
class StudentSignup extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  state = {
    confirmDirty: false,
    method: ""
  };

  handleSubmit = e => {
    const { form, signup, t } = this.props;
    const { method } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, { password, email, name, classCode }) => {
      if (!err) {
        if (method === GOOGLE) {
          const { googleLoginAction } = this.props;
          googleLoginAction({ role: "student", classCode });
        } else if (method === OFFICE) {
          const { msoLoginAction } = this.props;
          msoLoginAction({ role: "student", classCode });
        } else {
          signup({
            password,
            email,
            name,
            role: "student",
            classCode,
            policyviolation: t("common.policyviolation")
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

  signupMethod = key => () => {
    this.setState({
      method: key
    });
  };

  onClassCodeChange = () => {
    const { signupSetPolicyViolationAction } = this.props;
    signupSetPolicyViolationAction("");
  };

  onClassCodeBlur = event => {
    const { studentSignupCheckClasscodeAction } = this.props;
    studentSignupCheckClasscodeAction({
      classCode: event.currentTarget.value,
      role: "student",
      signOnMethod: "userNameAndPassword"
    });
  };

  renderGeneralFormFields = () => {
    const {
      form: { getFieldDecorator, getFieldError },
      t,
      isSignupUsingDaURL,
      generalSettings,
      districtPolicy,
      districtShortName
    } = this.props;

    const classCodeError = this.props.signupPolicyViolation || getFieldError("classCode");

    return (
      <>
        <FormItem
          {...formItemLayout}
          label={t("component.signup.student.signupclasslabel")}
          validateStatus={classCodeError ? "error" : "success"}
          help={classCodeError}
        >
          {getFieldDecorator("classCode", {
            validateFirst: true,
            initialValue: "",
            rules: [
              {
                required: true,
                message: t("component.signup.student.validclasscode")
              }
            ]
          })(
            <Input
              prefix={<img src={hashIcon} alt="" />}
              data-cy="classCode"
              placeholder="Class code"
              onChange={this.onClassCodeChange}
              onBlur={this.onClassCodeBlur}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={t("component.signup.signupnamelabel")}>
          {getFieldDecorator("name", {
            rules: [
              {
                required: true,
                message: t("component.signup.student.validinputname")
              }
            ]
          })(<Input data-cy="name" prefix={<img src={userIcon} alt="" />} placeholder="Name" />)}
        </FormItem>
        <FormItem {...formItemLayout} label={t("component.signup.student.signupidlabel")}>
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
                  isEmailValid(rule, value, callback, "both", t("common.validation.validemail"))
              }
            ]
          })(<Input data-cy="email" prefix={<img src={mailIcon} alt="" />} placeholder="Email" />)}
        </FormItem>
        <FormItem {...formItemLayout} label={t("component.signup.signuppasswordlabel")}>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: t("common.validation.emptypassword")
              }
            ]
          })(<Input data-cy="password" prefix={<img src={keyIcon} alt="" />} type="password" placeholder="Password" />)}
        </FormItem>
      </>
    );
  };

  renderFormHeader = () => {
    const { t, isSignupUsingDaURL, generalSettings, districtPolicy, districtShortName } = this.props;
    return (
      <FormHead>
        <h3 align="center">
          <b>{t("component.signup.signupboxheading")}</b>
        </h3>
        {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "googleSignOn") || !isSignupUsingDaURL ? (
          <ThirdPartyLoginBtn onClick={this.signupMethod(GOOGLE)} span={20} offset={2}>
            <img src={googleIcon} alt="" /> {t("component.signup.googlesignupbtn")}
          </ThirdPartyLoginBtn>
        ) : null}
        {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "office365SignOn") || !isSignupUsingDaURL ? (
          <ThirdPartyLoginBtn onClick={this.signupMethod(OFFICE)} span={20} offset={2}>
            <img src={icon365} alt="" /> {t("component.signup.office365signupbtn")}
          </ThirdPartyLoginBtn>
        ) : null}
        <InfoBox span={20} offset={2}>
          <InfoIcon span={3}>
            <img src={lockIcon} alt="" />
          </InfoIcon>
          <Col span={21}>{t("component.signup.infotext")}</Col>
        </InfoBox>
      </FormHead>
    );
  };

  renderGoogleORMSOForm = () => {
    const {
      form: { getFieldDecorator },
      t,
      isSignupUsingDaURL,
      generalSettings,
      districtPolicy,
      districtShortName
    } = this.props;
    return (
      <FormItem {...formItemLayout}>
        {getFieldDecorator("classCode", {
          rules: [
            {
              required: true,
              message: t("component.signup.student.validclasscode")
            }
          ]
        })(<Input prefix={<img src={hashIcon} alt="" />} data-cy="classCode" />)}{" "}
      </FormItem>
    );
  };

  render() {
    const { t, isSignupUsingDaURL, generalSettings, districtPolicy, districtShortName } = this.props;
    const { method } = this.state;

    const partnerKey = getPartnerKeyFromUrl(location.pathname);
    const partner = Partners[partnerKey];

    return (
      <div>
        {!isSignupUsingDaURL && !validatePartnerUrl(partner) ? <Redirect exact to="/login" /> : null}
        <RegistrationWrapper
          image={
            generalSettings && isSignupUsingDaURL
              ? generalSettings.pageBackground
              : isSignupUsingDaURL
              ? ""
              : partner.keyName === "login"
              ? studentBg
              : partner.background
          }
        >
          <RegistrationHeader type="flex" align="middle">
            <Col span={12}>
              <img src="//cdn.edulastic.com/JS/webresources/images/as/as-dashboard-logo.png" alt="Edulastic" />
            </Col>
            <Col span={12} align="right">
              <span>{t("component.signup.alreadyhaveanaccount")}</span>
              <Link to={isSignupUsingDaURL ? getDistrictLoginUrl(districtShortName) : getPartnerLoginUrl(partner)}>
                {t("common.signinbtn")}
              </Link>
            </Col>
          </RegistrationHeader>
          <RegistrationBody type="flex" align="middle">
            <Col xs={18} offset={3}>
              <Row type="flex" align="middle">
                <BannerText xs={24} sm={10} md={11} lg={12} xl={14}>
                  <h1>
                    {t("common.edulastictext")} <br /> {t("component.signup.student.forstudent")}
                  </h1>
                  {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "teacherSignUp") ||
                  !isSignupUsingDaURL ? (
                    <LinkDiv>
                      <Link
                        to={
                          isSignupUsingDaURL
                            ? getDistrictTeacherSignupUrl(districtShortName)
                            : getPartnerTeacherSignupUrl(partner)
                        }
                      >
                        {t("component.signup.signupasteacher")}
                      </Link>
                    </LinkDiv>
                  ) : null}

                  {!isSignupUsingDaURL ? (
                    <LinkDiv>
                      <Link to={getPartnerDASignupUrl(partner)}>{t("component.signup.signupasadmin")}</Link>
                    </LinkDiv>
                  ) : null}
                </BannerText>
                <Col xs={24} sm={14} md={13} lg={12} xl={10}>
                  <FormWrapper>
                    {method !== GOOGLE && method !== OFFICE && this.renderFormHeader()}
                    {isDistrictPolicyAllowed(isSignupUsingDaURL, districtPolicy, "userNameAndPassword") ||
                    !isSignupUsingDaURL ? (
                      <FormBody>
                        <Col span={20} offset={2}>
                          <h5 align="center">
                            {method !== GOOGLE && method !== OFFICE && t("component.signup.formboxheading")}
                            {method === GOOGLE && t("component.signup.formboxheadinggoole")}
                          </h5>
                          {method === GOOGLE && <Description>{t("component.signup.codeFieldDesc")}</Description>}
                          <Form onSubmit={this.handleSubmit}>
                            {method !== GOOGLE && method !== OFFICE && this.renderGeneralFormFields()}
                            {(method === GOOGLE || method === OFFICE) && this.renderGoogleORMSOForm()}
                            <FormItem>
                              <RegisterButton data-cy="signup" type="primary" htmlType="submit">
                                {method !== GOOGLE &&
                                  method !== OFFICE &&
                                  t("component.signup.student.signupstudentbtn")}
                                {(method === GOOGLE || method === OFFICE) &&
                                  t("component.signup.student.signupentercode")}
                              </RegisterButton>
                            </FormItem>
                          </Form>
                        </Col>
                      </FormBody>
                    ) : null}
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

const SignupForm = Form.create()(StudentSignup);

const enhance = compose(
  withNamespaces("login"),
  connect(
    state => ({
      signupPolicyViolation: get(state, "user.signupPolicyViolation", false)
    }),
    {
      signup: signupAction,
      googleLoginAction,
      msoLoginAction,
      signupSetPolicyViolationAction,
      studentSignupCheckClasscodeAction
    }
  )
);

export default enhance(SignupForm);

const RegistrationWrapper = styled.div`
  background: ${greyGraphstroke} url(${props => props.image});
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
    border: 1px solid ${themeColor};
    text-decoration: none;
    color: white;
    border-radius: 4px;
    background: ${themeColor};
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

const LinkDiv = styled.div`
  a {
    padding-bottom: 2px;
    border-bottom: 2px ${themeColor} solid;
  }
`;

const RegistrationBody = styled(Row)`
  min-height: calc(100vh - 120px);
`;

const Copyright = styled(Row)`
  font-size: 10px;
  color: ${grey};
  text-align: center;
  margin: 25px 0px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
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
    filter: contrast(2);
  }
`;

const FormBody = styled(Row)`
  padding: 15px;
  background: white;
  h5 {
    margin-bottom: 16px;
    margin-top: 8px;
    font-size: 16px;
    font-weight: 600;
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
        font-weight: 600;
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
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 13px;
  color: white;
  font-weight: 600;
  &:hover,
  &:focus {
    border-color: ${themeColor};
    background: ${themeColor};
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

const Description = styled.p`
  text-align: center;
  margin-bottom: 16px;
`;
