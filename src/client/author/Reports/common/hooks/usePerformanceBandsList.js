import { isEmpty } from 'lodash'
import { useState, useMemo } from 'react'

const usePerformanceBandsList = (bandInfo) => {
  const [performanceBandsListToUse, setPerformanceBandsListToUse] = useState([])

  const [performanceBandsList, defaultPerformanceBandsList] = useMemo(() => {
    const _defaultPerformanceBandsList = bandInfo.map((p) => ({
      key: p._id,
      title: p.name,
    }))
    const _performanceBandsList = !isEmpty(performanceBandsListToUse)
      ? performanceBandsListToUse
      : _defaultPerformanceBandsList
    return [_performanceBandsList, _defaultPerformanceBandsList]
  }, [bandInfo, performanceBandsListToUse])
  return [
    performanceBandsList,
    defaultPerformanceBandsList,
    setPerformanceBandsListToUse,
  ]
}

export default usePerformanceBandsList
