import { useMemo } from 'react'
import { augmentStandardMetaInfo, getDomains } from '../utils/transformers'

export const useGetStudentMasteryData = (
  metricInfo,
  skillInfo,
  scaleInfo,
  studentClassInfo = [],
  asessmentMetricInfo = []
) =>
  useMemo(() => {
    const standards = augmentStandardMetaInfo(metricInfo, skillInfo, scaleInfo)
    const domains = getDomains(
      standards,
      scaleInfo,
      studentClassInfo,
      asessmentMetricInfo
    )

    return [standards, domains]
  }, [metricInfo, skillInfo, scaleInfo])
