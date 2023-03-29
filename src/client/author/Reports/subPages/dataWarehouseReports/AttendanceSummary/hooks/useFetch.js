import { reportsApi } from '@edulastic/api'
import { useEffect, useState } from 'react'
import { sortOrderMap } from '../utils/constants'

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
  pageNo = 1,
  pageSize = 25,
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
          sortKey: sortKey || '',
          sortOrder: sortOrderMap[sortOrder] || '',
          pageNo,
          pageSize,
          recompute: true,
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
  }, [settings.requestFilters, compareBy, pageNo, pageSize, sortKey, sortOrder])
  return [data, totalRows, loading, error]
}

export const useAttendanceSummaryFetch = ({ settings, groupBy }) => {
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

export const useAttendanceDistributionFetch = (settings) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      if (settings.requestFilters && settings.requestFilters.termId) {
        setLoading(true)
        const params = {
          ...settings.requestFilters,
        }
        fetchAttendanceDistributionReport(params)
          .then((response) => {
            setData(response || [])
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
  }, [settings.requestFilters])

  return [data, loading, error]
}
