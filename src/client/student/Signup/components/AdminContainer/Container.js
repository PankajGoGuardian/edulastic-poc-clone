import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { Col, Form, Input, message } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import { compose } from 'redux'
import { trim } from 'lodash'
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
import { IconLock, IconUser, IconMail } from '@edulastic/icons'
import { themeColor, white } from '@edulastic/colors'
import { segmentApi } from '@edulastic/api'
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
  DesktopVieLinks,
  DesktopViewCopyright,
  PsiContainer,
} from '../../styled'
import {
  signupAction,
  googleLoginAction,
  msoLoginAction,
} from '../../../Login/ducks'
import {
  getPartnerKeyFromUrl,
  validatePartnerUrl,
  getPartnerLoginUrl,
  getPartnerStudentSignupUrl,
  getPartnerTeacherSignupUrl,
  isEmailValid,
  updateMetaTag,
  removeMetaTag,
} from '../../../../common/utils/helpers'
import { Partners } from '../../../../common/utils/static/partnerData'

import adminBg from '../../../assets/bg-adm.png'
import googleIcon from '../../../assets/google-btn.svg'
import icon365 from '../../../assets/icons8-office-365.svg'

import {
  MAX_TAB_WIDTH,
  LARGE_DESKTOP_WIDTH,
} from '../../../../author/src/constants/others'
import TermsAndPrivacy from '../TermsAndPrivacy/TermsAndPrivacy'
import { isPearDomain } from '../../../../../utils/pear'
import IconPearAssessmentFormerlyEdulastic from '@edulastic/icons/src/IconPearAssessmentFormerlyEdulastic'

const FormItem = Form.Item

