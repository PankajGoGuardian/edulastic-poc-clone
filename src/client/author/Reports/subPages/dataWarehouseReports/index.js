import React from 'react'
import { Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { withNamespaces } from 'react-i18next'
import { TEST_TYPE_SURVEY } from '@edulastic/constants/const/testTypes'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import WholeLearnerReport from './wholeLearnerReport'
import MultipleAssessmentReport from './MultipleAssessmentReport'
import Dashboard from './Dashboard'
import EarlyWarningReport from './EarlyWarningReport'

import {
  DW_ATTENDANCE_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
  DW_EFFICACY_REPORT_URL,
} from '../../common/constants/dataWarehouseReports'
import AttendanceReport from './AttendanceSummary'
import GoalsAndInterventions from './GoalsAndInterventions'
import EfficacyReport from './EfficacyReport'
import { SingleAssessmentReportContainer } from '../singleAssessmentReport'
import { StandardsMasteryReportContainer } from '../standardsMasteryReport'

const DW_THEME = {
  dynamicFGColor: true,
}

const DataWarehouseReportsContainer = ({
  breadcrumbData,
  isCliUser,
  isPrinting,
  showApply,
  setShowApply,
  showFilter,
  onRefineResultsCB,
  loc,
  navigationItems,
  updateNavigation,
  setShowHeader,
  ..._props
}) => {
  return (
    <ThemeProvider theme={DW_THEME}>
      <FeaturesSwitch
        inputFeatures="dataWarehouseReports"
        actionOnInaccessible="hidden"
      >
        <Route
          exact
          path={`${DW_WLR_REPORT_URL}:studentId?`}
          render={() => {
            setShowHeader(true)
            return (
              <WholeLearnerReport
                {..._props}
                breadcrumbData={breadcrumbData}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                showApply={showApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
              />
            )
          }}
        />
        <Route
          exact
          path={DW_MAR_REPORT_URL}
          render={() => {
            setShowHeader(true)
            return (
              <MultipleAssessmentReport
                {..._props}
                breadcrumbData={breadcrumbData}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                showApply={showApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
              />
            )
          }}
        />
        <Route
          exact
          path={DW_DASHBOARD_URL}
          render={() => {
            setShowHeader(true)
            return (
              <Dashboard
                {..._props}
                breadcrumbData={breadcrumbData}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                showApply={showApply}
                setShowApply={setShowApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
              />
            )
          }}
        />
        <Route
          exact
          path={DW_ATTENDANCE_REPORT_URL}
          render={() => {
            setShowHeader(true)
            return (
              <AttendanceReport
                {..._props}
                breadcrumbData={breadcrumbData}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                showApply={showApply}
                setShowApply={setShowApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
              />
            )
          }}
        />
        <Route
          exact
          path={DW_EARLY_WARNING_REPORT_URL}
          render={() => {
            setShowHeader(true)
            return (
              <EarlyWarningReport
                {..._props}
                breadcrumbData={breadcrumbData}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                showApply={showApply}
                setShowApply={setShowApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
              />
            )
          }}
        />
        <Route
          exact
          path={DW_GOALS_AND_INTERVENTIONS_URL}
          render={() => {
            setShowHeader(true)
            return (
              <GoalsAndInterventions
                {..._props}
                breadcrumbData={breadcrumbData}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                showApply={showApply}
                setShowApply={setShowApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
              />
            )
          }}
        />
        <Route
          exact
          path={DW_EFFICACY_REPORT_URL}
          render={() => {
            setShowHeader(true)
            return (
              <EfficacyReport
                {..._props}
                breadcrumbData={breadcrumbData}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                showApply={showApply}
                setShowApply={setShowApply}
                showFilter={showFilter}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
              />
            )
          }}
        />
        <Route
          path={[`/author/reports/sel-response-summary/test/`]}
          render={() => {
            setShowHeader(true)
            return (
              <SingleAssessmentReportContainer
                {..._props}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                breadcrumbData={breadcrumbData}
                showFilter={showFilter}
                showApply={showApply}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                updateNavigation={updateNavigation}
                setShowHeader={setShowHeader}
                testTypesAllowed={TEST_TYPE_SURVEY}
              />
            )
          }}
        />
        <Route
          path={[`/author/reports/sel-insights`]}
          render={() => {
            setShowHeader(true)
            return (
              <StandardsMasteryReportContainer
                {..._props}
                isCliUser={isCliUser}
                isPrinting={isPrinting}
                breadcrumbData={breadcrumbData}
                premium
                showFilter={showFilter}
                showApply={showApply}
                onRefineResultsCB={onRefineResultsCB}
                loc={loc}
                navigationItems={navigationItems}
                updateNavigation={updateNavigation}
                setShowHeader={setShowHeader}
                testTypesAllowed={TEST_TYPE_SURVEY}
              />
            )
          }}
        />
      </FeaturesSwitch>
    </ThemeProvider>
  )
}

export default withNamespaces('reports')(DataWarehouseReportsContainer)
