import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row } from 'antd'
import { SpinLoader } from '@edulastic/common'
import { reportUtils } from '@edulastic/constants'

import { mapValues, isEmpty } from 'lodash'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import GroupedStackedBarChartContainer from './components/charts/groupedStackedBarChartContainer'
import PerformanceByRubricCriteriaTable from './components/table/performanceByRubricCriteriaTable'
import {
  getDenormalizedChartData,
  getTableData,
  getChartData,
} from './utils/transformers'

import { actions, selectors } from './ducks'
import { getCsvDownloadingState } from '../../../ducks'
import dropDownData from './static/dropDownData.json'

const { compareByData, analyseByData } = dropDownData

const { downloadCSV } = reportUtils.common

const onCsvConvert = (data) =>
  downloadCSV(
    `Performance by Rubrics Criteria - Standard Mastery Report.csv`,
    data
  )

const PerformanceByRubricCriteria = ({
  userRole,
  location,
  settings,
  isCsvDownloading,
  // selectors from ducks selectors
  reportChartData,
  loadingReportChartData,
  reportTableData,
  loadingReportTableData,
  // actions from ducks actions
  fetchReportChartDataRequest,
  fetchReportTableDataRequest,
}) => {
  const compareByDataFiltered = compareByData.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const [tableFilters, setTableFilters] = useState({
    compareBy:
      compareByDataFiltered.find(
        (o) => o.key === location?.state?.compareByKey
      ) || compareByDataFiltered[0],
    analyseBy: analyseByData[0],
  })

  useEffect(() => {
    const q = { ...settings.requestFilters }
    if ((q.termId && q.rubricId) || q.reportId) {
      fetchReportChartDataRequest(q)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: tableFilters.compareBy.key,
    }
    if (((q.termId && q.rubricId) || q.reportId) && q.compareBy) {
      fetchReportTableDataRequest(q)
    }
  }, [settings.requestFilters, tableFilters.compareBy])

  const chartData = useMemo(() => getDenormalizedChartData(reportChartData), [
    reportChartData,
  ])
  const { barsData, renderData } = useMemo(() => getChartData(chartData), [
    chartData,
  ])

  const tableData = useMemo(
    () => getTableData(reportTableData, reportChartData),
    [reportTableData, reportChartData]
  )

  if (loadingReportChartData || loadingReportTableData) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (isEmpty(chartData)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <>
      <StyledCard>
        <Row type="flex" justify="start">
          <StyledH3 style={{ fontSize: '20px' }}>
            Performance by Rubric criteria
          </StyledH3>
        </Row>
        <Row>
          <span>
            This report shows the response distribution across ratings for each
            criterion of a rubric.
            <br />
            Hover over the chart to learn more about the rating.
          </span>
        </Row>
      </StyledCard>
      <Row>
        <GroupedStackedBarChartContainer
          barsData={barsData}
          renderData={renderData}
        />
        <PerformanceByRubricCriteriaTable
          tableData={tableData}
          selectedTableFilters={tableFilters}
          setTableFilters={setTableFilters}
          tableFilterOptions={{
            compareByData: compareByDataFiltered,
            analyseByData,
          }}
          rubric={reportChartData.rubric}
          chartRenderData={renderData}
          onCsvConvert={onCsvConvert}
          isCsvDownloading={isCsvDownloading}
        />
      </Row>
    </>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      ...mapValues(selectors, (selector) => selector(state)),
      isCsvDownloading: getCsvDownloadingState(state),
    }),
    {
      ...actions,
    }
  )
)

export default enhance(PerformanceByRubricCriteria)
