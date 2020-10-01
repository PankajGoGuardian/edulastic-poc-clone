import { useMemo } from 'react'
import { parseTrendData } from '../../common/utils/trend'
import { augmentWithBand, augmentWithStudentInfo } from '../utils/transformers'

export const useGetBandData = (
  metricInfo,
  compareByKey,
  orgData,
  selectedTrend,
  bandInfo
) => {
  return useMemo(() => {
    const [parsedData, trendCount] = parseTrendData(
      metricInfo,
      compareByKey,
      orgData,
      selectedTrend
    )
    const dataWithBand = augmentWithBand(parsedData, bandInfo)
    const dataWithStudentInfo = augmentWithStudentInfo(dataWithBand, orgData)

    return [dataWithStudentInfo, trendCount]
  }, [metricInfo, compareByKey, orgData, selectedTrend, bandInfo])
}
