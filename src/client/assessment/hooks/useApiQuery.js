import { useRef, useState, useEffect } from 'react'
import _ from 'lodash'

/**
 * @template ApiFunc
 * @typedef {Awaited<ReturnType<ApiFunc>>} ApiResponse
 */

/**
 * @template ApiFunc
 * @typedef {{data: ApiResponse<ApiFunc> | null, error: any, loading: boolean}} ApiQueryResult
 */

/**
 * @template ApiFunc
 * @param {ApiFunc} api
 * @param  {Parameters<ApiFunc>} params
 * @returns {ApiQueryResult<ApiFunc>}
 */
function useApiQuery(api, ...params) {
  const previousParamsRef = useRef(null)

  /** @type {ApiQueryResult<ApiFunc>} */
  const initialState = {
    error: null,
    loading: true,
    data: null,
  }

  const [result, setResult] = useState(initialState)

  useEffect(() => {
    // TODO TBD return when previous request failed ?
    if (_.isEqual(previousParamsRef.current, params)) return

    const fetchData = async () => {
      setResult((state) => ({
        ...state,
        loading: true,
        error: null,
      }))

      try {
        const response = await api(...params)
        setResult({
          data: response,
          loading: false,
          error: null,
        })
      } catch (e) {
        setResult({
          data: null,
          loading: false,
          error: e,
        })
      }
      previousParamsRef.current = params
    }

    const timeout = setTimeout(fetchData, 200)
    return () => {
      clearTimeout(timeout)
    }
  }, [...params])

  return result
}

export default useApiQuery
