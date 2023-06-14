import { reportsApi } from '@edulastic/api'
import { isEmpty, pick } from 'lodash'
import { useEffect, useState } from 'react'
import {
  pickDataForDetails,
  pickDataForSummary,
  sortOrderMap,
} from '../constants'

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
          const params = {
            requestFilters: {
              ...pick(settings.requestFilters, pickDataForSummary),
              ...demographicFilters,
              profileId: settings?.requestFilters?.standardsProficiencyProfile,
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
  recompute,
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalRows, setTotalRows] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      if (settings.selectedTest && settings.selectedTest.key) {
        try {
          setLoading(true)
          const params = {
            requestFilters: {
              ...pick(settings.requestFilters, pickDataForDetails),
              ...demographicFilters,
              compareBy,
              sortKey,
              sortOrder: sortOrderMap[sortOrder],
              page,
              pageSize,
              recompute,
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
  }, [
    settings.selectedTest?.key,
    settings.requestFilters,
    demographicFilters,
    sortOrder,
    sortKey,
    compareBy,
    page,
  ])
  return [data, loading, error]
}
