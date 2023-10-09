import React from 'react'

import { Tabs } from 'antd'
import PerformanceReport from './PerformanceReport'
import MasteryReport from './MasteryReport'

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
}) => {
  const performanceAndMasteryTabs = [
    {
      key: 'performance',
      label: 'Performance',
      children: (
        <>
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
        </>
      ),
    },
    {
      key: 'mastery',
      label: 'Mastery',
      children: (
        <>
          <MasteryReport
            studentMasteryProfile={studentMasteryProfile}
            SPRFFilterData={SPRFFilterData}
            settings={settings}
          />
        </>
      ),
    },
  ]

  return (
    <Tabs centered>
      {performanceAndMasteryTabs.map((item) => (
        <TabPane tab={item.label} key={item.key}>
          {item.children}
        </TabPane>
      ))}
    </Tabs>
  )
}

export default PerformanceAndMastery
