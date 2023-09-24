import { useEffect } from 'react'
import { segmentApi } from '@edulastic/api'

/**
 * For POC the config is hard coded. Expected to be loaded dynamically from DB
 */
const pocConfig = {
  baseEvents: {
    TestItemEvent: {
      testId: 'track-test-id',
      testItemId: 'track-test-item-id',
    },
  },
  events: {
    Dashboard: 'test.general.analytics.poc.dashboard',
    'check-answer-btn': {
      _extends: 'TestItemEvent',
      name: 'test.general.analytics.poc.checkAnswer',
    },
  },
}

export function attributes(attrs) {
  return Object.keys(attrs).reduce(
    (acc, k) => ({ ...acc, [`data-${k}`]: attrs[k] }),
    {}
  )
}

const ANALYTIC_ATTRIBUTE = 'data-cy'

function extendEvent(base, event) {
  const baseEvent = pocConfig.baseEvents[base]
  return { ...baseEvent, ...event }
}

export function useGlobalAnalytics() {
  useEffect(() => {
    /**
     *
     * @param {MouseEvent} e
     */
    const clickListener = (e) => {
      if (e.target) {
        const target = e.target
        const trackValue = target
          .closest(`[${ANALYTIC_ATTRIBUTE}]`)
          ?.getAttribute(ANALYTIC_ATTRIBUTE)
        if (trackValue && trackValue in pocConfig.events) {
          if (typeof pocConfig.events[trackValue] === 'string') {
            segmentApi.genericEventTrack(pocConfig.events[trackValue])
            console.log('genericEventTrack::', pocConfig.events[trackValue])
          } else {
            let eventConfig = null
            const { _extends, name, ...event } = pocConfig.events[trackValue]
            eventConfig = event
            if (_extends) {
              eventConfig = extendEvent(_extends, event)
            }

            const eventDetails = Object.keys(eventConfig).reduce((acc, key) => {
              const attribute = `[data-${eventConfig[key]}]`
              return {
                ...acc,
                [key]:
                  target
                    .closest(attribute)
                    ?.getAttribute(`data-${eventConfig[key]}`) || undefined,
              }
            }, {})

            segmentApi.genericEventTrack(name, eventDetails)
            console.log('genericEventTrack::details::', {
              name,
              ...eventDetails,
            })
          }
        }
      }
    }

    document.addEventListener('click', clickListener, true)

    return () => {
      document.removeEventListener('click', clickListener, true)
    }
  }, [])
}
