import { get, pullAllBy } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import qs from 'qs'

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
  DW_ATTENDANCE_SUMMARY_REPORT_URL,
  DW_DASHBOARD_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_EFFICACY_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
  DW_SURVEY_INSIGHTS_URL,
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

const Container = (props) => {
  const {
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
  } = props
  const [showHeader, setShowHeader] = useState(true)
  const [hideHeader, setHideHeader] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showApply, setShowApply] = useState(false)
  const reportType = get(props, 'match.params.reportType', 'standard-reports')
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
      if (!isPrinting) props.setPrintingStateAction(1)
    }
    window.onafterprint = () => {
      props.setPrintingStateAction(false)
    }
    props.fetchCollaborationGroups()
    props.fetchSharedReports()
    return () => {
      window.onbeforeprint = () => {}
      window.onafterprint = () => {}
    }
  }, [])

  useEffect(() => {
    if (
      reportType === 'standard-reports' ||
      reportType === 'custom-reports' ||
      reportType === 'shared-reports' ||
      reportType === 'data-warehouse-reports'
    ) {
      setNavigationItems(navigation.navigation[groupName])
    }
  }, [reportType])

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS BEGIN |-----|-----|-----|-----|----- //

  const onShareClickCB = () => {
    props.setSharingStateAction(true)
  }

  const onPrintClickCB = () => {
    props.setPrintingStateAction(true)
  }

  const onDownloadCSVClickCB = () => {
    props.setCsvDownloadingStateAction(true)
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
      props.setCsvDownloadingStateAction(false)
    }
  }, [isCsvDownloading])

  useEffect(() => {
    // `isPrinting` possible values (1,true,false)
    if (isPrinting === true) {
      window.print()
    }
  }, [isPrinting])

  // -----|-----|-----|-----|-----| HEADER BUTTON EVENTS ENDED |-----|-----|-----|-----|----- //

  const headerSettings = useMemo(() => {
    let loc = props?.match?.params?.reportType
    if (
      !loc ||
      (loc &&
        (loc === 'standard-reports' ||
          loc === 'custom-reports' ||
          loc === 'shared-reports' ||
          loc === 'data-warehouse-reports'))
    ) {
      loc = !loc ? reportType : loc
      const breadcrumbInfo = navigation.locToData[loc].breadcrumb
      if (loc === 'custom-reports' && dynamicBreadcrumb) {
        const isCustomReportLoading =
          props.location.pathname.split('custom-reports')[1].length > 1 || false
        if (isCustomReportLoading) {
          pullAllBy(breadcrumbInfo, [{ to: '' }], 'to')
          breadcrumbInfo.push({
            title: dynamicBreadcrumb,
            to: '',
          })
        } else if (
          breadcrumbInfo &&
          breadcrumbInfo[breadcrumbInfo.length - 1].to === ''
        ) {
          pullAllBy(breadcrumbInfo, [{ to: '' }], 'to')
        }
      }
      return {
        loc,
        group: navigation.locToData[loc].group,
        title: navigation.locToData[loc].title,
        breadcrumbData: breadcrumbInfo,
        navigationItems,
      }
    }
    const breadcrumbInfo = [...navigation.locToData[loc].breadcrumb]
    const reportId = qs.parse(props.location.search, {
      ignoreQueryPrefix: true,
    }).reportId
    const isSharedReport = !!(reportId && reportId.toLowerCase() !== 'all')
    if (isSharedReport) {
      breadcrumbInfo[0] = navigation.locToData['shared-reports'].breadcrumb[0]
    }
    return {
      loc,
      group: navigation.locToData[loc].group,
      title: navigation.locToData[loc].title,
      onShareClickCB,
      onPrintClickCB,
      onDownloadCSVClickCB,
      onRefineResultsCB,
      breadcrumbData: breadcrumbInfo,
      navigationItems,
      isSharedReport,
    }
  })

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
                  premium={props.premium}
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
              premium={props.premium}
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
          path={[
            DW_WLR_REPORT_URL,
            DW_MAR_REPORT_URL,
            DW_DASHBOARD_REPORT_URL,
            DW_ATTENDANCE_SUMMARY_REPORT_URL,
            DW_SURVEY_INSIGHTS_URL,
            DW_GOALS_AND_INTERVENTIONS_URL,
            DW_EFFICACY_REPORT_URL,
            DW_EARLY_WARNING_REPORT_URL,
          ]}
          render={(_props) => (
            <DataWarehouseReportsContainer
              {..._props}
              isCliUser={isCliUser}
              isPrinting={isPrinting}
              breadcrumbData={headerSettings.breadcrumbData}
              showApply={showApply}
              showFilter={showFilter}
              onRefineResultsCB={onRefineResultsCB}
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
    setSharingStateAction,
    setPrintingStateAction,
    setCsvDownloadingStateAction,
    fetchSharedReports: getSharedReportsAction,
    fetchCollaborationGroups: getCollaborativeGroupsAction,
    updateCsvDocs: updateCsvDocsAction,
    toggleAdminAlertModal: toggleAdminAlertModalAction,
    toggleVerifyEmailModal: toggleVerifyEmailModalAction,
  }
)

export default enhance(Container)