class AdminSignup extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  state = {
    confirmDirty: false,
    signupError: {},
  }

  componentDidMount() {
    if (window?.analytics?.track) {
      window.analytics.track('SignupLanded', {
        role: 'admin',
        referrer: window.document.referrer,
      })
    }
    updateMetaTag({
      content: 'Pear Assessment for Administrators',
    })
  }

  componentWillUnmount() {
    removeMetaTag() // Removing description meta tag
  }

  handleSubmit = (e) => {
    const { form, signup } = this.props
    e.preventDefault()
    form.validateFieldsAndScroll((err, { password, email, name }) => {
      if (!err) {
        segmentApi.genericEventTrack('Signup_ButtonClick', { Method: 'Email' })
        signup({
          password,
          email,
          name,
          role: 'teacher',
          errorCallback: this.errorCallback,
          isAdmin: true,
        })
      }
    })
  }

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state
    confirmDirty = confirmDirty || !!value
    this.setState({ confirmDirty })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  onChangeEmail = () => {
    this.setState((state) => ({
      ...state,
      signupError: {
        ...state.signupError,
        email: '',
      },
    }))
  }

  errorCallback = (error) => {
    if (error === 'Email already exists. Please sign in to your account.') {
      this.setState((state) => ({
        ...state,
        signupError: {
          ...state.signupError,
          email: 'error',
        },
      }))
    } else {
      notification({ msg: error })
    }
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldError },
      t,
      windowWidth,
      googleLoginAction,
      msoLoginAction,
    } = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
      },
    }

    const partnerKey = getPartnerKeyFromUrl(location.pathname)
    const partner = Partners[partnerKey]

    const emailError =
      (this.state.signupError.email && (
        <span>
          Email already exists. Please{' '}
          <Link to={getPartnerLoginUrl(partner)}>sign in</Link> to your account.
        </span>
      )) ||
      getFieldError('email')

    const pearOrEdulasticText = isPearDomain
      ? t('common.pearAssessmentText')
      : t('common.edulastictext')

    return (
      <div>
        {!validatePartnerUrl(partner) ? <Redirect exact to="/" /> : null}
        <RegistrationWrapper
          image={partner.partnerKey === 'login' ? adminBg : partner.background}
        >
          <Helmet>
            <link
              rel="canonical"
              href="https://assessment.peardeck.com/adminsignup"
            />
          </Helmet>
          <RegistrationHeader type="flex" align="middle">
            <Col span={12}>
              <EduIf condition={isPearDomain}>
                <EduThen>
                  <IconPearAssessmentFormerlyEdulastic
                    width="148px"
                    height="42px"
                    style={{ marginLeft: '15px' }}
                  />
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
                onClick={() =>
                  segmentApi.genericEventTrack(
                    'SignupPage_SigninButtonClick',
                    {}
                  )
                }
                to={getPartnerLoginUrl(partner)}
              >
                {t('common.signinbtn')}
              </Link>
            </Col>
          </RegistrationHeader>
          <RegistrationBody type="flex" align="middle">
            <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
              <FlexWrapper type="flex" align="middle">
                <BannerText xs={24} sm={10} md={13} lg={12} xl={14}>
                  <h1>
                    {pearOrEdulasticText}
                    {windowWidth >= LARGE_DESKTOP_WIDTH && <br />}
                    {t('component.signup.admin.foradmin')}
                  </h1>
                  <DesktopVieLinks>
                    <LinkDiv>
                      <Link to={getPartnerTeacherSignupUrl(partner)}>
                        {t('component.signup.signupasteacher')}
                      </Link>
                    </LinkDiv>
                    <LinkDiv>
                      <Link to={getPartnerStudentSignupUrl(partner)}>
                        {t('component.signup.signupasstudent')}
                      </Link>
                    </LinkDiv>
                  </DesktopVieLinks>
                </BannerText>
                {windowWidth >= MAX_TAB_WIDTH && (
                  <DesktopViewCopyright>
                    <Col span={24}>
                      <CopyRight />
                    </Col>
                  </DesktopViewCopyright>
                )}
                <Col xs={24} sm={14} md={11} lg={12} xl={10}>
                  <FormWrapper>
                    <FormHead>
                      <h3 align="center">
                        <b>{t('component.signup.signupboxheading')}</b>
                      </h3>
                      <EduIf condition={isPearDomain}>
                        <PsiContainer>
                          <div id="psi_sign_in" />
                        </PsiContainer>
                      </EduIf>
                      <ThirdPartyLoginBtn
                        span={20}
                        offset={2}
                        onClick={() => {
                          googleLoginAction({
                            role: 'teacher',
                            isAdmin: true,
                          })
                        }}
                      >
                        <img src={googleIcon} alt="" />{' '}
                        {t('component.signup.googlesignupbtn')}
                      </ThirdPartyLoginBtn>
                      <ThirdPartyLoginBtn
                        span={20}
                        offset={2}
                        onClick={() => {
                          msoLoginAction({
                            role: 'teacher',
                            isAdmin: true,
                          })
                        }}
                      >
                        <img src={icon365} alt="" />{' '}
                        {t('component.signup.office365signupbtn')}
                      </ThirdPartyLoginBtn>
                      <InfoBox span={20} offset={2}>
                        <InfoIcon span={3}>
                          <IconLock color={white} />
                        </InfoIcon>
                        <Col span={21}>
                          {isPearDomain
                            ? t('component.signup.pearAssessmentInfotext')
                            : t('component.signup.infotext')}
                        </Col>
                      </InfoBox>
                    </FormHead>
                    <FormBody>
                      <Col span={20} offset={2}>
                        <h5 align="center">
                          {t('component.signup.formboxheading')}
                        </h5>
                        <Form onSubmit={this.handleSubmit}>
                          <FormItem
                            {...formItemLayout}
                            label={t('component.signup.admin.signupnamelabel')}
                          >
                            {getFieldDecorator('name', {
                              rules: [
                                {
                                  required: true,
                                  message: t(
                                    'component.signup.admin.validinputname'
                                  ),
                                },
                              ],
                            })(
                              <Input prefix={<IconUser color={themeColor} />} />
                            )}
                          </FormItem>
                          <FormItem
                            {...formItemLayout}
                            label={t('component.signup.admin.signupidlabel')}
                            validateStatus={emailError ? 'error' : 'success'}
                            help={emailError}
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
                                      'email',
                                      t('common.validation.validemail')
                                    ),
                                },
                              ],
                            })(
                              <Input
                                prefix={<IconMail color={themeColor} />}
                                type="email"
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
                                prefix={<IconLock color={themeColor} />}
                                type="password"
                                autoComplete="off"
                              />
                            )}
                          </FormItem>
                          <FormItem>
                            <RegisterButton type="primary" htmlType="submit">
                              {t('component.signup.admin.signupadminbtn')}
                            </RegisterButton>
                          </FormItem>
                          <EduIf condition={!isPearDomain}>
                            <TermsAndPrivacy />
                          </EduIf>
                        </Form>
                      </Col>
                    </FormBody>
                  </FormWrapper>
                </Col>
                <MobileViewLinks>
                  <BannerText>
                    <LinkDiv>
                      <Link to={getPartnerTeacherSignupUrl(partner)}>
                        {t('component.signup.signupasteacher')}
                      </Link>
                    </LinkDiv>
                    <LinkDiv>
                      <Link to={getPartnerStudentSignupUrl(partner)}>
                        {t('component.signup.signupasstudent')}
                      </Link>
                    </LinkDiv>
                  </BannerText>
                </MobileViewLinks>
              </FlexWrapper>
            </Col>
          </RegistrationBody>
          <CircleDiv size={64} right={118} top={320} />
          <CircleDiv size={40} right={210} top={432} />
          <CircleDiv size={32} right={72} top={500} />
          {windowWidth < MAX_TAB_WIDTH && (
            <Copyright>
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

const SignupForm = Form.create()(AdminSignup)

const enhance = compose(
  withNamespaces('login'),
  withWindowSizes,
  connect(null, { signup: signupAction, googleLoginAction, msoLoginAction })
)

export default enhance(SignupForm)
