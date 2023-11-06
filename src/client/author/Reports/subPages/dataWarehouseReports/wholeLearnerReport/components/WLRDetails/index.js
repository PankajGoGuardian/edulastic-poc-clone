import React from 'react'

import { Tabs } from 'antd'
import PerformanceReport from './PerformanceReport'
import MasteryReportSection from './MasteryReportSection'
import { FilledTabBar } from './FilledTabBar'

const { TabPane } = Tabs

const WLRDetails = ({
  isAttendanceChartVisible,
  attendanceChartData,
  showInterventions, // bool: show interventions in performance report
  attendanceInterventions, // array: interventions for attendance chart
  tableData, // array: table data for performance report
  isSharedReport, // bool: is shared report
  onCsvConvert,
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
  selectedMasteryScale,
  setSelectedMasteryScale,
  loadingMasteryData,
}) => {
  const performanceAndMasteryTabs = [
    {
      key: 'performance',
      label: 'Performance',
      children: (
        <PerformanceReport
          isAttendanceChartVisible={isAttendanceChartVisible}
          attendanceChartData={attendanceChartData}
          showInterventions={showInterventions}
          attendanceInterventions={attendanceInterventions}
          tableData={tableData}
          isSharedReport={isSharedReport}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
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
        />
      ),
    },
    {
      key: 'mastery',
      label: 'Mastery',
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
  ]

  return (
    <Tabs
      renderTabBar={FilledTabBar}
      style={{ marginBlock: '32px', overflow: 'visible' }} // to allow tooltips tabPanel to overflow. No side-effect as panel cover full page width.
    >
      {performanceAndMasteryTabs.map((item) => (
        <TabPane tab={item.label} key={item.key}>
          {item.children}
        </TabPane>
      ))}
    </Tabs>
  )
}

export default WLRDetails
