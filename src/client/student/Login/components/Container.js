import {
  extraDesktopWidthMax,
  grey,
  mediumDesktopExactWidth,
  middleMobileWidth,
  secondaryTextColor,
  smallDesktopWidth,
  tabletWidth,
  themeColor,
} from '@edulastic/colors'
import { IconLock, IconMail } from '@edulastic/icons'
import { CopyRight, EduIf } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Button, Checkbox, Col, Form, Input, Row } from 'antd'
import { trim, get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import {
  isDistrictPolicyAllowed,
  isEmailValid,
} from '../../../common/utils/helpers'
import cleverIcon from '../../assets/clever-icon.svg'
import googleIcon from '../../assets/google-btn.svg'
import classlinkIcon from '../../assets/classlink-icon.png'
import schoologyIcon from '../../assets/schoology.png'
import icon365 from '../../assets/icons8-office-365.svg'
import {
  cleverLoginAction,
  googleLoginAction,
  loginAction,
  msoLoginAction,
  atlasLoginAction,
  getIsClassCodeModalOpen,
  toggleClassCodeModalAction,
  setForgotPasswordVisibleAction,
  getForgotPasswordVisible,
  setTooManyAttemptAction,
} from '../ducks'
import { ForgotPasswordPopup } from './forgotPasswordPopup'
import { ClassCodePopup } from './classCodePopup'
import TermsAndPrivacy from '../../Signup/components/TermsAndPrivacy/TermsAndPrivacy'
import { isPearDomain } from '../../../../utils/pear'

const FormItem = Form.Item

class LoginContainer extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  }

  state = {
    confirmDirty: false,
    classCode: '',
  }

  handleSubmit = (e) => {
    const { form, login } = this.props
    const { classCode } = this.state
    e.preventDefault()
    form.validateFieldsAndScroll((err, { password, email }) => {
      if (!err) {
        const payload = {
          password,
          username: trim(email),
        }
        if (classCode) {
          Object.assign(payload, {
            classCode,
          })
        }
        login(payload)
      }
    })
  }

  handleClassCodeChange = (classCode) => this.setState({ classCode })

  handleConfirmBlur = ({ target: { value } }) => {
    let { confirmDirty } = this.state
    confirmDirty = confirmDirty || !!value
    this.setState({ confirmDirty })
  }

  onForgotPasswordClick = (e) => {
    const { setforgotPasswordVisible } = this.props
    e.preventDefault()
    setforgotPasswordVisible(true)
  }

  onForgotPasswordCancel = () => {
    const { setforgotPasswordVisible, setTooManyAttempt } = this.props
    setforgotPasswordVisible(false)

    setTooManyAttempt(false)
  }

  onForgotPasswordOk = () => {
    const { setforgotPasswordVisible } = this.props
    setforgotPasswordVisible(false)
  }

  render() {
    const {
      form: { getFieldDecorator },
      t,
      Partners,
      isSignupUsingDaURL,
      districtPolicy,
      generalSettings,
      googleLogin,
      cleverLogin,
      atlasLogin,
      msoLogin,
      loadingComponents,
      isClassCodeModalOpen,
      toggleClassCodeModal,
      forgotPasswordVisible,
    } = this.props

    const { classCode } = this.state

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
      },
    }

    return (
      <LoginContentWrapper
        imageSrc={
          isSignupUsingDaURL &&
          generalSettings &&
          generalSettings.pageBackground
        }
      >
        <Row type="flex" justify="space-around" align="middle">
          {isSignupUsingDaURL && generalSettings && generalSettings.logo && (
            <Col xs={{ span: 20 }} lg={{ span: 6, offset: 2 }}>
              <DistrictLogo src={generalSettings.logo} />
            </Col>
          )}

          <Col xs={{ span: 20 }} lg={{ span: 14 }}>
            <RegistrationBody type="flex" justify={Partners.position}>
              <Col xs={24} sm={22} md={20} lg={14} xl={12}>
                <FormWrapper>
                  <FormHead>
                    <h3 align="center">
                      {Partners.boxTitle === 'Login' ? (
                        <b>{Partners.boxTitle}</b>
                      ) : (
                        <PartnerBoxTitle
                          src={Partners.boxTitle}
                          alt={Partners.name}
                        />
                      )}
                    </h3>

                    <EduIf condition={isPearDomain}>
                      <PsiContainer>
                        <div id="psi_sign_in" />
                      </PsiContainer>
                    </EduIf>

                    {isDistrictPolicyAllowed(
                      isSignupUsingDaURL,
                      districtPolicy,
                      'googleSignOn'
                    ) || !isSignupUsingDaURL ? (
                      <ThirdPartyLoginBtn
                        span={20}
                        offset={2}
                        data-cy="googleLogin"
                        onClick={() => {
                          googleLogin()
                        }}
                      >
                        <img src={googleIcon} alt="" />{' '}
                        {t('common.googlesigninbtn')}
                      </ThirdPartyLoginBtn>
                    ) : null}
                    {isDistrictPolicyAllowed(
                      isSignupUsingDaURL,
                      districtPolicy,
                      'office365SignOn'
                    ) || !isSignupUsingDaURL ? (
                      <ThirdPartyLoginBtn
                        span={20}
                        offset={2}
                        data-cy="msoLogin"
                        onClick={() => {
                          msoLogin()
                        }}
                      >
                        <img src={icon365} alt="" />
                        {t('common.office365signinbtn')}
                      </ThirdPartyLoginBtn>
                    ) : null}
                    {isDistrictPolicyAllowed(
                      isSignupUsingDaURL,
                      districtPolicy,
                      'cleverSignOn'
                    ) || !isSignupUsingDaURL ? (
                      <ThirdPartyLoginBtn
                        span={20}
                        offset={2}
                        data-cy="cleverLogin"
                        onClick={() => {
                          cleverLogin({ payload: 'teacher', isLogin: true })
                        }}
                      >
                        <img src={cleverIcon} alt="" />
                        {t('common.cleversigninbtn')}
                      </ThirdPartyLoginBtn>
                    ) : null}
                    {isDistrictPolicyAllowed(
                      isSignupUsingDaURL,
                      districtPolicy,
                      'atlasSignOn'
                    ) ? (
                      <ThirdPartyLoginBtn
                        span={20}
                        offset={2}
                        data-cy="classlinkLogin"
                        onClick={() => {
                          atlasLogin('teacher')
                        }}
                      >
                        <img
                          src={classlinkIcon}
                          alt=""
                          className="classlink-icon"
                        />
                        {t('common.classlinksigninbtn')}
                      </ThirdPartyLoginBtn>
                    ) : null}
                    {isDistrictPolicyAllowed(
                      isSignupUsingDaURL,
                      districtPolicy,
                      'schoologySignOn'
                    ) ? (
                      <ThirdPartyLoginBtn
                        span={20}
                        offset={2}
                        data-cy="schoologyLogin"
                        onClick={() => {
                          atlasLogin('teacher')
                        }}
                      >
                        <img
                          src={schoologyIcon}
                          alt=""
                          className="schoology-icon"
                        />
                        {t('common.schoologysigninbtn')}
                      </ThirdPartyLoginBtn>
                    ) : null}
                  </FormHead>
                  {isDistrictPolicyAllowed(
                    isSignupUsingDaURL,
                    districtPolicy,
                    'userNameAndPassword'
                  ) || !isSignupUsingDaURL ? (
                    <FormBody>
                      <Col span={20} offset={2}>
                        <Form onSubmit={this.handleSubmit}>
                          <FormItem
                            {...formItemLayout}
                            label={t('common.loginidinputlabel')}
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
                              />
                            )}
                          </FormItem>
                          <FormItem
                            {...formItemLayout}
                            label={t('common.loginpasswordinputlabel')}
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
                              />
                            )}
                          </FormItem>
                          <FormItem>
                            {getFieldDecorator('remember', {
                              valuePropName: 'checked',
                              initialValue: true,
                            })(
                              <RememberCheckBox data-cy="rememberMe">
                                {t('common.remembermetext')}
                              </RememberCheckBox>
                            )}
                            <ForgetPassword
                              style={{ marginTop: 1 }}
                              onClick={this.onForgotPasswordClick}
                              data-cy="forgotPassword"
                            >
                              <span>{t('common.forgotpasswordtext')}</span>
                            </ForgetPassword>
                            <LoginButton
                              loading={loadingComponents.includes(
                                'loginButton'
                              )}
                              data-cy="login"
                              type="primary"
                              htmlType="submit"
                            >
                              {t('common.signinbtn')}
                            </LoginButton>
                          </FormItem>
                        </Form>
                        <TermsAndPrivacy signIn />
                      </Col>
                    </FormBody>
                  ) : null}
                </FormWrapper>
              </Col>
            </RegistrationBody>
          </Col>
        </Row>
        <Copyright>
          <Col span={24}>
            <CopyRight />
          </Col>
        </Copyright>
        {forgotPasswordVisible ? (
          <ForgotPasswordPopup
            visible={forgotPasswordVisible}
            onCancel={this.onForgotPasswordCancel}
            onOk={this.onForgotPasswordOk}
          />
        ) : null}
        {isClassCodeModalOpen ? (
          <ClassCodePopup
            visible={isClassCodeModalOpen}
            toggleClassCodeModal={toggleClassCodeModal}
            classCode={classCode}
            handleClassCodeChange={this.handleClassCodeChange}
            onOk={this.handleSubmit}
          />
        ) : null}
      </LoginContentWrapper>
    )
  }
}

