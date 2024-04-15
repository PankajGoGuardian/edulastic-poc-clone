import React, { useEffect } from 'react'
import { lazy } from '@loadable/component'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { get } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { isDistrictPolicyAllowed } from '../common/utils/helpers'

import { getOrgDetailsByShortNameAndOrgTypeAction } from '../student/Signup/duck'
import { atlasLoginAction } from '../student/Login/ducks'

const TeacherSignup = lazy(() =>
  import('../student/Signup/components/TeacherContainer/Container')
)
const Auth = lazy(() => import('../Auth'))
const GetStarted = lazy(() =>
  import('../student/Signup/components/GetStartedContainer')
)
const StudentSignup = lazy(() =>
  import('../student/Signup/components/StudentContainer')
)

const DistrictRoutes = ({
  match,
  getOrgDetailsByShortNameAndOrgType,
  atlasLogin,
  generalSettings,
  districtPolicy,
  districtUrlLoading,
  orgType,
  t,
}) => {
  const { orgShortName } = match.params
  const isSignupUsingDaURL = !!orgShortName
  useEffect(() => {
    getOrgDetailsByShortNameAndOrgType({
      data: {
        shortName: orgShortName,
        orgType: orgType === 'school' ? 'institution' : 'district',
      },
      error: { message: t('common.policyviolation') },
    })
  }, [])

  const schoologyAssignmentRedirectUrl = localStorage.getItem(
    'schoologyAssignmentRedirectUrl'
  )
  if (!districtUrlLoading && schoologyAssignmentRedirectUrl) {
    atlasLogin()
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      {districtUrlLoading || schoologyAssignmentRedirectUrl ? (
        'Loading Please Wait...'
      ) : (
        <Switch>
          <Route
            exact
            path={`/${orgType}/:orgShortName`}
            render={(props) => (
              <Auth
                {...props}
                isSignupUsingDaURL={isSignupUsingDaURL}
                generalSettings={generalSettings}
                districtPolicy={districtPolicy}
                orgShortName={orgShortName}
                orgType={orgType}
              />
            )}
          />

          {isDistrictPolicyAllowed(
            isSignupUsingDaURL,
            districtPolicy,
            'teacherSignUp'
          ) ? (
            <Route
              exact
              path={`/${orgType}/:orgShortName/signup`}
              render={(props) => (
                <TeacherSignup
                  {...props}
                  isSignupUsingDaURL={isSignupUsingDaURL}
                  generalSettings={generalSettings}
                  districtPolicy={districtPolicy}
                  orgShortName={orgShortName}
                  orgType={orgType}
                />
              )}
            />
          ) : null}

          {isDistrictPolicyAllowed(
            isSignupUsingDaURL,
            districtPolicy,
            'studentSignUp'
          ) ? (
            <Route
              exact
              path={`/${orgType}/:orgShortName/studentsignup`}
              render={(props) => (
                <StudentSignup
                  {...props}
                  isSignupUsingDaURL={isSignupUsingDaURL}
                  generalSettings={generalSettings}
                  districtPolicy={districtPolicy}
                  orgShortName={orgShortName}
                  orgType={orgType}
                />
              )}
            />
          ) : null}

          {isDistrictPolicyAllowed(
            isSignupUsingDaURL,
            districtPolicy,
            'teacherSignUp'
          ) ||
          isDistrictPolicyAllowed(
            isSignupUsingDaURL,
            districtPolicy,
            'studentSignUp'
          ) ? (
            <Route
              exact
              path={`/${orgType}/:orgShortName/GetStarted`}
              render={(props) => (
                <GetStarted
                  {...props}
                  isSignupUsingDaURL={isSignupUsingDaURL}
                  generalSettings={generalSettings}
                  districtPolicy={districtPolicy}
                  orgShortName={orgShortName}
                  orgType={orgType}
                />
              )}
            />
          ) : null}
          <Redirect exact to={`/${orgType}/${orgShortName}`} />
        </Switch>
      )}
    </>
  )
}

const enhance = compose(
  withNamespaces('login'),
  connect(
    (state) => ({
      generalSettings: get(state, 'signup.generalSettings', undefined),
      districtPolicy: get(state, 'signup.districtPolicy', undefined),
      districtUrlLoading: get(state, 'signup.districtUrlLoading', true),
    }),
    {
      getOrgDetailsByShortNameAndOrgType: getOrgDetailsByShortNameAndOrgTypeAction,
      atlasLogin: atlasLoginAction,
    }
  )
)

export default enhance(DistrictRoutes)
