import {
  extraDesktopWidthMax,
  greyGraphstroke,
  mainTextColor,
  mobileWidthMax,
  tabletWidth,
  themeColor,
} from '@edulastic/colors'
import { OnDarkBgLogo } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Col, Form, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'
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

const GetStarted = ({
  t,
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  orgType,
}) => {
  const partnerKey = getPartnerKeyFromUrl(location.pathname)
  const partner = Partners[partnerKey]
  return (
    <RegistrationWrapper>
      {!isSignupUsingDaURL && !validatePartnerUrl(partner) ? (
        <Redirect exact to="/login" />
      ) : null}
      <RegistrationBg
        src={
          generalSettings && isSignupUsingDaURL
            ? generalSettings.pageBackground
            : ''
        }
        alt="bg"
      />
      <RegistrationHeader type="flex" align="middle">
        <Col span={12}>
          <OnDarkBgLogo height="30px" />
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
            <BannerText xs={24}>
              <h1>{t('component.signup.getstarted.getstartedtext')}</h1>
              <h4>
                {t('component.signup.getstarted.subtext')} <br />{' '}
                {t('component.signup.getstarted.subtext2')}
              </h4>
            </BannerText>
          </Row>
          <ChooseSignupBox>
            <h3>{t('component.signup.getstarted.createaccount')}</h3>
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
        <Col span={24}>{t('common.copyright')}</Col>
      </Copyright>
    </RegistrationWrapper>
  )
}

GetStarted.propTypes = {
  t: PropTypes.func.isRequired,
}

const ChooseSignup = Form.create()(GetStarted)

const enhance = compose(withNamespaces('login'))

export default enhance(ChooseSignup)

const RegistrationWrapper = styled.div`
  background: #067059;
  margin: 0px;
  padding: 0px;
  min-height: 100vh;
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
