import { sortBy, sortedUniqBy, filter } from 'lodash'

export const getDomains = (domains) =>
  sortedUniqBy(
    sortBy(
      filter(domains, (item) => item.tloId),
      'tloId'
    ),
    'tloId'
  )
