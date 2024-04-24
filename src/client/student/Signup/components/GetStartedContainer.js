import {
  extraDesktopWidthMax,
  greyGraphstroke,
  mainTextColor,
  mobileWidthMax,
  tabletWidth,
  themeColor,
  white,
} from '@edulastic/colors'
import {
  CopyRight,
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  OnDarkBgLogo,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Col, Form, Row, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { IconMail, IconUser } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { isEmpty } from 'lodash'
import IconPearAssessmentFormerlyEdulastic from '@edulastic/icons/src/IconPearAssessmentFormerlyEdulastic'
import {
  getDistrictLoginUrl,
  getDistrictStudentSignupUrl,
  getDistrictTeacherSignupUrl,
  getPartnerDASignupUrl,
  getPartnerKeyFromUrl,
  getPartnerLoginUrl,
  getPartnerStudentSignupUrl,
  getPartnerTeacherSignupUrl,
  isDistrictPolicyAllowed,
  removeMetaTag,
  updateMetaTag,
  validatePartnerUrl,
} from '../../../common/utils/helpers'
import { Partners } from '../../../common/utils/static/partnerData'
import adminBg from '../../assets/small-bg-adm.png'
import studentBg from '../../assets/small-bg-student.png'
import teacherBg from '../../assets/small-bg-teacher.png'
import {
  AlreadyhaveAccount,
  Copyright,
  RegistrationBody,
  RegistrationHeader,
} from '../styled'
import { isPearDomain } from '../../../../utils/pear'
import {
  getExternalAuthUserAction,
  getExternalUserTokenSelector,
  getIsExternalUserLoading,
  getSignupProgressStatus,
  setExternalAuthUserTokenAction,
  signupAction,
} from '../../Login/ducks'
import ClassCodeContainer from './ClassCodeContainer'
import { getExternalAuthToken } from '../../../../loginUtils'

const GetStarted = ({
  t,
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  orgType,
  signup,
  getExternalAuthorizedUser,
  externalUserToken,
  isExternalUserLoading,
  setExternalAuthUserToken,
  isSignupInProgress,
}) => {
  const [isClassCodeModalVisible, setIsClassCodeModalVisible] = useState(false)
  const [token, setToken] = useState(null)
  const partnerKey = getPartnerKeyFromUrl(window.location.pathname)
  const partner = Partners[partnerKey]

  useEffect(() => {
    updateMetaTag({
      content:
        'Join the growing community of teachers who are using Pear Assessment to promote learning.',
    })
    return () => {
      removeMetaTag() // Removing description meta tag
    }
  }, [])

  useEffect(() => {
    const exttToken = getExternalAuthToken()
    if (!isEmpty(exttToken)) {
      getExternalAuthorizedUser({
        token: exttToken,
        isPearSignUpFlow: true,
      })
    }
  }, [])

  useEffect(() => {
    if (externalUserToken) {
      setToken(externalUserToken)
      setExternalAuthUserToken(null)
    }
  }, [externalUserToken])

  const { firstName, lastName, email } = token
    ? JSON.parse(window.atob(token.split('.')[1]))
    : {}
  const isSignUpDetailsPresent = !isEmpty(email)
  // TODO: remove token from browser url once we read it

  const getFormattedName = () => {
    const formattedName = `${firstName || ''} ${lastName || ''}`.trim()
    return formattedName
  }

  const handleSignUp = (role, isAdmin, classCode) => {
    const signUpObj = {
      email,
      name: getFormattedName(),
      role,
      token,
    }

    if (role === roleuser.STUDENT) {
      Object.assign(signUpObj, {
        classCode,
        policyViolation: t('common.policyviolation'),
      })
    }
    if (role === roleuser.TEACHER) {
      if (isAdmin) {
        Object.assign(signUpObj, { isAdmin })
      } else {
        Object.assign(signUpObj, {
          policyViolation: t('common.policyviolation'),
        })
      }
    }
    signup(signUpObj)
  }

  const handleStudentSignUp = (classCode) => {
    setIsClassCodeModalVisible(false)
    handleSignUp(roleuser.STUDENT, false, classCode)
  }

  const pearOrEdulasticText = isPearDomain
    ? t('component.signup.getstarted.pearAssessment')
    : t('component.signup.getstarted.edulasticAssessment')

  const isLoading = isExternalUserLoading || isSignupInProgress

  return (
    <Spin spinning={isLoading}>
      <RegistrationWrapper>
        <Helmet>
          <link
            rel="canonical"
            href="https://assessment.peardeck.com/getStarted"
          />
        </Helmet>
        {!isSignupUsingDaURL && !validatePartnerUrl(partner) ? (
          <Redirect exact to="/" />
        ) : null}
        <RegistrationBg
          src={
            generalSettings && isSignupUsingDaURL
              ? generalSettings.pageBackground
              : partner.background
          }
          alt="bg"
        />
        <RegistrationHeader type="flex" align="middle">
          <Col span={12}>
            <EduIf condition={isPearDomain}>
              <EduThen>
                <IconPearAssessmentFormerlyEdulastic
                  width="148px"
                  height="43px"
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
            <StyledLink
              to={
                isSignupUsingDaURL
                  ? getDistrictLoginUrl(orgShortName, orgType)
                  : getPartnerLoginUrl(partner)
              }
            >
              {t('common.signinbtn')}
            </StyledLink>
          </Col>
        </RegistrationHeader>
        <RegistrationBody type="flex" align="middle">
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 12, offset: 6 }}
          >
            <Row>
              {isSignUpDetailsPresent ? (
                <StyledDiv>
                  <h1>One Last Step!</h1>
                  <InnerStyledDiv>
                    <h2>Account Details</h2>
                    <FlexContainer justifyContent="start">
                      <FlexContainer
                        alignItems="center"
                        mr="30px"
                        maxWidth="47%"
                        style={{ flexGrow: 0 }}
                      >
                        <IconUser color={white} />
                        <Tooltip title={getFormattedName()}>
                          <StyledText>{getFormattedName()}</StyledText>
                        </Tooltip>
                      </FlexContainer>
                      <FlexContainer
                        alignItems="center"
                        style={{
                          flexGrow: 1,
                          minWidth: '0px',
                        }}
                      >
                        <IconMail color={white} />
                        <Tooltip title={email}>
                          <StyledText>{email}</StyledText>
                        </Tooltip>
                      </FlexContainer>
                    </FlexContainer>
                  </InnerStyledDiv>
                </StyledDiv>
              ) : (
                <BannerText xs={24}>
                  <h1>{t('component.signup.getstarted.getstartedtext')}</h1>
                  <h4>
                    {t('component.signup.getstarted.subtext')}{' '}
                    {pearOrEdulasticText}
                    <br /> {t('component.signup.getstarted.subtext2')}
                  </h4>
                </BannerText>
              )}
            </Row>
            <ClassCodeContainer
              visible={isClassCodeModalVisible}
              setVisibility={setIsClassCodeModalVisible}
              onProceed={handleStudentSignUp}
            />
            <ChooseSignupBox>
              {isSignUpDetailsPresent ? (
                <StyledHeader>Select Your role</StyledHeader>
              ) : (
                <h3>{t('component.signup.getstarted.createaccount')}</h3>
              )}
              <div className="signupbox-container">
                {isDistrictPolicyAllowed(
                  isSignupUsingDaURL,
                  districtPolicy,
                  'studentSignUp'
                ) || !isSignupUsingDaURL ? (
                  <StudentSignupBox
                    data-cy="student"
                    to={
                      isSignupUsingDaURL
                        ? getDistrictStudentSignupUrl(orgShortName, orgType)
                        : getPartnerStudentSignupUrl(partner)
                    }
                    onClick={(e) => {
                      if (isSignUpDetailsPresent) {
                        e.preventDefault()
                        setIsClassCodeModalVisible(true)
                      }
                    }}
                    xs={24}
                    sm={8}
                  >
                    <span>{t('component.signup.getstarted.imstudent')}</span>
                  </StudentSignupBox>
                ) : null}
                {isDistrictPolicyAllowed(
                  isSignupUsingDaURL,
                  districtPolicy,
                  'teacherSignUp'
                ) || !isSignupUsingDaURL ? (
                  <TeacherSignupBox
                    data-cy="teacher"
                    to={
                      isSignupUsingDaURL
                        ? getDistrictTeacherSignupUrl(orgShortName, orgType)
                        : getPartnerTeacherSignupUrl(partner)
                    }
                    onClick={(e) => {
                      if (isSignUpDetailsPresent) {
                        e.preventDefault()
                        handleSignUp(roleuser.TEACHER, false)
                      }
                    }}
                    xs={24}
                    sm={8}
                  >
                    <span>{t('component.signup.getstarted.imteacher')}</span>
                  </TeacherSignupBox>
                ) : null}
                {!isSignupUsingDaURL ? (
                  <AdminSignupBox
                    data-cy="admin"
                    to={getPartnerDASignupUrl(partner)}
                    onClick={(e) => {
                      if (isSignUpDetailsPresent) {
                        e.preventDefault()
                        handleSignUp(roleuser.TEACHER, true)
                      }
                    }}
                    xs={24}
                    sm={8}
                  >
                    <span>{t('component.signup.getstarted.imadmin')}</span>
                  </AdminSignupBox>
                ) : null}
              </div>
            </ChooseSignupBox>
          </Col>
        </RegistrationBody>
        <Copyright>
          <Col span={24}>
            <CopyRight />
          </Col>
        </Copyright>
      </RegistrationWrapper>
    </Spin>
  )
}

