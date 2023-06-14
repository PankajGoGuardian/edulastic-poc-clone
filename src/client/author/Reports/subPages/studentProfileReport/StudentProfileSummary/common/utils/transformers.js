import next from 'immer'
import {
  getMaxScale,
  getOverallMasteryCount,
} from '../../../common/utils/transformers'
import { percentage, getProficiencyBand } from '../../../../../common/util'

export const filterData = (data, domain, grade, subject, curriculumId) =>
  data.filter(
    (record) =>
      (domain === 'All' || String(record.domainId) === String(domain)) &&
      (grade === 'All' || record.grades.includes(grade)) &&
      (subject === 'All' || record.subject === subject) &&
      (curriculumId === 'All' || `${record.curriculumId}` === curriculumId)
  )

export const augmentDomainStandardMasteryData = (
  domains = [],
  scaleInfo = [],
  domain,
  grade,
  subject,
  curriculumId
) => {
  const maxScale = getMaxScale(scaleInfo)
  return filterData(domains, domain, grade, subject, curriculumId).map(
    (record) =>
      next(record, (draftDomain) => {
        const { totalScoreSum, maxScoreSum } = record.standards.reduce(
          (res, ele) => ({
            totalScoreSum: res.totalScoreSum + (Number(ele.totalScore) || 0),
            maxScoreSum: res.maxScoreSum + (Number(ele.maxScore) || 0),
          }),
          { totalScoreSum: 0, maxScoreSum: 0 }
        )
        const score = percentage(totalScoreSum, maxScoreSum)
        draftDomain.masteredCount = getOverallMasteryCount(
          record.standards,
          maxScale
        )
        draftDomain.scale = getProficiencyBand(score, scaleInfo)
        draftDomain.score = score
      })
  )
}
