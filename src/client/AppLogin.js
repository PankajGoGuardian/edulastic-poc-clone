import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import loadable from '@loadable/component'
import { Spin } from 'antd'
import { WithResources, notification } from '@edulastic/common'
import appConfig from '../app-config'
import { isPearDomain, pearIdentifyProduct } from '../utils/pear'

if (
  window.location.hash.includes('#renderResource/close/') ||
  window.location.hash.includes('#assessmentQuestions/close/')
) {
  const v1Id = window.location.hash.split('/')[2]
  window.location.href = `/d/ap?eAId=${v1Id}`
}

const Loading = () => (
  <div>
    <Spin />
  </div>
)

const fallbackComponent = {
  fallback: <Loading />,
}

const Auth = loadable(() => import('./Auth'), fallbackComponent)
const GetStarted = loadable(
  () => import('./student/Signup/components/GetStartedContainer'),
  fallbackComponent
)
const DistrictRoutes = loadable(
  () => import('./districtRoutes/index'),
  fallbackComponent
)
const ResetPassword = loadable(
  () => import('./resetPassword/index'),
  fallbackComponent
)
const TeacherSignup = loadable(
  () => import('./student/Signup/components/TeacherContainer/Container'),
  fallbackComponent
)
const StudentSignup = loadable(
  () => import('./student/Signup/components/StudentContainer'),
  fallbackComponent
)
const AdminSignup = loadable(
  () => import('./student/Signup/components/AdminContainer/Container'),
  fallbackComponent
)

const AppLogin = () => {
  useEffect(() => {
    if (sessionStorage.getItem('errorMessage')) {
      notification({ msg: sessionStorage.getItem('errorMessage') })
      sessionStorage.removeItem('errorMessage')
    }
  }, [])

  return (
    <WithResources
      resources={isPearDomain ? [`${appConfig.pearScriptPath}`] : []}
      fallBack={<Loading />}
      onLoaded={() => {
        pearIdentifyProduct()
      }}
    >
      <Switch>
        <Route exact path="/login" component={Auth} />
        <Route exact path="/resetPassword/" component={ResetPassword} />
        <Route
          path="/district/:orgShortName"
          render={(props) => <DistrictRoutes orgType="district" {...props} />}
        />
        <Route
          path="/districtLogin/:orgShortName"
          render={(props) => (
            <DistrictRoutes orgType="districtLogin" {...props} />
          )}
        />
        <Route
          path="/school/:orgShortName"
          render={(props) => <DistrictRoutes orgType="school" {...props} />}
        />
        <Route path="/Signup" component={TeacherSignup} />
        <Route
          exact
          path="/partnerLogin/:partner/Signup"
          component={TeacherSignup}
        />
        <Route exact path="/partnerLogin/:partner" component={Auth} />
        <Route path="/GetStarted" component={GetStarted} />
        <Route
          exact
          path="/partnerLogin/:partner/GetStarted"
          component={GetStarted}
        />
        <Route path="/AdminSignup" component={AdminSignup} />
        <Route
          exact
          path="/partnerLogin/:partner/AdminSignup"
          component={AdminSignup}
        />
        <Route path="/StudentSignup" component={StudentSignup} />
        <Route
          exact
          path="/partnerLogin/:partner/StudentSignup"
          component={StudentSignup}
        />
        <Route exact path="/" component={Auth} />
      </Switch>
    </WithResources>
  )
}

export default AppLogin
