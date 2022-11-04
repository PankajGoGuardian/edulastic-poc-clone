import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row } from 'antd'
import { SpinLoader } from '@edulastic/common'

import { mapValues, isEmpty } from 'lodash'
import { StyledCard, StyledH3, NoDataContainer } from '../../../common/styled'
import GroupedStackedBarChartContainer from './components/charts/groupedStackedBarChartContainer'
import PerformanceByRubricCriteriaTable from './components/table/performanceByRubricCriteriaTable'
import {
  getDenormalizedChartData,
  getDenormalizedTableData,
} from './utils/transformers'

import { actions, selectors } from './ducks'
import dropDownData from './static/dropDownData.json'

const { compareByData, analyseByData } = dropDownData

const PerformanceByRubricCriteria = ({
  userRole,
  location,
  settings,
  toggleFilter,
  breadcrumbData,
  isCliUser,
  // selectors from ducks selectors
  reportChartData,
  loadingReportChartData,
  reportTableData,
  loadingReportTableData,
  error,
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
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      settings.requestFilters.rubricId
    ) {
      fetchReportChartDataRequest(q)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      compareBy: tableFilters.compareBy.key,
    }
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      settings.requestFilters.rubricId &&
      tableFilters.compareBy.key
    ) {
      fetchReportTableDataRequest(q)
    }
  }, [settings.requestFilters, tableFilters.compareBy])

  const chartData = useMemo(() => getDenormalizedChartData(reportChartData), [
    reportChartData,
  ])

  const tableData = useMemo(
    () => getDenormalizedTableData(reportTableData, reportChartData.rubric),
    [reportTableData, reportChartData.rubric]
  )

  if (loadingReportChartData || loadingReportTableData) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }
  // || isEmpty(reportTableData)
  if (isEmpty(reportChartData.data)) {
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
          <StyledH3 margin="0 0 10px 50px">
            Performance by Rubric criteria
          </StyledH3>
        </Row>
      </StyledCard>
      <Row>
        <GroupedStackedBarChartContainer data={chartData} />
        {/* <PerformanceByRubricCriteriaTable
          tableData={tableData}
          selectedTableFilters={tableFilters}
          setTableFilters={setTableFilters}
          tableFilterOptions={{
            compareByData: compareByDataFiltered,
            analyseByData,
          }}
        /> */}
      </Row>
    </>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      ...mapValues(selectors, (selector) => selector(state)),
    }),
    {
      ...actions,
    }
  )
)

export default enhance(PerformanceByRubricCriteria)
