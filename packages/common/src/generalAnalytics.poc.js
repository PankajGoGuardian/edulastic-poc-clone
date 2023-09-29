import { useEffect } from 'react'
import { segmentApi } from '@edulastic/api'

/**
 * For POC the config is hard coded. Expected to be loaded dynamically from DB
 */

/**
 * @type {{clickEvents: Record<string,string>, urlPatterns: Record<string,string>}}
 *
 */
const pocConfig = {
  /**
   * Clickevents hashmap
   * selectors as key and event name as value
   */
  clickEvents: {
    // attributes selector
    '[data-cy="Dashboard"]': 'test.general.analytics.poc.dashboard',
    '[data-cy="Assignments"]': 'test.general.analytics.poc.assignments',
    '[data-cy="Gradebook"]': 'test.general.analytics.poc.gradebook',
    // id selector
    '#uniqueButtonId': 'test.uniqueButtonClickEvent',
    // class selector
    '.buttonClass': 'test.buttonClassClickEvent',
    // combination selector: button with data-cy="createNew" inside element with class fixed-header
    '.fixed-header button[data-cy="createNew]': 'test.assignmentNewEvent',
    // order based selector: 2nd `li` element that is direct descendant of `ul`
    'ul > li:nth-child(2)': 'test.2ndliClickEvent',
  },
  /**
   * Urlpatterns: events hashmap
   * Urlpatterns as key and event name as value
   */
  urlPatterns: {
    // simple pattern
    'author/assignments': 'test.pageview.assignments',
    // regex pattern
    'regex:author/items/.*/item-detail': 'test.pageview.itemDetail',
  },
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

const SELECTOR_MATCH_BATCH_SIZE = 100
const URL_PATTERN_BATCH_SIZE = 100

/**
 *
 * @param {Record<string,string>} events
 * @param { EventTarget } target
 */
async function findMatchingSelector(events, target) {
  let count = 0
  for (const [selector, event] of Object.entries(events)) {
    count++
    if (target?.closest(selector)) {
      return event
    }
    /**
     * Hack to split the long running task into
     * multiple subtasks running in multiple event loops so that
     * it doesn't block the browser event loop
     */
    if (count % SELECTOR_MATCH_BATCH_SIZE === 0) {
      await delay(0)
    }
  }
  return null
}

const REGEX_PREFIX = 'regex:'

/**
 *
 * @param {Record<string,string>} patterns
 * @param {string} fullUrl
 */
async function findMatchingPath(patterns, fullUrl) {
  let count = 0
  for (const [pattern, event] of Object.entries(patterns)) {
    count++
    if (
      pattern.startsWith(REGEX_PREFIX) &&
      fullUrl.match(new RegExp(pattern.slice(REGEX_PREFIX.length)))
    ) {
      return event
    }
    if (fullUrl.includes(pattern)) {
      return event
    }
    /**
     * Hack to split the long running task into
     * multiple subtasks running in multiple event loops so that
     * it doesn't block the browser event loop
     */
    if (count % URL_PATTERN_BATCH_SIZE === 0) {
      await delay(0)
    }
  }
  return null
}

export function useGlobalAnalytics({ history }) {
  useEffect(() => {
    /**
     *
     * @param {MouseEvent} e
     */
    const clickListener = (e) => {
      if (e.target) {
        findMatchingSelector(pocConfig.clickEvents, e.target)
          .then((event) => {
            if (event) {
              console.log('GeneralAnalytics Track:::', event)
              segmentApi.genericEventTrack(event)
            }
          })
          .catch((err) => {
            console.warn('General Analytics Click error:', err)
          })
      }
    }

    document.addEventListener('click', clickListener, { passive: true })

    const historyCb = (e) => {
      const { pathname, search } = e
      const fullUrl = `${pathname}${search}`
      findMatchingPath(pocConfig.urlPatterns, fullUrl)
        .then((event) => {
          if (event) {
            console.log('GeneralAnalytics page Track:::', event)
            segmentApi.genericEventTrack(event)
          }
        })
        .catch((err) => {
          console.warn('General Analytics url pattern error:', err)
        })
    }
    const unlisten = history.listen(historyCb)

    historyCb(window.location)

    return () => {
      document.removeEventListener('click', clickListener, { passive: true })
      unlisten()
    }
  }, [])
}
