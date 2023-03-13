import { reportsApi } from '@edulastic/api'
import { pick } from 'lodash'
import { useEffect, useState } from 'react'
import { pickDataForDetails, pickDataForSummary } from '../constants'

export const useQAnalysisSummaryFetch = ({
  settings,
  demographicFilters,
  toggleFilter,
  sortOrder,
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      try {
        setLoading(true)
        const q = {
          requestFilters: {
            ...settings.requestFilters,
            ...demographicFilters,
          },
          testId: settings.selectedTest.key,
        }
        reportsApi
          .fetchQuestionAnalysisSummaryReport({
            ...q,
            requestFilters: {
              ...pick(q.requestFilters, pickDataForSummary),
            },
          })
          .then((response) => {
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
  }, [settings.selectedTest?.key, settings.requestFilters, sortOrder])

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
    if (settings.selectedTest && settings.selectedTest.key) {
      try {
        setLoading(true)
        const q = {
          requestFilters: {
            ...settings.requestFilters,
            ...demographicFilters,
            compareBy,
            sortOrder: !sortOrder ? 'asc' : 'desc',
            page: pageNo,
            pageSize,
          },
          testId: settings.selectedTest.key,
        }
        reportsApi
          .fetchQuestionAnalysisPerformanceReport({
            ...q,
            requestFilters: {
              ...pick(q.requestFilters, pickDataForDetails),
            },
          })
          .then((response) => {
            setData(response)
            setLoading(false)
          })
      } catch (e) {
        setError(e)
        setLoading(false)
      }
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
