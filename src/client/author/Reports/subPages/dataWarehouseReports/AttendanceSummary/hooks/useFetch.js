import { reportsApi } from '@edulastic/api'
import { useEffect, useState } from 'react'
import {
  pageSize as defaultPageSize,
  sortKeys,
  sortOrderMap,
} from '../utils/constants'

const {
  fetchAttendanceReportDetails,
  fetchAttendanceSummaryReport,
  fetchAttendanceDistributionReport,
} = reportsApi

const timeout_100ms = 100

export const useAttendanceDetailsFetch = ({
  settings,
  compareBy,
  sortOrder,
  sortKey,
  page = 1,
  pageSize = defaultPageSize,
  profileId,
}) => {
  const [data, setData] = useState([])
  const [totalRows, setTotalRows] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      if (settings.requestFilters && settings.requestFilters.termId) {
        setLoading(true)
        const params = {
          ...settings.requestFilters,
          compareBy,
          sortKey: sortOrder ? sortKey : sortKeys.ATTENDANCE,
          sortOrder: sortOrderMap[sortOrder] || sortOrderMap.ascend,
          page,
          pageSize,
          recompute: true,
          profileId,
        }
        fetchAttendanceReportDetails(params)
          .then((response) => {
            setData(response.metrics)
            setTotalRows(response.totalRows)
            setLoading(false)
          })
          .catch((e) => {
            setError(e)
            setLoading(false)
          })
      }
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [
    settings.requestFilters,
    compareBy,
    page,
    pageSize,
    sortKey,
    sortOrder,
    profileId,
  ])
  return [data, totalRows, loading, error]
}

export const useAttendanceSummaryFetch = ({
  settings,
  groupBy,
  toggleFilter,
}) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      if (settings.requestFilters && settings.requestFilters.termId) {
        setLoading(true)
        const params = {
          ...settings.requestFilters,
          groupBy,
        }
        fetchAttendanceSummaryReport(params)
          .then((response) => {
            setData(response || [])
            setLoading(false)
            if (response?.length) {
              toggleFilter({}, false)
            } else {
              toggleFilter({}, true)
            }
          })
          .catch((e) => {
            setError(e)
            setLoading(false)
          })
      }
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [settings.requestFilters, groupBy])

  return [data, loading, error]
}

export const useAttendanceDistributionFetch = (settings, profileId) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      if (settings.requestFilters && settings.requestFilters.termId) {
        setLoading(true)
        const params = {
          ...settings.requestFilters,
          profileId,
        }
        fetchAttendanceDistributionReport(params)
          .then((response) => {
            setData(response.metrics || [])
            setLoading(false)
          })
          .catch((e) => {
            setError(e)
            setLoading(false)
          })
      }
    }
    const timeout = setTimeout(fetchData, timeout_100ms)
    return () => {
      clearTimeout(timeout)
    }
  }, [settings.requestFilters, profileId])

  return [data, loading, error]
}
