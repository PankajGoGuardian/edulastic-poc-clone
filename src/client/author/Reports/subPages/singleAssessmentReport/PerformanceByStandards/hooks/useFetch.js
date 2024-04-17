import { reportsApi } from '@edulastic/api'
import {
  analyzeByMode,
  sortKeysMap,
} from '@edulastic/constants/reportUtils/singleAssessmentReport/performanceByStandards'
import { isEmpty, pick } from 'lodash'
import { useEffect, useState } from 'react'
import { tableToDBSortOrderMap } from '@edulastic/constants/reportUtils/common'
import { pickDataForDetails, pickDataForSummary } from '../constants'

const {
  fetchPerformanceByStandardDetails,
  fetchPerformanceByStandardSummary,
} = reportsApi

const timeout_100ms = 100
export const usePerformanceByStandardSummaryFetch = ({
  settings,
  demographicFilters,
  toggleFilter,
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      if (settings.selectedTest && settings.selectedTest.key) {
        try {
          setLoading(true)
          setError(null)
          const params = {
            requestFilters: {
              ...pick(settings.requestFilters, pickDataForSummary),
              ...demographicFilters,
            },
            testId: settings.selectedTest.key,
          }

          const response = await fetchPerformanceByStandardSummary(params)
          setData(response?.data?.result || {})
          setLoading(false)
          if (isEmpty(data?.performanceSummaryStats?.length)) {
            toggleFilter(null, false)
          } else {
            toggleFilter(null, true)
          }
        } catch (e) {
          setError(e)
          setLoading(false)
        }
      }
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [settings.selectedTest?.key, settings.requestFilters, demographicFilters])

  return [data, loading, error]
}

export const usePerformanceByStandardDetailsFetch = ({
  settings,
  demographicFilters,
  compareBy,
  sortKey,
  sortOrder,
  page,
  pageSize,
  viewBy,
  analyzeBy,
  setViewOrAnalzeByState,
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalRows, setTotalRows] = useState(0)

  useEffect(() => {
    setTotalRows(0)
  }, [
    settings.selectedTest?.key,
    settings.requestFilters,
    demographicFilters,
    compareBy,
  ])

  useEffect(() => {
    const fetchData = async () => {
      if (settings.selectedTest && settings.selectedTest.key) {
        try {
          setLoading(true)
          setError(null)
          const sortKeyValue =
            sortKey === sortKeysMap.overall &&
            analyzeBy === analyzeByMode.RAW_SCORE
              ? 'score'
              : sortKey
          const params = {
            requestFilters: {
              ...pick(settings.requestFilters, pickDataForDetails),
              ...demographicFilters,
              compareBy,
              sortKey: sortKeyValue,
              sortOrder: tableToDBSortOrderMap[sortOrder],
              page,
              pageSize,
              requireRowsCount: !totalRows && page === 2,
              viewBy,
              analyzeBy,
            },
            testId: settings.selectedTest.key,
          }

          const response = await fetchPerformanceByStandardDetails(params)
          const result = response?.data?.result || {}
          if (result?.totalRows) {
            setTotalRows(result.totalRows)
          } else {
            result.totalRows = totalRows
          }
          setData(result)
          setLoading(false)
          setViewOrAnalzeByState((prevState) => ({
            ...prevState,
            isViewOrAnalyzeByChanged: false,
          }))
        } catch (e) {
          setError(e)
          setLoading(false)
          setViewOrAnalzeByState((prevState) => ({
            ...prevState,
            isViewOrAnalyzeByChanged: false,
          }))
        }
      }
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [
    settings.selectedTest?.key,
    settings.requestFilters,
    demographicFilters,
    sortOrder,
    sortKey,
    compareBy,
    page,
    viewBy,
    analyzeBy,
  ])
  return [data, loading, error]
}
