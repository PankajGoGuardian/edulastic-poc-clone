import { reportsApi } from '@edulastic/api'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import {
  pickDataForDetails,
  pickDataForSummary,
  sortOrderMap,
} from '../constants'

const {
  fetchPerformanceByStudentsDetails,
  fetchPerformanceByStudentsSummary,
} = reportsApi

const timeout_100ms = 100
export const usePerformanceByStudentsSummaryFetch = ({
  settings,
  demographicFilters,
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      if (settings.selectedTest && settings.selectedTest.key) {
        try {
          setError(null)
          setLoading(true)
          const params = {
            requestFilters: {
              ...pick(settings.requestFilters, pickDataForSummary),
              ...demographicFilters,
              profileId: settings.requestFilters?.performanceBandProfile,
            },
            testId: settings.selectedTest.key,
          }

          const response = await fetchPerformanceByStudentsSummary(params)
          setData(response?.data?.result || {})
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
  }, [settings.selectedTest?.key, settings.requestFilters, demographicFilters])

  return [data, loading, error]
}

export const usePerformanceByStudentsDetailsFetch = ({
  settings,
  demographicFilters,
  sortKey,
  sortOrder,
  page,
  pageSize,
  selectedProficiency,
  range,
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
    selectedProficiency?.threshold,
  ])

  useEffect(() => {
    const fetchData = async () => {
      if (settings.selectedTest && settings.selectedTest.key) {
        try {
          setError(null)
          setLoading(true)
          const params = {
            requestFilters: {
              ...pick(settings.requestFilters, pickDataForDetails),
              ...demographicFilters,
              profileId: settings.requestFilters?.performanceBandProfile,
              bandThreshold: selectedProficiency?.threshold,
              range,
              sortKey,
              sortOrder: sortOrderMap[sortOrder],
              page,
              pageSize,
              requireRowsCount: !totalRows && page === 2,
            },
            testId: settings.selectedTest.key,
          }

          const response = await fetchPerformanceByStudentsDetails(params)
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
    selectedProficiency,
    range,
    page,
  ])
  return [data, loading, error]
}
