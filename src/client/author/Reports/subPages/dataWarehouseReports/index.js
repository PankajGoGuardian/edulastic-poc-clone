import React from 'react'
import { Route } from 'react-router-dom'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import WholeLearnerReport from './wholeLearnerReport'

import MultipleAssessmentReport from './MultipleAssessmentReport'
import Dashboard from './Dashboard'
import {
  DW_ATTENDANCE_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
} from '../../common/constants/dataWarehouseReports'
import AttendanceReport from './AttendanceSummary'
import GoalsAndInterventions from './GoalsAndInterventions'

const DataWarehouseReportsContainer = ({
  breadcrumbData,
  isCliUser,
  isPrinting,
  showApply,
  setShowApply,
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
        path={DW_GOALS_AND_INTERVENTIONS_URL}
        render={() => {
          setShowHeader(true)
          return (
            <GoalsAndInterventions
              {..._props}
              breadcrumbData={breadcrumbData}
              isCliUser={isCliUser}
            />
          )
        }}
      />
    </FeaturesSwitch>
  )
}

export default DataWarehouseReportsContainer
