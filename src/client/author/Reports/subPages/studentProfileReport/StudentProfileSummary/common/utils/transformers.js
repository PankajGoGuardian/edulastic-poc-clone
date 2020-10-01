import next from 'immer'
import { map, sumBy } from 'lodash'
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
  return map(domains, (domain) => {
    return next(domain, (draftDomain) => {
      const score = percentage(
        sumBy(domain.standards, 'totalScore'),
        sumBy(domain.standards, 'maxScore')
      )
      draftDomain.masteredCount = getOverallMasteryCount(
        domain.standards,
        maxScale
      )
      draftDomain.scale = getProficiencyBand(score, scaleInfo)
      draftDomain.score = score
    })
  })
}