GetStarted.propTypes = {
  t: PropTypes.func.isRequired,
}

const ChooseSignup = Form.create()(GetStarted)

const enhance = compose(
  withNamespaces('login'),
  connect(
    (state) => ({
      isExternalUserLoading: getIsExternalUserLoading(state),
      externalUserToken: getExternalUserTokenSelector(state),
      isSignupInProgress: getSignupProgressStatus(state),
    }),
    {
      signup: signupAction,
      getExternalAuthorizedUser: getExternalAuthUserAction,
      setExternalAuthUserToken: setExternalAuthUserTokenAction,
    }
  )
)

export default enhance(ChooseSignup)

const RegistrationWrapper = styled.div`
  background: #067059;
  margin: 0px;
  padding: 0px;
  max-height: 100vh;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
`

const RegistrationBg = styled.img`
  position: absolute;
  bottom: 0px;
  top: -20px;
  left: -15px;
  right: 0px;
  width: 102%;
  height: 102%;
`

const BannerText = styled(Col)`
  text-align: center;
  h1 {
    color: white;
    font-size: 42px;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 55px;
    }
  }
  h4 {
    color: white;
    line-height: 1.7;
    font-size: 13px;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 16px;
    }
  }

  @media (max-width: ${tabletWidth}) {
    h1 {
      font-size: 35px;
    }
    h4 {
      font-size: 16px;
      br {
        display: none;
      }
    }
  }
`

