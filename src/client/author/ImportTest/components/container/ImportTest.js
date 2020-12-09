import React from 'react'
import Layout from "antd/es/layout";
import ImportContentContent from '../ImportTestContent'
import ImportContentHeader from '../ImportTestHeader'

const ImportTest = () => {
  return (
    <Layout>
      <ImportContentHeader />
      <ImportContentContent />
    </Layout>
  )
}

export default ImportTest
