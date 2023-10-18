import React from 'react'

import { Tabs } from 'antd'
import PerformanceReport from './PerformanceReport'
import MasteryReportSection from './MasteryReportSection'
import { FilledTabBar } from './FilledTabBar'

const { TabPane } = Tabs

const PerformanceAndMastery = ({
  isAttendanceChartVisible,
  attendanceChartData,
  showInterventions,
  attendanceInterventions,
  tableData,
  isSharedReport,
  onCsvConvert,
  isCsvDownloading,
  studentMasteryProfile,
  SPRFFilterData,
  settings,
  chartData,
  selectedPerformanceBand,
  academicInterventions,
  history,
  location,
  filtersData,
  testTypes,
  externalScoreType,
  filters,
  setFilters,
  filterTagsData,
  setFilterTagsData,
  setSettings,
  toggleAttendanceChart,
  interventionsData,
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
          studentMasteryProfile={studentMasteryProfile}
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
    <Tabs renderTabBar={FilledTabBar} style={{ marginBlock: '32px' }}>
      {performanceAndMasteryTabs.map((item) => (
        <TabPane tab={item.label} key={item.key}>
          {item.children}
        </TabPane>
      ))}
    </Tabs>
  )
}

export default PerformanceAndMastery
