import React from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Input, message } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import { compose } from 'redux'
import { trim, isEmpty } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { connect } from 'react-redux'
import {
  withWindowSizes,
  OnDarkBgLogo,
  notification,
  CopyRight,
  EduIf,
  EduThen,
  EduElse,
} from '@edulastic/common'
import { IconLock, IconHash, IconUser, IconMail } from '@edulastic/icons'
import { themeColor, white } from '@edulastic/colors'
import { AssessPeardeckLabelOnDarkBgLogo } from '@edulastic/common/src/components/EduLogo'
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
  Description,
  AlreadyhaveAccount,
  MobileViewLinks,
  DesktopVieLinks,
  DesktopViewCopyright,
} from '../styled'
import {
  signupAction,
  googleLoginAction,
  msoLoginAction,
  studentSignupCheckClasscodeAction,
} from '../../Login/ducks'
import {
  getPartnerKeyFromUrl,
  validatePartnerUrl,
  getPartnerLoginUrl,
  getPartnerTeacherSignupUrl,
  getPartnerDASignupUrl,
  getDistrictLoginUrl,
  getDistrictTeacherSignupUrl,
  isDistrictPolicyAllowed,
  isEmailValid,
} from '../../../common/utils/helpers'
import { Partners } from '../../../common/utils/static/partnerData'

import studentBg from '../../assets/bg-student.png'
import googleIcon from '../../assets/google-btn.svg'
import icon365 from '../../assets/icons8-office-365.svg'
import {
  MAX_TAB_WIDTH,
  LARGE_DESKTOP_WIDTH,
} from '../../../author/src/constants/others'
import PasswordPopup from './PasswordPopup'
import { isPearDomain } from '../../../../utils/pear'

