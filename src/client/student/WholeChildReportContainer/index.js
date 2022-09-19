import { MainContentWrapper } from '@edulastic/common'
import { IconBarChart } from '@edulastic/icons'
import { Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { getSPRFilterDataRequestAction } from '../../author/Reports/subPages/studentProfileReport/common/filterDataDucks'
import NoDataNotification from '../../common/components/NoDataNotification'
import {
  getClasses,
  getCurrentGroup,
  getUserId,
  getUserName,
} from '../Login/ducks'
import {
  getAllClassesSelector,
  getEnrollClassAction,
  getFilteredClassesSelector,
  getLoaderSelector,
  resetEnrolledClassAction,
} from '../ManageClass/ducks'
import Header from '../sharedComponents/Header'
import MainContainer from '../styled/mainContainer'
import { getUserRole, getChildrens } from '../../author/src/selectors/user'
import { LoaderConainer } from '../SkillReport/styled'
import ReportData from '../../author/Reports/subPages/dataWarehouseReports/wholeChildReport/components/ReportData'

const getTermId = (_classes, _classId) =>
  _classes.find((c) => c._id === _classId)?.termId || ''

const getChildrenUserName = (childrens, childId) => {
  const childDetails = (childrens || []).find((o) => o._id === childId)
  return childDetails?.userName || childDetails?.email || ''
}

const WholeChildReportContainer = ({
  flag,
  userId,
  userRole,
  userName,
  classId,
  loadAllClasses,
  activeClasses,
  userClasses,
  loading,
  resetEnrolledClass,
  currentChild,
  getSPRFilterDataRequest,
  childrens,
  t,
}) => {
  const [initialLoading, setInitialLoading] = useState(true)
  userId = currentChild
  userName = getChildrenUserName(childrens, currentChild)
  const [settings, setSettings] = useState({
    requestFilters: {
      termId: '',
    },
    selectedStudent: {
      key: userId,
      title: userName,
    },
  })
  const activeEnrolledClasses = (activeClasses || []).filter(
    (c) => c.status == '1'
  )
  const fallbackClassId = activeEnrolledClasses[0]
    ? activeEnrolledClasses[0]._id
    : ''

  useEffect(() => {
    resetEnrolledClass()
    loadAllClasses()
    setInitialLoading(false)
  }, [currentChild])

  useEffect(() => {
    if (classId) {
      const termId = getTermId(userClasses, classId || fallbackClassId)
      console.log(termId)
      setSettings({
        ...settings,
        requestFilters: {
          ...settings.requestFilters,
          termId,
          // if you need to pass multiple ids then pass it as comma separated
          groupIds: classId,
        },
        selectedStudent: {
          key: currentChild,
          title: getChildrenUserName(childrens, currentChild),
        },
      })
    }
  }, [classId, currentChild])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      studentId: userId,
    }
    // set groupId for student
    if (classId) {
      Object.assign(q, {
        // if you need to pass multiple ids then pass it as comma separated
        groupIds: classId,
      })
    } else if (
      !classId &&
      userRole === 'student' &&
      (activeClasses || []).length
    ) {
      const firstActiveClassId = activeClasses?.[0]?._id
      if (firstActiveClassId) {
        Object.assign(q, {
          // if you need to pass multiple ids then pass it as comma separated
          groupIds: firstActiveClassId,
        })
      }
    }
    if (q.termId) getSPRFilterDataRequest(q)
  }, [settings])
  return (
    <MainContainer flag={flag}>
      <Header
        flag={flag}
        titleText={t('common.wholeChildReportTitle')}
        titleIcon={IconBarChart}
        classSelect
        showActiveClass={false}
        classList={activeEnrolledClasses}
        showAllClassesOption={false}
      />
      <MainContentWrapper padding="30px">
        {loading || initialLoading ? (
          <LoaderConainer>
            <Spin />
          </LoaderConainer>
        ) : !settings.requestFilters.termId ? (
          <LoaderConainer>
            <NoDataNotification heading="No Data" description="" />
          </LoaderConainer>
        ) : (
          <>
            <ReportData settings={settings} toggleFilter={() => {}} />
          </>
        )}
      </MainContentWrapper>
    </MainContainer>
  )
}

export default withNamespaces('header')(
  connect(
    (state) => ({
      flag: state.ui.flag,
      classId: getCurrentGroup(state),
      allClasses: getAllClassesSelector(state),
      activeClasses: getFilteredClassesSelector(state),
      userClasses: getClasses(state),
      userName: getUserName(state),
      userId: getUserId(state),
      currentChild: state?.user?.currentChild,
      loading: getLoaderSelector(state),
      userRole: getUserRole(state),
      childrens: getChildrens(state),
    }),
    {
      loadAllClasses: getEnrollClassAction,
      resetEnrolledClass: resetEnrolledClassAction,
      getSPRFilterDataRequest: getSPRFilterDataRequestAction,
    }
  )(WholeChildReportContainer)
)

WholeChildReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
}
