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
    defaultPage = 0,
    pageSize = 8,
    data,
    lookbackCount = 0,
    lookaheadCount = 0,
    backFillLastPage = false,
  } = options
  const totalPages = Math.ceil(data.length / pageSize)
  let defaultPageToUse = Math.min(defaultPage, totalPages - 1)

  if (defaultPage < 0) {
    defaultPageToUse = Math.max(0, totalPages + defaultPage) // (totalPages + defaultPage) -> equivalent to (totalPages - abs(defaultPage))
  }
  const [page, _setPage] = useState(defaultPageToUse)

  const setPage = useCallback(
    (newPageArg) => {
      _setPage((curPage) => {
        newPageArg =
          typeof newPageArg === 'function' ? newPageArg(curPage) : newPageArg
        const newPage = newPageArg < 0 ? totalPages + newPageArg : newPageArg
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
