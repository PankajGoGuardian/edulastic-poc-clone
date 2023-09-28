import { useEffect } from 'react'
import { segmentApi } from '@edulastic/api'

/**
 * For POC the config is hard coded. Expected to be loaded dynamically from DB
 */
const pocConfig = {
  clickEvents: {
    '[data-cy="Dashboard"]': 'test.general.analytics.poc.dashboard',
    '[data-cy="Assignments"]': 'test.general.analytics.poc.assignments',
    '[data-cy="Gradebook"]': 'test.general.analytics.poc.gradebook',
  },
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

const SELECTOR_MATCH_BATCH_SIZE = 100

/**
 *
 * @param {{[event: string]: string}} events
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

export function useGlobalAnalytics() {
  useEffect(() => {
    /**
     *
     * @param {MouseEvent} e
     */
    const clickListener = (e) => {
      if (e.target) {
        findMatchingSelector(pocConfig.clickEvents, e.target).then((event) => {
          if (event) {
            console.log('GeneralAnalytics Track:::', event)
            segmentApi.genericEventTrack(event)
          }
        })
      }
    }

    document.addEventListener('click', clickListener, { passive: true })

    return () => {
      document.removeEventListener('click', clickListener, { passive: true })
    }
  }, [])
}
