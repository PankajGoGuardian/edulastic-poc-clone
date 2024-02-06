import React, { useCallback, useState } from 'react'
import { Tabs } from 'antd'

import { segmentApi } from '@edulastic/api'

import PerformanceReport from './PerformanceReport'
import MasteryReportSection from './MasteryReportSection'
import { FilledTabBar } from './FilledTabBar'
import { Tutoring } from './Tutoring'
import { getStudentName } from '../../utils'

const { TabPane } = Tabs

const TABLE_TABS = {
  PERFORMANCE: {
    key: 'performance',
    label: 'Performance',
  },
  MASTERY: {
    key: 'mastery',
    label: 'Standards Mastery',
  },
  TUTORING: {
    key: 'tutoring',
    label: 'Tutoring',
  },
}

const WLRDetails = ({
  isPrinting,
  isAttendanceChartVisible,
  attendanceChartData,
  showInterventions, // bool: show interventions in performance report
  attendanceInterventions, // array: interventions for attendance chart
  tableData, // array: table data for performance report
  isSharedReport, // bool: is shared report
  downloadCSV,
  isCsvDownloading,
  studentMasteryProfile, // data for mastery report table
  SPRFFilterData, // Student Profile Report Filter Data - contains Standard Proficiency
  settings, // WL report settings
  chartData, // data for performance report chart
  selectedPerformanceBand,
  academicInterventions,
  history, // react router history
  location, // react router location
  filtersData, // WLR filters' metadata (required to populate filter dropdowns)
  testTypes, // test types from WLR filters
  externalScoreType,
  filters, // WLR filters
  setFilters,
  filterTagsData,
  setFilterTagsData,
  setSettings,
  toggleAttendanceChart,
  interventionsData, // interventions data for performance report
  toggleInterventionInfo,
  isMultiSchoolYear,
  selectedMasteryScale,
  setSelectedMasteryScale,
  loadingMasteryData,
  tutorMeInterventionsData,
  tutorMeInterventionsLoading,
  tutorMeInterventionsError,
}) => {
  const [tableTabKey, setTableTabKey] = useState(TABLE_TABS.PERFORMANCE.key)

  const studentName = getStudentName(
    settings.selectedStudentInformation,
    settings.selectedStudent
  )

  const tableTabs = [
    {
      key: TABLE_TABS.PERFORMANCE.key,
      label: TABLE_TABS.PERFORMANCE.label,
      children: (
        <PerformanceReport
          isPrinting={isPrinting}
          isAttendanceChartVisible={isAttendanceChartVisible}
          attendanceChartData={attendanceChartData}
          showInterventions={showInterventions}
          attendanceInterventions={attendanceInterventions}
          tableData={tableData}
          isSharedReport={isSharedReport}
          onCsvConvert={(data) =>
            downloadCSV(`Whole Learner Report - ${studentName}.csv`, data)
          }
          isCsvDownloading={
            tableTabKey === TABLE_TABS.PERFORMANCE.key && isCsvDownloading
          }
          SPRFFilterData={SPRFFilterData}
          settings={settings}
          chartData={chartData}
          selectedPerformanceBand={selectedPerformanceBand}
          academicInterventions={academicInterventions}
          history={history}
          location={location}
          filtersData={filtersData}
          testTypes={testTypes}
          externalScoreType={externalScoreType}
          filters={filters}
          setFilters={setFilters}
          filterTagsData={filterTagsData}
          setFilterTagsData={setFilterTagsData}
          setSettings={setSettings}
          toggleAttendanceChart={toggleAttendanceChart}
          interventionsData={interventionsData}
          toggleInterventionInfo={toggleInterventionInfo}
          isMultiSchoolYear={isMultiSchoolYear}
        />
      ),
    },
    {
      key: TABLE_TABS.MASTERY.key,
      label: TABLE_TABS.MASTERY.label,
      children: (
        <MasteryReportSection
          studentMasteryProfile={studentMasteryProfile}
          SPRFFilterData={SPRFFilterData}
          settings={settings}
          selectedScale={selectedMasteryScale}
          setSelectedScale={setSelectedMasteryScale}
          loading={loadingMasteryData}
        />
      ),
    },
    {
      key: TABLE_TABS.TUTORING.key,
      label: TABLE_TABS.TUTORING.label,
      hidden: tutorMeInterventionsData?.length === 0, // hide tab if no data, including loading state
      children: (
        <Tutoring
          data={tutorMeInterventionsData}
          loading={tutorMeInterventionsLoading}
          error={tutorMeInterventionsError}
          onCsvConvert={(data) =>
            downloadCSV(
              `Whole Learner Report - ${studentName} - Tutoring.csv`,
              data
            )
          }
          isCsvDownloading={
            tableTabKey === TABLE_TABS.TUTORING.key && isCsvDownloading
          }
          isSharedReport={isSharedReport}
        />
      ),
    },
  ].filter((item) => !item.hidden)

  const onTabClick = useCallback(
    (key) => {
      setTableTabKey(key)
      if (key === TABLE_TABS.TUTORING.key) {
        // segment api to track click event on Whole Learner Report's Tutoring tab
        segmentApi.genericEventTrack('Whole Learner: Tutoring Tab', {
          selectedStudentsKeys: [settings.selectedStudent.key],
        })
      }
    },
    [settings.selectedStudent.key]
  )

  return (
    <Tabs
      renderTabBar={FilledTabBar}
      onTabClick={onTabClick}
      activeKey={tableTabKey}
      style={{ marginBlock: '32px', overflow: 'visible' }} // to allow tooltips tabPanel to overflow. No side-effect as panel cover full page width.
    >
      {tableTabs.map((item) => (
        <TabPane tab={item.label} key={item.key}>
          {item.children}
        </TabPane>
      ))}
    </Tabs>
  )
}

export default WLRDetails
