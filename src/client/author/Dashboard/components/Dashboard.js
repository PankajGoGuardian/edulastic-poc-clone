import React from 'react'
import Layout from "antd/es/Layout";
import HeaderSection from './Header/Header'
import MainContent from './Showcase/showcase'
import SideContent from './SideContent/Sidecontent'
import { ContentWrapper } from './styled'

const Dashboard = () => {
  return (
    <Layout>
      <HeaderSection />
      <MainContent />
      <SideContent />
    </Layout>
  )
}
export default Dashboard