const ChooseSignupBox = styled(Row)`
  background: transparent;
  width: 559px;
  margin: 0px auto;
  margin-top: 32px;
  border-radius: 7px 7px 0px 0px;
  text-align: center;
  h3 {
    font-size: 14px;
    font-weight: 600;
    color: ${mainTextColor};
    margin: 0px;
    padding: 16px 0px;
    position: relative;
    z-index: 1;
    background: white;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 18px;
    }
  }
  a {
    color: white;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 11px;
    }
  }
  .signupbox-container {
    display: flex;
    background: transparent;
    justify-content: center;
    border-radius: 10px;
  }

  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
    h3 {
      display: none;
    }
    .signupbox-container {
      flex-direction: column;
      align-items: center;
    }
  }
`

const StudentSignupBox = styled(Link)`
  background: ${greyGraphstroke} url(${studentBg});
  background-position: top center;
  background-size: 102% 102%;
  background-repeat: no-repeat;
  width: calc(100% / 3);
  height: 260px;
  float: left;
  position: relative;
  text-align: center;
  overflow: hidden;
  border-bottom-left-radius: 10px;
  span {
    position: absolute;
    left: 10%;
    right: 10%;
    bottom: 10px;
    background: ${themeColor};
    text-align: center;
    font-size: 12px;
    padding: 8px 4px;
    border-radius: 4px;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 11px;
    }
  }

  @media (max-width: ${mobileWidthMax}) {
    width: 215px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 15px;
    span {
      padding: 11px 4px;
    }
  }
`

const TeacherSignupBox = styled(StudentSignupBox)`
  background: ${greyGraphstroke} url(${teacherBg});
  background-position: top center;
  background-size: 102% 102%;
  background-repeat: no-repeat;
`

const AdminSignupBox = styled(StudentSignupBox)`
  background: ${greyGraphstroke} url(${adminBg});
  background-position: top center;
  background-size: 102% 102%;
  background-repeat: no-repeat;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 0px;
`

export const StyledLink = styled(Link)`
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
`

export const StyledDiv = styled.div`
  width: 600px;
  margin: auto;
  padding: 10px 20px;
  h1 {
    color: white;
    font-size: 42px;
    line-height: 1.3;
    letter-spacing: -2px;
    font-weight: 700;
    margin-top: 0px;
    margin-bottom: 15px;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 55px;
    }
  }
  h2 {
    color: white;
    line-height: 1.7;
    font-size: 28px;
    letter-spacing: -1px;
    font-weight: 600;
    @media (min-width: ${extraDesktopWidthMax}) {
      font-size: 30px;
    }
  }
`
export const InnerStyledDiv = styled.div`
  color: ${white};
  border-radius: 10px;
  background: rgba(73, 127, 110, 0.5);
  opacity: 0.8;
  padding: 10px 25px;
`

export const StyledText = styled.p`
  margin-left: 5px;
  color: ${white};
  font-size: 16px;
  font-weight: 500;
  width: 95%;
  white-space: nowrap;
  overflow: hidden;
`
export const StyledHeader = styled.div`
  color: white;
  line-height: 1.7;
  font-size: 25px;
  letter-spacing: -1.5px;
  font-weight: 600;
  text-align: start;
  margin-bottom: 10px;
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 28px;
  }
`
