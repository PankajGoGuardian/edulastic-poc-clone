import React, { useEffect } from 'react'
import Helmet from 'react-helmet'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Layout } from 'antd'

// components
import Header from './Header'
import LoginContainer from './Container'
import { Partners } from '../../../common/utils/static/partnerData'
import {
  validatePartnerUrl,
  getPartnerKeyFromUrl,
  updateMetaTag,
  removeMetaTag,
} from '../../../common/utils/helpers'

const Wrapper = styled(Layout)`
  width: 100%;
  overflow: hidden;
`

const Login = ({
  isSignupUsingDaURL,
  generalSettings,
  districtPolicy,
  orgShortName,
  orgType,
}) => {
  const partnerCheck = getPartnerKeyFromUrl(location.pathname)

  useEffect(() => {
    updateMetaTag({
      content:
        'Simple classroom assessments and scalable common assessments, all in one.',
    })
    return () => {
      removeMetaTag() // Removing description meta tag
    }
  }, [])

  return (
    <Wrapper>
      {!isSignupUsingDaURL && !validatePartnerUrl(Partners[partnerCheck]) ? (
        <Redirect exact to="/" />
      ) : null}
      <LoginWrapper
        Partners={Partners[partnerCheck]}
        image={
          isSignupUsingDaURL
            ? generalSettings && generalSettings.pageBackground
              ? generalSettings.pageBackground
              : ''
            : Partners[partnerCheck].background
        }
      >
        <Helmet>
          <link rel="canonical" href="https://assessment.peardeck.com/login" />
        </Helmet>
        {Partners[partnerCheck].name !== 'login' && (
          <Backdrop Partners={Partners[partnerCheck]} />
        )}
        <Header
          Partners={Partners[partnerCheck]}
          isSignupUsingDaURL={isSignupUsingDaURL}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
          generalSettings={generalSettings}
        />
        <LoginContainer
          Partners={Partners[partnerCheck]}
          isSignupUsingDaURL={isSignupUsingDaURL}
          districtPolicy={districtPolicy}
          orgShortName={orgShortName}
          orgType={orgType}
          generalSettings={generalSettings}
        />
      </LoginWrapper>
    </Wrapper>
  )
}

export default Login

const LoginWrapper = styled.div`
  background: ${(props) =>
    props.image
      ? `#999999 url(${props.image}) no-repeat fixed top center`
      : '#067059'};
  background-size: cover;
  margin: 0px;
  padding: 0px;
  min-height: 100vh;
  height: 100%;
  width: 100%;
`

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(0, 0, 0, ${(props) => props.Partners.opacity});
`
