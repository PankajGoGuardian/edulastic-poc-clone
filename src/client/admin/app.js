import { ErrorHandler } from '@edulastic/common'
import { Layout } from 'antd'
import React, { useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import ContentBucket from '../author/ContentBuckets/components/ContentBucketsTable/index'
import Collections from '../author/ContentCollections/components/Collections/Collections'
import { themes } from '../theme'
import SideMenu from './Common/SideMenu'
import { MainDiv } from './Common/StyledComponents'
import CustomReportContainer from './Components/CustomReportContainer'
import ProxyUser from './Components/ProxyUser'
import ApiForm from './Containers/ApiForm'
import CleverSearch from './Containers/CleverSearch'
import ClasslinkSearch from './Containers/ClasslinkSearch'
import UpgradeUser from './Containers/UpgradeUser'
import ProfileBody from '../author/DistrictProfile/components/Container/ProfileBody'
import { isEASuperAdmin } from './Common/Utils'

function Admin({ match, history, location, user }) {
  const [state, toggleState] = useState()
  const { permissions = [], role = '' } = user?.user
  return (
    <ThemeProvider theme={themes.default}>
      <Layout style={{ minHeight: '100vh' }}>
        <SideMenu
          isCollapsed={state}
          toggleState={toggleState}
          history={history}
          location={location}
        />
        <MainWrapper isCollapsed={state}>
          <ErrorHandler>
            <Switch>
              <Redirect
                exact
                path={match.path}
                to={`${match.path}/proxyUser`}
              />
              <Route path={`${match.path}/proxyUser`} component={ProxyUser} />
              {!isEASuperAdmin(permissions, role) && (
                <Redirect to={`${match.path}/proxyUser`} />
              )}

              <Route
                path={`${match.path}/search/clever`}
                component={CleverSearch}
              />
              <Route
                path={`${match.path}/search/classlink`}
                component={ClasslinkSearch}
              />
              <Route path={`${match.path}/upgrade`} component={UpgradeUser} />
              <Route path={`${match.path}/apiForms`} component={ApiForm} />
              <Route
                path={`${match.path}/content/collections`}
                component={Collections}
              />
              <Route
                path={`${match.path}/content/buckets`}
                component={ContentBucket}
              />
              <Route
                path={`${match.path}/customReport`}
                component={CustomReportContainer}
              />
              <Route path={`${match.path}/profile`} component={ProfileBody} />
            </Switch>
          </ErrorHandler>
        </MainWrapper>
      </Layout>
    </ThemeProvider>
  )
}

export default Admin

const MainWrapper = styled(MainDiv)`
  padding-left: ${(props) => (props.isCollapsed ? '85px' : '235px')};
`
