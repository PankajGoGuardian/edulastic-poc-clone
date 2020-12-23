import React from 'react'
import { Layout } from 'antd'
import HeaderSection from './Header/Header'
import MainContent from './Showcase/showcase'

const Dashboard = () => {
  return (
    <Layout>
      <HeaderSection />
      <MainContent />
    </Layout>
  )
}
export default Dashboard
