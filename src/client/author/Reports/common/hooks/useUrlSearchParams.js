import { isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import { useMemo } from 'react'
import { allFilterValue } from '../constants'

function useUrlSearchParams(location) {
  return useMemo(
    () =>
      pickBy(
        qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
        (f) => allFilterValue !== f?.toLowerCase() && !isEmpty(f)
      ),
    [location.search]
  )
}

export default useUrlSearchParams
