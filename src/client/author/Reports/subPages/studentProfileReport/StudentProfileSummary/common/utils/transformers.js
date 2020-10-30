import next from 'immer'
import {
  getMaxScale,
  getOverallMasteryCount,
} from '../../../common/utils/transformers'
import { percentage, getProficiencyBand } from '../../../../../common/util'

export const augmentDomainStandardMasteryData = (
  domains = [],
  scaleInfo = []
) => {
  const maxScale = getMaxScale(scaleInfo)
  return domains.map((domain) =>
    next(domain, (draftDomain) => {
      const { totalScoreSum, maxScoreSum } = domain.standards.reduce(
        (res, ele) => ({
          totalScoreSum: res.totalScoreSum + (Number(ele.totalScore) || 0),
          maxScoreSum: res.maxScoreSum + (Number(ele.maxScore) || 0),
        }),
        { totalScoreSum: 0, maxScoreSum: 0 }
      )
      const score = percentage(totalScoreSum, maxScoreSum)
      draftDomain.masteredCount = getOverallMasteryCount(
        domain.standards,
        maxScale
      )
      draftDomain.scale = getProficiencyBand(score, scaleInfo)
      draftDomain.score = score
    })
  )
}
