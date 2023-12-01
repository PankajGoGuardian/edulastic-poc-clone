import { Layout, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  getDistrictPoliciesSelector,
  getUser,
} from '../../../author/src/selectors/user'
import {
  getEnrollClassAction,
  joinClassAction,
  setFilterClassAction,
} from '../ducks'
// components
import ManageClassContainer from './Container'
import { proxyRole } from '../../Login/ducks'

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${(props) => props.theme.sectionBackgroundColor};
`

const ManageClass = ({
  allClasses,
  filterClasses,
  loadAllClasses,
  loading,
  setClassList,
  joinClass,
  studentData,
  userRole,
  currentChild,
  proxyUserRole,
  districtPolicies,
}) => {
  useEffect(() => {
    loadAllClasses()
  }, [currentChild])
  const [showClass, setShowClass] = useState(true)
  if (loading) return <Spin />
  return (
    <Wrapper>
      <ManageClassContainer
        classList={filterClasses}
        loading={loading}
        showClass={showClass}
        joinClass={joinClass}
        studentData={studentData}
        classSelect={false}
        showActiveClass
        allClassList={allClasses}
        setClassList={setClassList}
        setShowClass={setShowClass}
        userRole={userRole}
        currentChild={currentChild}
        proxyUserRole={proxyUserRole}
        districtPolicies={districtPolicies}
      />
    </Wrapper>
  )
}

export default connect(
  (state) => ({
    allClasses: state.studentEnrollClassList.allClasses || [],
    filterClasses: state.studentEnrollClassList.filteredClasses || [],
    loading: state.studentEnrollClassList.loading,
    studentData: getUser(state),
    userRole: state?.user?.user?.role,
    currentChild: state?.user?.currentChild,
    proxyUserRole: proxyRole(state),
    districtPolicies: getDistrictPoliciesSelector(state),
  }),
  {
    loadAllClasses: getEnrollClassAction,
    setClassList: setFilterClassAction,
    joinClass: joinClassAction,
  }
)(ManageClass)
