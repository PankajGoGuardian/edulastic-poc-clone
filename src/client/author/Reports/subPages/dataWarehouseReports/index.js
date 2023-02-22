import React from 'react'
import { Route } from 'react-router-dom'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import WholeLearnerReport from './wholeLearnerReport'

import MultipleAssessmentReport from './MultipleAssessmentReport'
import {
  DW_ATTENDANCE_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
} from '../../common/constants/dataWarehouseReports'
import AttendanceReport from './AttendanceSummary'

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
          // setTimeout(() => setShowHeader(true), 0)
          setShowHeader(true)
          return (
            <AttendanceReport
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
    </FeaturesSwitch>
  )
}

export default DataWarehouseReportsContainer
