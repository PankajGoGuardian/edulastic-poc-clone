import React from 'react'
import { SubHeader } from '../../../common/components/Header'

const Dashboard = ({ breadcrumbData, isCliUser }) => {
  return (
    <>
      <SubHeader
        breadcrumbData={breadcrumbData}
        isCliUser={isCliUser}
        alignment="baseline"
      />
    </>
  )
}
export default Dashboard
