import React from 'react'
import { EduIf, EduThen, EduElse, FlexContainer } from '@edulastic/common'
import { isEmpty } from 'lodash'
import { IconInfo } from '@edulastic/icons'
import { blueButton } from '@edulastic/colors'
import { Checkbox } from 'antd'
import AttendanceChart from '../AttendanceChart'
import AssessmentsTable from '../AssessmentsTable'
import AssessmentsChart from '../AssessmentsChart'
import SectionLabelFilters from '../Filters/SectionLabelFilters'
import { ChartPreLabelWrapper } from '../../../../../common/components/charts/styled-components'
import { NoDataContainer } from '../../../../../common/styled'

const PerformanceReport = ({
  isAttendanceChartVisible,
  attendanceChartData,
  showInterventions,
  attendanceInterventions,
  tableData,
  isSharedReport,
  onCsvConvert,
  isCsvDownloading,
  chartData,
  selectedPerformanceBand,
  academicInterventions,
  settings,
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
  return (
    <>
      <EduIf condition={!isEmpty(chartData)}>
        <EduThen>
          <AssessmentsChart
            chartData={chartData}
            selectedPerformanceBand={selectedPerformanceBand}
            showInterventions={showInterventions}
            interventionsData={academicInterventions}
            settings={settings}
            sectionLabelFilters={
              <SectionLabelFilters
                history={history}
                location={location}
                isSharedReport={isSharedReport}
                filtersData={filtersData}
                testTypes={testTypes.join(',')}
                externalScoreType={externalScoreType}
                filters={filters}
                setFilters={setFilters}
                filterTagsData={filterTagsData}
                setFilterTagsData={setFilterTagsData}
                settings={settings}
                setSettings={setSettings}
              />
            }
            preLabelContent={
              <ChartPreLabelWrapper>
                <FlexContainer alignItems="center" justifyContent="flex-start">
                  <Checkbox
                    checked={isAttendanceChartVisible}
                    onChange={toggleAttendanceChart}
                  >
                    Show Attendance Chart
                  </Checkbox>
                  <EduIf condition={interventionsData?.length}>
                    <Checkbox
                      checked={showInterventions}
                      onChange={toggleInterventionInfo}
                    >
                      Show Interventions{' '}
                    </Checkbox>
                    <IconInfo fill={blueButton} width={16} height={16} />
                  </EduIf>
                </FlexContainer>
              </ChartPreLabelWrapper>
            }
          />
        </EduThen>
        <EduElse>
          <NoDataContainer margin="50px">
            No academic data available.
          </NoDataContainer>
        </EduElse>
      </EduIf>
      <EduIf condition={isAttendanceChartVisible}>
        <AttendanceChart
          attendanceChartData={attendanceChartData}
          showInterventions={showInterventions}
          interventionsData={attendanceInterventions}
        />
      </EduIf>
      <EduIf condition={!isEmpty(tableData)}>
        <AssessmentsTable
          tableData={tableData}
          isSharedReport={isSharedReport}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
        />
      </EduIf>
    </>
  )
}

export default PerformanceReport