const FormItem = Form.Item
const GOOGLE = 'google'
const OFFICE = 'office'
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
}
class StudentSignup extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  state = {
    confirmDirty: false,
    method: '',
    signupError: {},
    showModal: false,
    proceedBtnDisabled: true,
    submitting: false,
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    })
  }

  handleSubmit = (e) => {
    const { form, signup, t, districtPolicy } = this.props
    const { method, password: passwordForExistingUser } = this.state
    e && e.preventDefault()
    form.validateFieldsAndScroll(
      (err, { password, email, name, classCode }) => {
        if (!err) {
          if (method === GOOGLE) {
            const { googleLoginAction } = this.props
            googleLoginAction({ role: 'student', classCode })
          } else if (method === OFFICE) {
            const { msoLoginAction } = this.props
            msoLoginAction({ role: 'student', classCode })
          } else {
            this.setState({ submitting: true })
            signup({
              passwordForExistingUser,
              password,
              email,
              name,
              role: 'student',
              classCode,
              policyViolation: t('common.policyviolation'),
              districtId: districtPolicy ? districtPolicy.orgId : undefined,
              errorCallback: this.errorCallback,
            })
          }
        }
      }
    )
  }

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state
    confirmDirty = confirmDirty || !!value
    this.setState({ confirmDirty })
  }

  signupMethod = (key) => () => {
    this.setState({
      method: key,
    })
  }

  onChangeEmail = () => {
    this.setState((state) => ({
      ...state,
      signupError: {
        ...state.signupError,
        usernameOrEmail: '',
      },
    }))
  }

  onChangeClassCode = () => {
    this.setState((state) => ({
      ...state,
      signupError: {
        ...state.signupError,
        classCode: '',
      },
    }))
  }

  onBlurClassCode = (event) => {
    const { studentSignupCheckClasscodeAction, districtPolicy } = this.props
    if (event.currentTarget.value) {
      studentSignupCheckClasscodeAction({
        reqData: {
          classCode: event.currentTarget.value,
          role: 'student',
          signOnMethod: 'userNameAndPassword',
          districtId: districtPolicy ? districtPolicy.orgId : undefined,
        },
        errorCallback: this.errorCallback,
      })
    }
  }

  errorCallback = (error) => {
    if (
      error === 'Username/Email already exists. Please sign in to your account.'
    ) {
      this.setState((state) => ({
        ...state,
        signupError: {
          ...state.signupError,
          usernameOrEmail: 'error',
        },
      }))
    } else if (error === 'Please provide a valid class code.') {
      this.setState((state) => ({
        ...state,
        signupError: {
          ...state.signupError,
          classCode: 'Please provide a valid class code.',
        },
      }))
    } else if ((error || {}).askPassword) {
      if (error.passwordMatch === false) {
        notification({ messageKey: 'passwordIsIncorrect' })
      }
      this.setState({
        showModal: true,
        existingUser: error,
      })
    } else {
      notification({ msg: error })
    }
    this.setState({ submitting: false })
  }

  onPasswordChange = (password) => {
    this.setState({
      proceedBtnDisabled: isEmpty(password),
      password,
    })
  }

  onClickProceed = () => {
    this.handleSubmit()
  }

  renderGeneralFormFields = () => {
    const {
      form: { getFieldDecorator, getFieldError },
      t,
      isSignupUsingDaURL,
      orgShortName,
      orgType,
    } = this.props

    const partnerKey = getPartnerKeyFromUrl(location.pathname)
    const partner = Partners[partnerKey]

    const classCodeError =
      this.state.signupError.classCode || getFieldError('classCode')
    const usernameEmailError =
      (this.state.signupError.usernameOrEmail && (
        <span>
          Username/Email already exists. Please{' '}
          <Link
            to={
              isSignupUsingDaURL
                ? getDistrictLoginUrl(orgShortName, orgType)
                : getPartnerLoginUrl(partner)
            }
          >
            sign in
          </Link>{' '}
          to your account.
        </span>
      )) ||
      getFieldError('email')

    return (
      <>
        <FormItem
          {...formItemLayout}
          label={t('component.signup.student.signupclasslabel')}
          validateStatus={classCodeError ? 'error' : 'success'}
          help={classCodeError}
        >
          {getFieldDecorator('classCode', {
            validateFirst: true,
            initialValue: '',
            rules: [
              {
                required: true,
                message: t('component.signup.student.validclasscode'),
              },
            ],
          })(
            <Input
              prefix={<IconHash color={themeColor} />}
              data-cy="classCode"
              placeholder="Class code"
              onChange={this.onChangeClassCode}
              onBlur={this.onBlurClassCode}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={t('component.signup.signupnamelabel')}
        >
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: t('component.signup.student.validinputname'),
              },
            ],
          })(
            <Input
              data-cy="name"
              prefix={<IconUser color={themeColor} />}
              placeholder="Name"
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          validateStatus={usernameEmailError ? 'error' : 'success'}
          help={usernameEmailError}
          label={t('component.signup.student.signupidlabel')}
        >
          {getFieldDecorator('email', {
            validateFirst: true,
            initialValue: '',
            rules: [
              {
                transform: (value) => trim(value),
              },
              {
                required: true,
                message: t('common.validation.emptyemailid'),
              },
              {
                type: 'string',
                message: t('common.validation.validemail'),
              },
              {
                validator: (rule, value, callback) =>
                  isEmailValid(
                    rule,
                    value,
                    callback,
                    'both',
                    t('common.validation.validemail')
                  ),
              },
            ],
          })(
            <Input
              data-cy="email"
              prefix={<IconMail color={themeColor} />}
              placeholder="Email"
              onChange={this.onChangeEmail}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={t('component.signup.signuppasswordlabel')}
        >
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: t('common.validation.emptypassword'),
              },
            ],
          })(
            <Input
              data-cy="password"
              prefix={<IconLock color={themeColor} />}
              type="password"
              autoComplete="off"
              placeholder="Password"
            />
          )}
        </FormItem>
      </>
    )
  }

  renderFormHeader = () => {
    const { t, isSignupUsingDaURL, districtPolicy } = this.props
    return (
      <FormHead>
        <h3 align="center">
          <b>{t('component.signup.signupboxheading')}</b>
        </h3>
        {isDistrictPolicyAllowed(
          isSignupUsingDaURL,
          districtPolicy,
          'googleSignOn'
        ) || !isSignupUsingDaURL ? (
          <ThirdPartyLoginBtn
            onClick={this.signupMethod(GOOGLE)}
            span={20}
            offset={2}
          >
            <img src={googleIcon} alt="" />{' '}
            {t('component.signup.googlesignupbtn')}
          </ThirdPartyLoginBtn>
        ) : null}
        {isDistrictPolicyAllowed(
          isSignupUsingDaURL,
          districtPolicy,
          'office365SignOn'
        ) || !isSignupUsingDaURL ? (
          <ThirdPartyLoginBtn
            onClick={this.signupMethod(OFFICE)}
            span={20}
            offset={2}
          >
            <img src={icon365} alt="" />{' '}
            {t('component.signup.office365signupbtn')}
          </ThirdPartyLoginBtn>
        ) : null}
        <InfoBox span={20} offset={2}>
          <InfoIcon span={3}>
            <IconLock color={white} />
          </InfoIcon>
          <Col span={21}>
            {isPearDomain
              ? t('component.signup.pearAssessInfotext')
              : t('component.signup.infotext')}
          </Col>
        </InfoBox>
      </FormHead>
    )
  }

  renderGoogleORMSOForm = () => {
    const {
      form: { getFieldDecorator, getFieldError },
      t,
    } = this.props

    const classCodeError =
      this.state.signupError.classCode || getFieldError('classCode')

    return (
      <FormItem
        {...formItemLayout}
        validateStatus={classCodeError ? 'error' : 'success'}
        help={classCodeError}
      >
        {getFieldDecorator('classCode', {
          rules: [
            {
              required: true,
              message: t('component.signup.student.validclasscode'),
            },
          ],
        })(
          <Input
            prefix={<IconHash color={themeColor} />}
            data-cy="classCode"
            placeholder="Class code"
            onChange={this.onChangeClassCode}
            onBlur={this.onBlurClassCode}
          />
        )}{' '}
      </FormItem>
    )
  }

  render() {
    const {
      t,
      isSignupUsingDaURL,
      generalSettings,
      districtPolicy,
      orgShortName,
      orgType,
      windowWidth,
    } = this.props

    const { method, submitting } = this.state
    const partnerKey = getPartnerKeyFromUrl(location.pathname)
    const partner = Partners[partnerKey]

    const isUserNameAndPasswordAllowed =
      (isDistrictPolicyAllowed(
        isSignupUsingDaURL,
        districtPolicy,
        'userNameAndPassword'
      ) ||
        !isSignupUsingDaURL) &&
      method !== GOOGLE &&
      method !== OFFICE

    const pearOrEdulasticText = isPearDomain
      ? t('common.pearAssessText')
      : t('common.edulastictext')
    return (
      <div>
        <PasswordPopup
          showModal={this.state.showModal}
          existingUser={this.state.existingUser}
          disabled={this.state.proceedBtnDisabled}
          closeModal={() => this.setState({ showModal: false })}
          onChange={this.onPasswordChange}
          onClickProceed={this.onClickProceed}
        />
        {!isSignupUsingDaURL && !validatePartnerUrl(partner) ? (
          <Redirect exact to="/" />
        ) : null}
        <RegistrationWrapper
          image={
            generalSettings && isSignupUsingDaURL
              ? generalSettings.pageBackground
              : isSignupUsingDaURL
              ? ''
              : partner.keyName === 'login'
              ? studentBg
              : partner.background
          }
        >
          <RegistrationHeader type="flex" align="middle">
            <Col span={12}>
              <EduIf condition={isPearDomain}>
                <EduThen>
                  <AssessPeardeckLabelOnDarkBgLogo height="37px" />
                </EduThen>
                <EduElse>
                  <OnDarkBgLogo height="30px" />
                </EduElse>
              </EduIf>
            </Col>
            <Col span={12} align="right">
              <AlreadyhaveAccount>
                {t('component.signup.alreadyhaveanaccount')}
              </AlreadyhaveAccount>
              <Link
                to={
                  isSignupUsingDaURL
                    ? getDistrictLoginUrl(orgShortName, orgType)
                    : getPartnerLoginUrl(partner)
                }
              >
                {t('common.signinbtn')}
              </Link>
            </Col>
          </RegistrationHeader>
          <RegistrationBody type="flex" align="middle">
            <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
              <FlexWrapper type="flex" align="middle">
                <BannerText xs={24} sm={10} md={11} lg={12} xl={14}>
                  <h1>
                    {pearOrEdulasticText}
                    {windowWidth >= LARGE_DESKTOP_WIDTH && <br />}
                    {t('component.signup.student.forstudent')}
                  </h1>
                  <DesktopVieLinks>
                    {isDistrictPolicyAllowed(
                      isSignupUsingDaURL,
                      districtPolicy,
                      'teacherSignUp'
                    ) || !isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link
                          to={
                            isSignupUsingDaURL
                              ? getDistrictTeacherSignupUrl(
                                  orgShortName,
                                  orgType
                                )
                              : getPartnerTeacherSignupUrl(partner)
                          }
                        >
                          {t('component.signup.signupasteacher')}
                        </Link>
                      </LinkDiv>
                    ) : null}

                    {!isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link to={getPartnerDASignupUrl(partner)}>
                          {t('component.signup.signupasadmin')}
                        </Link>
                      </LinkDiv>
                    ) : null}
                  </DesktopVieLinks>
                </BannerText>
                {windowWidth >= MAX_TAB_WIDTH &&
                  method !== GOOGLE &&
                  method !== OFFICE && (
                    <DesktopViewCopyright>
                      <Col span={24}>
                        <CopyRight />
                      </Col>
                    </DesktopViewCopyright>
                  )}
                <Col xs={24} sm={14} md={13} lg={12} xl={10}>
                  <FormWrapper>
                    {method !== GOOGLE &&
                      method !== OFFICE &&
                      this.renderFormHeader()}
                    <FormBody>
                      <Col span={20} offset={2}>
                        <h5 align="center">
                          {isUserNameAndPasswordAllowed
                            ? t('component.signup.formboxheading')
                            : null}
                          {(method === GOOGLE || method === OFFICE) &&
                            t('component.signup.formboxheadinggoole')}
                        </h5>
                        {(method === GOOGLE || method === OFFICE) && (
                          <Description>
                            {t('component.signup.codeFieldDesc')}
                          </Description>
                        )}
                        <Form onSubmit={this.handleSubmit}>
                          {isUserNameAndPasswordAllowed
                            ? this.renderGeneralFormFields()
                            : null}
                          {(method === GOOGLE || method === OFFICE) &&
                            this.renderGoogleORMSOForm()}
                          <FormItem>
                            {isUserNameAndPasswordAllowed ? (
                              <RegisterButton
                                data-cy="signup"
                                type="primary"
                                htmlType="submit"
                                disabled={submitting}
                              >
                                {t('component.signup.student.signupstudentbtn')}
                              </RegisterButton>
                            ) : null}
                            {(method === GOOGLE || method === OFFICE) && (
                              <RegisterButton
                                data-cy="signup"
                                type="primary"
                                htmlType="submit"
                                disabled={submitting}
                              >
                                {t('component.signup.student.signupentercode')}
                              </RegisterButton>
                            )}
                          </FormItem>
                        </Form>
                      </Col>
                    </FormBody>
                  </FormWrapper>
                </Col>
                <MobileViewLinks>
                  <BannerText>
                    {isDistrictPolicyAllowed(
                      isSignupUsingDaURL,
                      districtPolicy,
                      'teacherSignUp'
                    ) || !isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link
                          to={
                            isSignupUsingDaURL
                              ? getDistrictTeacherSignupUrl(
                                  orgShortName,
                                  orgType
                                )
                              : getPartnerTeacherSignupUrl(partner)
                          }
                        >
                          {t('component.signup.signupasteacher')}
                        </Link>
                      </LinkDiv>
                    ) : null}

                    {!isSignupUsingDaURL ? (
                      <LinkDiv>
                        <Link to={getPartnerDASignupUrl(partner)}>
                          {t('component.signup.signupasadmin')}
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
          {(windowWidth < MAX_TAB_WIDTH ||
            method === GOOGLE ||
            method === OFFICE) && (
            <Copyright sigunpmethod={method}>
              <Col span={24}>
                <CopyRight />
              </Col>
            </Copyright>
          )}
        </RegistrationWrapper>
      </div>
    )
  }
}

const SignupForm = Form.create()(StudentSignup)

const enhance = compose(
  withNamespaces('login'),
  withWindowSizes,
  connect((state) => ({}), {
    signup: signupAction,
    googleLoginAction,
    msoLoginAction,
    studentSignupCheckClasscodeAction,
  })
)

export default enhance(SignupForm)
