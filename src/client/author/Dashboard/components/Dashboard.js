import React from 'react'
import { Layout, Spin } from 'antd'
import { connect } from 'react-redux'
import HeaderSection from './Header/Header'
import MainContent from './Showcase/showcase'

const Dashboard = ({ userId }) => {
  if (!userId) {
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
}))(Dashboard)
