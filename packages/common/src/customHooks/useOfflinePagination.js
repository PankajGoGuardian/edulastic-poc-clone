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
  const [page, _setPage] = useState(defaultPage)
  const totalPages = Math.ceil(data.length / pageSize)

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

  const pagedData = useMemo(() => {
    const pageOffset = page * pageSize
    let start = Math.max(0, pageOffset - lookbackCount)
    const end = Math.min(data.length, pageOffset + pageSize + lookaheadCount)
    if (backFillLastPage && end === data.length) {
      start =
        Math.min(data.length, pageOffset + pageSize) - pageSize - lookbackCount
    }
    return data.slice(start, end)
  }, [data, page])

  return {
    page,
    // pagination,
    prev,
    next,
    pagedData,
    setPage,
    totalPages,
  }
}

export default useOfflinePagination
