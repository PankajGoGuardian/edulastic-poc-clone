import AppConfig from '../../../app-config'

export const initializeSegment = (forceEnable = false) => {
  if (!(AppConfig.isSegmentEnabled || forceEnable)) return

  // Snippet is refactored version of
  // https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/
  window.analytics = window.analytics || []
  const { analytics } = window
  if (analytics.initialize) return
  if (analytics.invoked) {
    if (window.console && console.error)
      console.error('Segment snippet included twice.')
    return
  }

  analytics.invoked = true
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on',
    'addSourceMiddleware',
    'addIntegrationMiddleware',
    'setAnonymousId',
    'addDestinationMiddleware',
  ]
  analytics.factory = function (method) {
    return function () {
      // eslint-disable-next-line prefer-rest-params
      const args = Array.prototype.slice.call(arguments)
      args.unshift(method)
      analytics.push(args)
      return analytics
    }
  }
  for (let i = 0; i < analytics.methods.length; i++) {
    const key = analytics.methods[i]
    analytics[key] = analytics.factory(key)
  }
  analytics.load = function (key, options) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    // download the file from by passing the key https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js
    // and upload it to s3
    script.src = AppConfig.segmentURI
    const first = document.getElementsByTagName('script')[0]
    first.parentNode.insertBefore(script, first)
    analytics._loadOptions = options
  }
  analytics.SNIPPET_VERSION = AppConfig.segmentVersion
  analytics.load()
  analytics.page()
}

/**
 * Searches `arr` for first match in `queries`.
 * If match is not found for ith query, next query is tried.
 * If no match is found at all, returns the `_default`
 * Example 1:
 * ```js
 * multiFind(
 *   [{ a: 0 }, { b: 1, bb: 11 }, { c: 2 }],
 *   [{ a: 2 }, { b: 1 }]
 * )
 * // returns {b: 1, bb: 11}
 * ```
 * Example 2:
 * ```js
 * multiFind(
 *   [{ a: 0 }, { b: 1, bb: 11 }, { c: 2 }],
 *   [{ a: 2 }, { b: 2 }, (v) => v.b == 1]
 * )
 * // returns {b: 1, bb: 11}
 * ```
 * Example 3:
 * ```js
 * multiFind(
 *   [{ a: 0 }, { b: 1, bb: 11 }, { c: 2 }],
 *   [{ a: 2 }, { b: 2 }, (v) => v.b == 3],
 *   {a: 'default'}
 * )
 * // returns {a: 'default'}
 * ```
 * @template arrayElement, defaultType
 * @param {arrayElement[]} arr Array to search into
 * @param {(Function|object)[]} queries array of queries. Query may be function or object
 * @param {defaultType} _default default value to return if no match found
 * @returns {arrayElement | defaultType}
 */
export function multiFind(arr, queries, _default = undefined) {
  for (const query of queries) {
    const findFunc =
      typeof query === 'function'
        ? query
        : (val) => {
            return Object.entries(query).every(([k, v]) => val[k] === v)
          }
    const foundIndex = arr.findIndex(findFunc)
    if (foundIndex !== -1) return arr[foundIndex]
  }
  return _default
}
