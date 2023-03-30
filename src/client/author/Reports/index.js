import { get } from 'lodash'
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'

import { Spin } from 'antd'
import { MainContentWrapper } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { ReportPaths } from '@edulastic/constants/const/report'

import { Header } from './common/components/Header'
import StandardReport from './components/StandardReport'
import navigation from './common/static/json/navigation.json'
import { PrintableScreen } from './common/styled'
import CustomReports from './components/customReport'
import CustomReportIframe from './components/customReport/customReportIframe'
import SharedReports from './components/sharedReports'
import DataWarehouseReports from './components/dataWarehouseReport'
import DataWarehouseReportsContainer from './subPages/dataWarehouseReports'
import {
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
} from './common/constants/dataWarehouseReports'
import {
  getCsvDownloadingState,
  getPrintingState,
  setSharingStateAction,
  setCsvDownloadingStateAction,
  setPrintingStateAction,
  updateCsvDocsAction,
  getHasCsvDocs,
} from './ducks'
import {
  getCollaborativeGroupsAction,
  getSharedReportList,
  getSharedReportsLoader,
  getSharedReportsAction,
} from './components/sharedReports/ducks'
import { MultipleAssessmentReportContainer } from './subPages/multipleAssessmentReport'
import { SingleAssessmentReportContainer } from './subPages/singleAssessmentReport'
import { StandardsMasteryReportContainer } from './subPages/standardsMasteryReport'
import { StudentProfileReportContainer } from './subPages/studentProfileReport'
import { EngagementReportContainer } from './subPages/engagementReport'
import ClassCreate from '../ManageClass/components/ClassCreate'
import { getUserRole, isSAWithoutSchoolsSelector } from '../src/selectors/user'
import {
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../student/Login/ducks'
import { getHeaderSettings } from './common/util'

const Container = ({
  history,
  role,
  isCsvDownloading,
  isPrinting,
  match,
  isCliUser,
  showCustomReport,
  showDataWarehouseReport,
  loadingSharedReports,
  sharedReportList,
  hasCsvDocs,
  updateCsvDocs,
  isSAWithoutSchools,
  toggleAdminAlertModal,
  emailVerified,
  verificationTS,
  isDefaultDA,
  toggleVerifyEmailModal,
  location,
  setSharingState,
  setPrintingState,
  setCsvDownloadingState,
  premium,
  fetchCollaborationGroups,
  fetchSharedReports,
}) => {
  const [showHeader, setShowHeader] = useState(true)
  const [hideHeader, setHideHeader] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const reportType = get(match, 'params.reportType', 'standard-reports')
  const groupName = navigation.locToData[reportType].group
  const [navigationItems, setNavigationItems] = useState(
    navigation.navigation[groupName]
  )
  const [dynamicBreadcrumb, setDynamicBreadcrumb] = useState('')

  const isAdmin =
    role === roleuser.DISTRICT_ADMIN || role === roleuser.SCHOOL_ADMIN

  useEffect(() => {
    if (isSAWithoutSchools) {
      history.push('/author/tests')
      return toggleAdminAlertModal
    }
    if (!emailVerified && verificationTS && !isDefaultDA) {
      const existingVerificationTS = new Date(verificationTS)
      const expiryDate = new Date(
        existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
      ).getTime()
      if (expiryDate < Date.now()) {
        history.push(role === 'teacher' ? '/' : '/author/items')
        return toggleVerifyEmailModal(true)
      }
    }
    window.onbeforeprint = () => {
      // set 1 so that `isPrinting` dependant useEffect logic doesn't executed
      if (!isPrinting) setPrintingState(1)
    }
    window.onafterprint = () => {
      setPrintingState(false)
    }
    fetchCollaborationGroups()
    fetchSharedReports()
    return () => {
      window.onbeforeprint = () => {}
      window.onafterprint = () => {}
    }
  }, [])

  useEffect(() => {
    setNavigationItems(navigation.navigation[groupName])
  }, [groupName])

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS BEGIN |-----|-----|-----|-----|----- //

  const onShareClickCB = () => {
    setSharingState(true)
  }

  const onPrintClickCB = () => {
    setPrintingState(true)
  }

  const onDownloadCSVClickCB = () => {
    setCsvDownloadingState(true)
  }

  const onRefineResultsCB = (event, status, type) => {
    switch (type) {
      case 'applyButton':
        setShowApply(status)
        break
      default:
        setShowFilter(status)
    }
  }

  useEffect(() => {
    if (isCsvDownloading) {
      setCsvDownloadingState(false)
    }
  }, [isCsvDownloading])

  useEffect(() => {
    // `isPrinting` possible values (1,true,false)
    if (isPrinting === true) {
      window.print()
    }
  }, [isPrinting])

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS ENDED |-----|-----|-----|-----|----- //

  const headerSettings = useMemo(
    () =>
      getHeaderSettings(
        reportType,
        navigation,
        navigationItems,
        location,
        dynamicBreadcrumb,
        onShareClickCB,
        onPrintClickCB,
        onDownloadCSVClickCB,
        onRefineResultsCB
      ),
    [navigationItems, dynamicBreadcrumb, location]
  )

  if (loadingSharedReports) {
    return <Spin size="small" />
  }

  return (
    <PrintableScreen>
      <Route
        exact
        path="/author/reports/:reportType/createClass"
        component={() => {
          setShowHeader(false)
          return <ClassCreate />
        }}
      />
      {showHeader && (
        <Header
          onShareClickCB={headerSettings.onShareClickCB}
          onPrintClickCB={headerSettings.onPrintClickCB}
          onDownloadCSVClickCB={headerSettings.onDownloadCSVClickCB}
          navigationItems={headerSettings.navigationItems}
          activeNavigationKey={reportType}
          hideSideMenu={isCliUser}
          isCliUser={isCliUser}
          showCustomReport={showCustomReport}
          showDataWarehouseReport={showDataWarehouseReport}
          showSharedReport={sharedReportList.length}
          title={headerSettings.title}
          isSharedReport={headerSettings.isSharedReport}
          hasCsvDocs={hasCsvDocs}
          updateCsvDocs={updateCsvDocs}
        />
      )}
      <MainContentWrapper>
        {reportType === 'custom-reports' ? (
          <Route
            exact
            path={match.path}
            render={(_props) => {
              setShowHeader(true)
              return (
                <CustomReports
                  {..._props}
                  isCliUser={isCliUser}
                  breadcrumbData={headerSettings.breadcrumbData}
                  setDynamicBreadcrumb={setDynamicBreadcrumb}
                />
              )
            }}
          />
        ) : reportType === 'standard-reports' ? (
          <Route
            exact
            path={match.path}
            component={() => {
              setShowHeader(true)
              return (
                <StandardReport
                  premium={premium}
                  isAdmin={isAdmin}
                  loc={reportType}
                />
              )
            }}
          />
        ) : null}
        <Route
          path={[
            `/author/reports/assessment-summary/test/`,
            `/author/reports/peer-performance/test/`,
            `/author/reports/question-analysis/test/`,
            `/author/reports/response-frequency/test/`,
            `/author/reports/performance-by-standards/test/`,
            `/author/reports/performance-by-students/test/`,
          ]}
          render={(_props) => {
            if (!hideHeader) {
              setShowHeader(true)
            }
            return (
              <SingleAssessmentReportContainer
                {..._props}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                breadcrumbData={headerSettings.breadcrumbData}
                showFilter={showFilter}
                showApply={showApply}
                onRefineResultsCB={onRefineResultsCB}
                loc={reportType}
                updateNavigation={setNavigationItems}
                setShowHeader={setShowHeader}
                preventHeaderRender={setHideHeader}
              />
            )
          }}
        />
        <Route
          path={[
            `/author/reports/peer-progress-analysis`,
            `/author/reports/student-progress`,
            `/author/reports/performance-over-time`,
            ReportPaths.PRE_VS_POST,
          ]}
          render={(_props) => (
            <MultipleAssessmentReportContainer
              {..._props}
              isCliUser={isCliUser}
              isPrinting={isPrinting}
              breadcrumbData={headerSettings.breadcrumbData}
              showFilter={showFilter}
              showApply={showApply}
              onRefineResultsCB={onRefineResultsCB}
              loc={reportType}
              updateNavigation={setNavigationItems}
              setShowHeader={setShowHeader}
            />
          )}
        />
        <Route
          path={[
            `/author/reports/standards-performance-summary`,
            `/author/reports/standards-gradebook`,
            `/author/reports/standards-progress`,
            `/author/reports/performance-by-rubric-criteria`,
          ]}
          render={(_props) => (
            <StandardsMasteryReportContainer
              {..._props}
              isCliUser={isCliUser}
              isPrinting={isPrinting}
              breadcrumbData={headerSettings.breadcrumbData}
              premium={premium}
              showFilter={showFilter}
              showApply={showApply}
              onRefineResultsCB={onRefineResultsCB}
              loc={reportType}
              navigationItems={navigationItems}
              updateNavigation={setNavigationItems}
              setShowHeader={setShowHeader}
            />
          )}
        />
        <Route
          path={[
            `/author/reports/student-mastery-profile/student/`,
            `/author/reports/student-assessment-profile/student/`,
            `/author/reports/student-profile-summary/student/`,
            `/author/reports/student-progress-profile/student/`,
          ]}
          render={(_props) => {
            setShowHeader(true)
            return (
              <StudentProfileReportContainer
                {..._props}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                breadcrumbData={headerSettings.breadcrumbData}
                showApply={showApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={reportType}
                updateNavigation={setNavigationItems}
              />
            )
          }}
        />
        <Route
          path={[
            `/author/reports/engagement-summary`,
            `/author/reports/activity-by-school`,
            `/author/reports/activity-by-teacher`,
          ]}
          render={(_props) => {
            setShowHeader(true)
            return (
              <EngagementReportContainer
                {..._props}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                breadcrumbData={headerSettings.breadcrumbData}
                showFilter={showFilter}
                showApply={showApply}
                onRefineResultsCB={onRefineResultsCB}
                loc={reportType}
                updateNavigation={setNavigationItems}
              />
            )
          }}
        />
        <Route
          path="/author/reports/custom-reports/:id"
          render={(_props) => {
            setShowHeader(true)
            return (
              <CustomReportIframe
                {..._props}
                isCliUser={isCliUser}
                breadcrumbData={headerSettings.breadcrumbData}
                setDynamicBreadcrumb={setDynamicBreadcrumb}
              />
            )
          }}
        />
        <Route
          path="/author/reports/shared-reports/"
          render={(_props) => {
            setShowHeader(true)
            return (
              <SharedReports
                {..._props}
                isCliUser={isCliUser}
                breadcrumbData={headerSettings.breadcrumbData}
              />
            )
          }}
        />
        <Route
          exact
          path="/author/reports/data-warehouse-reports"
          render={(_props) => {
            setShowHeader(true)
            return (
              <DataWarehouseReports
                {..._props}
                isCliUser={isCliUser}
                breadcrumbData={headerSettings.breadcrumbData}
                loc={reportType}
              />
            )
          }}
        />
        <Route
          path={[DW_WLR_REPORT_URL, DW_MAR_REPORT_URL, DW_DASHBOARD_URL]}
          render={(_props) => (
            <DataWarehouseReportsContainer
              {..._props}
              isCliUser={isCliUser}
              isPrinting={isPrinting}
              breadcrumbData={headerSettings.breadcrumbData}
              showApply={showApply}
              showFilter={showFilter}
              onRefineResultsCB={onRefineResultsCB}
              setShowApply={setShowApply}
              loc={reportType}
              updateNavigation={setNavigationItems}
              setShowHeader={setShowHeader}
            />
          )}
        />
      </MainContentWrapper>
    </PrintableScreen>
  )
}

const enhance = connect(
  (state) => ({
    role: getUserRole(state),
    isPrinting: getPrintingState(state),
    isCsvDownloading: getCsvDownloadingState(state),
    premium: get(state, 'user.user.features.premium', false),
    emailVerified: getEmailVerified(state),
    verificationTS: getVerificationTS(state),
    isDefaultDA: isDefaultDASelector(state),
    // NOTE: customReports (enabled for all premium users) & customReport are separate features
    showCustomReport: get(state, 'user.user.features.customReport', false),
    showDataWarehouseReport: get(
      state,
      'user.user.features.dataWarehouseReports',
      false
    ),
    isCliUser: get(state, 'user.isCliUser', false),
    sharedReportList: getSharedReportList(state),
    loadingSharedReports: getSharedReportsLoader(state),
    hasCsvDocs: getHasCsvDocs(state),
    isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
  }),
  {
    setSharingState: setSharingStateAction,
    setPrintingState: setPrintingStateAction,
    setCsvDownloadingState: setCsvDownloadingStateAction,
    fetchSharedReports: getSharedReportsAction,
    fetchCollaborationGroups: getCollaborativeGroupsAction,
    updateCsvDocs: updateCsvDocsAction,
    toggleAdminAlertModal: toggleAdminAlertModalAction,
    toggleVerifyEmailModal: toggleVerifyEmailModalAction,
  }
)

export default enhance(Container)