const LoginForm = Form.create()(LoginContainer)

const enhance = compose(
  withNamespaces('login'),
  connect(
    (state) => ({
      loadingComponents: get(state, ['authorUi', 'currentlyLoading'], []),
      isClassCodeModalOpen: getIsClassCodeModalOpen(state),
      forgotPasswordVisible: getForgotPasswordVisible(state),
    }),
    {
      googleLogin: googleLoginAction,
      cleverLogin: cleverLoginAction,
      msoLogin: msoLoginAction,
      login: loginAction,
      atlasLogin: atlasLoginAction,
      toggleClassCodeModal: toggleClassCodeModalAction,
      setforgotPasswordVisible: setForgotPasswordVisibleAction,
      setTooManyAttempt: setTooManyAttemptAction,
    }
  )
)

export default enhance(LoginForm)

const LoginContentWrapper = styled(Row)`
  position: relative;
  background-image: ${({ imageSrc }) =>
    imageSrc ? `url("${imageSrc}")` : 'unset'};
  background-repeat: no-repeat;
  background-size: cover;
  height: calc(100vh - 74.5px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const RegistrationBody = styled(Row)`
  padding: 30px 0px 65px;
  justify-content: center;
`

const Copyright = styled(Row)`
  color: ${grey};
  text-align: center;
  margin: 25px 0px;
  left: 0;
  right: 0;
  bottom: 0;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: 10px;
  }
  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 11px;
  }
