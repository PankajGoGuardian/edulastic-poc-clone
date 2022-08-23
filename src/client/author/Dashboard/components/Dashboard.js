import React from 'react'
import { Layout, Spin } from 'antd'
import { connect } from 'react-redux'
import { get } from 'lodash'
import * as Sentry from '@sentry/browser'
import HeaderSection from './Header/Header'
import MainContent from './Showcase/showcase'

const Dashboard = ({ userId, authenticating }) => {
  if (!userId) {
    if (!authenticating) {
      Sentry.captureException(new Error('User is authenticated'))
    }
    return <Spin />
  }
  return (
    <Layout>
      <HeaderSection />
      <MainContent />
    </Layout>
  )
}
export default connect((state) => ({
  userId: state?.user?.user?._id,
  authenticating: get(state, 'user.authenticating', false),
}))(Dashboard)
