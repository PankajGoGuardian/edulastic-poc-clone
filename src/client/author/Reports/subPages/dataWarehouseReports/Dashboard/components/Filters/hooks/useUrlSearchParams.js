import { isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import { useMemo } from 'react'

function useUrlSearchParams(location) {
  return useMemo(
    () =>
      pickBy(
        qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
        (f) => !['All', 'all'].includes(f) && !isEmpty(f)
      ),
    [location.search]
  )
}

export default useUrlSearchParams
