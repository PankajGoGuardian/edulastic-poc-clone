import { useRef, useState, useEffect } from 'react'
import _ from 'lodash'

/**
 * @template ApiFunc
 * @typedef {Awaited<ReturnType<ApiFunc>>} ApiResponse
 */

/**
 * @template ApiFunc
 * @typedef {{data: ApiResponse<ApiFunc> | null, error: any, loading: Boolean}} ApiQueryResult
 */

/**
 * @template ParamType
 * @typedef {{
 *    enabled?: Boolean | (params: ParamType) => Boolean
 *    debounceTimeout?: Number
 * }} useApiQueryOptions
 */

/**
 * @typedef {{
 *    enabled: Boolean
 *    debounceTimeout: Number
 * }} useApiQueryOptionsParsed
 */

/**
 * @template ParamType
 * @param {useApiQueryOptions<ParamType>} options
 * @param {ParamType} params
 * @returns {useApiQueryOptionsParsed}
 */
function parseOptions(_options, params) {
  const options = { enabled: true, debounceTimeout: 200, ..._options }
  options.enabled =
    typeof options.enabled === 'function'
      ? options.enabled(params)
      : !!options.enabled
  return options
}

/**
 * @template ApiFunc
 * @param {ApiFunc} api
 * @param  {Parameters<ApiFunc>} params
 * @param {useApiQueryOptions<Parameters<ApiFunc>>} options
 * @returns {ApiQueryResult<ApiFunc>}
 */
function useApiQuery(api, params, options = {}) {
  const previousParamsRef = useRef(null)

  /** @type {ApiQueryResult<ApiFunc>} */
  const initialState = {
    error: null,
    loading: true,
    data: null,
  }

  const [result, _setResult] = useState(initialState)

  const parsedOptions = parseOptions(options, params)

  useEffect(() => {
    if (!parsedOptions.enabled) return
    if (_.isEqual(previousParamsRef.current, params)) return
    let cancelled = false
    const setResult = (value) => {
      if (cancelled) return
      return _setResult(value)
    }

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

    const timeout = setTimeout(fetchData, parsedOptions.debounceTimeout)
    return () => {
      clearTimeout(timeout)
      cancelled = true
    }
  }, [parsedOptions.enabled, parsedOptions.debounceTimeout, ...params])

  return result
}

export default useApiQuery
