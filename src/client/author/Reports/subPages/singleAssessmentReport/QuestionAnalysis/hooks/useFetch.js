import { reportsApi } from '@edulastic/api'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import { pickDataForDetails, pickDataForSummary } from '../constants'

const {
  fetchQuestionAnalysisSummaryReport,
  fetchQuestionAnalysisPerformanceReport,
} = reportsApi

const timeout_100ms = 100
export const useQAnalysisSummaryFetch = ({
  settings,
  demographicFilters,
  toggleFilter,
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      try {
        setLoading(true)
        const params = {
          ...pick(settings.requestFilters, pickDataForSummary),
          ...demographicFilters,
          testId: settings.selectedTest.key,
        }

        fetchQuestionAnalysisSummaryReport(params).then((response) => {
          setData(response || {})
          setLoading(false)
          if (response?.metricInfo?.length) {
            toggleFilter(null, false)
          } else {
            toggleFilter(null, true)
          }
        })
      } catch (e) {
        setError(e)
        setLoading(false)
      }
    }
  }, [settings.selectedTest?.key, settings.requestFilters])

  return [data, loading, error]
}

export const useQAnalysisDetailsFetch = ({
  settings,
  demographicFilters,
  compareBy,
  sortOrder,
  pageNo,
  pageSize,
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = () => {
      if (settings.selectedTest && settings.selectedTest.key) {
        try {
          setLoading(true)
          const params = {
            ...pick(settings.requestFilters, pickDataForDetails),
            ...demographicFilters,
            compareBy,
            sortOrder: !sortOrder ? 'asc' : 'desc',
            page: pageNo,
            pageSize,
            testId: settings.selectedTest.key,
          }

          fetchQuestionAnalysisPerformanceReport(params).then((response) => {
            setData(response)
            setLoading(false)
          })
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
    sortOrder,
    compareBy,
    pageNo,
  ])
  return [data, loading, error]
}
