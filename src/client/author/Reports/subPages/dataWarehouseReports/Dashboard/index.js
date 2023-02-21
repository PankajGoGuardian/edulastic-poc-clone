import React from 'react'
import { SubHeader } from '../../../common/components/Header'
import MasonGrid from './components/MasonGrid'

const Dashboard = ({ breadcrumbData, isCliUser }) => {
  return (
    <>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      />
      <MasonGrid />
    </>
  )
}
export default Dashboard