`

const PartnerBoxTitle = styled.img`
  height: 25px;
`

const FormWrapper = styled.div`
  background: white;
  overflow: hidden;
  border-radius: 8px;
`

const FormHead = styled(Row)`
  background: #157ad8;
  background: -moz-radial-gradient(
    ellipse at center,
    #94df5e 16%,
    #00b373 100%
  );
  background: -webkit-radial-gradient(
    ellipse at center,
    #94df5e 16%,
    #00b373 100%
  );
  background: radial-gradient(ellipse at center, #94df5e 16%, #00b373 100%);
  padding: 15px;
  h3 {
    color: white;
    margin: 5px 0px 15px;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 26px;
    }
  }
`

const DistrictLogo = styled.img`
  background: transparent;
  max-height: 300px;
  width: 100%;
  object-fit: contain;
`

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
  .classlink-icon {
    transform: scale(1.5);
    margin-top: 2px;
    margin-left: 1px;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
`

const PsiContainer = styled.div`
  width: 83%;
  margin: 0 auto;
`

const FormBody = styled(Row)`
  padding: 15px;
  h5 {
    margin-bottom: 20px;
    margin-top: 5px;
    font-size: 13px;
    color: ${secondaryTextColor};

    @media (max-width: ${tabletWidth}) {
      font-size: 16px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 18px;
    }
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
        font-size: 11px;
        font-family: Open Sans, SemiBold;
        font-weight: 600;
        &.ant-form-item-required {
          &:before,
          &:after {
            content: '';
          }
        }
      }

      @media (min-width: ${mediumDesktopExactWidth}) {
        padding: 0px;
        label {
          font-size: 12px;
        }
      }

      @media (min-width: ${extraDesktopWidthMax}) {
        padding: 0px;
        label {
          font-size: 14px;
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

        @media (max-width: ${tabletWidth}) {
          font-size: 14px;
        }
        @media (max-width: ${middleMobileWidth}) {
          font-size: 10px;
        }
      }
      label {
        float: left;
      }
    }
  }
  .ant-input-affix-wrapper .ant-input-prefix {
    width: 15px;
  }
`

const ForgetPassword = styled('a')`
  float: right;
  color: ${themeColor};
  &:hover {
    color: ${themeColor};
    border-bottom: 1px ${themeColor} solid;
  }
  font-size: 10px;
  & > span {
    @media (min-width: ${smallDesktopWidth}) {
      font-size: 11px;
    }
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 12px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 14px;
    }
  }
`

const LoginButton = styled(Button)`
  width: 100%;
  background: ${themeColor};
  border-color: ${themeColor};
  font-size: 11px;
  color: white;
  border: 1px solid #1fb58b;
  font-weight: 600;
  margin-top: 12px;

  &:hover,
  &:focus {
    border-color: ${themeColor};
    background: ${themeColor};
  }
`

const RememberCheckBox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background: ${themeColor};
  }
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${themeColor};
  }

  .ant-checkbox-wrapper + span,
  .ant-checkbox + span {
    font-size: 10px;
    @media (min-width: ${smallDesktopWidth}) {
      font-size: 11px;
    }
    @media (min-width: ${mediumDesktopExactWidth}) {
      font-size: 12px;
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 14px;
    }
  }
`
