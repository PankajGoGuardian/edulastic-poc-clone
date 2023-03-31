import { useCallback, useMemo, useState } from 'react'

/**
 *
 * @template T
 * @param {{
 * 	defaultPage?: Number;
 *  pageSize?: Number;
 * 	data: T[];
 * 	lookbackCount?: Number;
 * 	lookaheadCount?: Number;
 *  backFillLastPage?: Boolean;
 *  startFromLastPage?: Boolean;
 * }} options
 * @returns {{
 * 	page: Number;
 * 	prev: () => void;
 * 	next: () => void;
 * 	pagedData: T[];
 * 	setPage: (newPage: Number | (curPage: Number) => Number) => void;
 *  totalPages: Number;
 * }}
 */
function useOfflinePagination(options = {}) {
  const {
    pageSize = 8,
    data,
    lookbackCount = 0,
    lookaheadCount = 0,
    backFillLastPage = false,
    startFromLastPage = false,
  } = options
  let { defaultPage = 0 } = options
  const totalPages = Math.ceil(data.length / pageSize)
  if (startFromLastPage) defaultPage = totalPages - 1

  const [page, _setPage] = useState(defaultPage)

  const setPage = useCallback(
    (newPage) => {
      _setPage((curPage) => {
        newPage = typeof newPage === 'function' ? newPage(curPage) : newPage
        return Math.max(0, Math.min(newPage, totalPages - 1))
      })
    },
    [_setPage, totalPages]
  )

  const prev = useCallback(() => {
    setPage((curPage) => curPage - 1)
  }, [setPage])

  const next = useCallback(() => {
    setPage((curPage) => curPage + 1)
  }, [setPage])

  const activeView = useMemo(() => {
    const pageOffset = page * pageSize
    let viewStart = Math.max(0, pageOffset - lookbackCount)
    const viewEnd = Math.min(
      data.length,
      pageOffset + pageSize + lookaheadCount
    )
    if (backFillLastPage && viewEnd === data.length) {
      const pageEnd = Math.min(data.length, pageOffset + pageSize)
      viewStart = Math.max(0, pageEnd - pageSize - lookbackCount)
    }
    return data.slice(viewStart, viewEnd)
  }, [data, page, lookbackCount, lookaheadCount, pageSize])

  return {
    page,
    prev,
    next,
    pagedData: activeView,
    setPage,
    totalPages,
  }
}

export default useOfflinePagination
