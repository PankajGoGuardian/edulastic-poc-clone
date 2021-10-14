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
    'pageview',
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
