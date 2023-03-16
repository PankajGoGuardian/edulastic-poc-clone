import React from 'react'
import { Route } from 'react-router-dom'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import WholeLearnerReport from './wholeLearnerReport'

import MultipleAssessmentReport from './MultipleAssessmentReport'
import {
  DW_ATTENDANCE_REPORT_URL,
  DW_DASHBOARD_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_EFFICACY_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
  DW_SURVEY_INSIGHTS_URL,
} from '../../common/constants/dataWarehouseReports'
import DashboardReport from './DashboardReport'
import AttendanceSummaryReport from './AttendanceSummaryReport'
import EfficacyReport from './EfficacyReport'
import EarlyWarningReport from './EarlyWarningReport'
import SurveyInsightsReport from './SurveyInsightsReport'
import GoalsAndInterventionsReport from './GoalsAndInterventionsReport'

const DataWarehouseReportsContainer = ({
  breadcrumbData,
  isCliUser,
  isPrinting,
  showApply,
  showFilter,
  onRefineResultsCB,
  loc,
  updateNavigation,
  setShowHeader,
  ..._props
}) => {
  return (
    <FeaturesSwitch
      inputFeatures="dataWarehouseReports"
      actionOnInaccessible="hidden"
    >
      <Route
        exact
        path={DW_DASHBOARD_REPORT_URL}
        render={() => {
          setShowHeader(true)
          return (
            <DashboardReport
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
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
        path={`${DW_WLR_REPORT_URL}:studentId?`}
        render={() => {
          setShowHeader(true)
          return (
            <WholeLearnerReport
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
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
        path={DW_ATTENDANCE_REPORT_URL}
        render={() => {
          setShowHeader(true)
          return (
            <AttendanceSummaryReport
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
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
        path={DW_SURVEY_INSIGHTS_URL}
        render={() => {
          setShowHeader(true)
          return (
            <SurveyInsightsReport
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
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
        path={DW_GOALS_AND_INTERVENTIONS_URL}
        render={() => {
          setShowHeader(true)
          return (
            <GoalsAndInterventionsReport
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
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
        path={DW_EFFICACY_REPORT_URL}
        render={() => {
          setShowHeader(true)
          return (
            <EfficacyReport
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
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
        path={DW_EARLY_WARNING_REPORT_URL}
        render={() => {
          setShowHeader(true)
          return (
            <EarlyWarningReport
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
              showApply={showApply}
              showFilter={showFilter}
              onRefineResultsCB={onRefineResultsCB}
              loc={loc}
              updateNavigation={updateNavigation}
            />
          )
        }}
      />
    </FeaturesSwitch>
  )
}

export default DataWarehouseReportsContainer
