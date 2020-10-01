import { map } from 'lodash'
import gradesMap from '../../../common/static/json/gradesMap.json'

export const getDomainOptions = (domains) => {
  return [
    { key: 'All', title: 'All' },
    ...map(domains, (domain) => ({
      key: domain.domainId,
      title: domain.name,
    })),
  ]
}
