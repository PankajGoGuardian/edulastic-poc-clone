/**
 *  This is an HOC for loading external resources. It also provides a mechanism for handling the mini-meanwhile.
 *  The primary thing here is to make sure no resources are loaded twice. We use a queue and a map to handle this.
 *  Whenever a component needs an extenral resource, its wrapped by this component. If the resources has not yet been
 *  loaded, a "loading-queue" will be created for the resource, and component's "needs" are queued there, and request
 *  for the resource is made. If other components are having same needs meanwhile - during resource is still being fetched-
 *  those are also queued to same queue. Once the resource is obtained all needs will be resolved, and the resource is flagged
 *  as already loaded in the "map". Whenever a component raises a need for external resource, it is first checked against this map!
 *
 *  Ummm... prolly this code belongs to "mines of Moria"! 👻
 */

import React, { useState, useEffect, useRef } from 'react'
import load from 'loadjs'

const NAMESPACE = 'edulaticV2LoadedResources'
const LOADING_RESOURCES = 'edulasticV2LoadingResources'

// map for keeping track of loaded resources
window[NAMESPACE] = {}
window[LOADING_RESOURCES] = {}

/**
 *
 * @param {string|string[]} resources
 */
const getResourcesNotLoaded = (resources) => {
  const allResources = Array.isArray(resources) ? resources : [resources]

  // return resources that aren't loaded yet
  return allResources.filter((x) => x && !window[NAMESPACE][x])
}

/**
 * return a promise, that will be resolved when the resource is loaded.
 * @param {string[]} resources
 */
const loadResources = (resources = []) => {
  if (!resources.length) return Promise.resolve()

  resources.forEach((resource) => {
    window[LOADING_RESOURCES][resource] = true
  })

  const returnPromise = load(resources, {
    returnPromise: true,
    async: true,
    numRetries: 1,
    success: () => {
      resources.forEach((resource) => {
        window[LOADING_RESOURCES][resource] = false
        // flag the resource as already loaded!
        window[NAMESPACE][resource] = true
      })
    },
    error: (pathsNotFound) => {
      // replace them from the global context as never loaded and see if next render will invoke them,
      // we already retried once.
      pathsNotFound.forEach((resource) => {
        window[LOADING_RESOURCES][resource] = false
        window[NAMESPACE][resource] = false
      })

      throw new Error(`Some resources could not be loaded ${pathsNotFound}`)
    },
  })

  return returnPromise
}

/**
 * Hook to leverage external script dependencies into your component
 * @param {string|string[]} criticalResources Dependencies that needs to be loaded first, the order is synchronous.
 * @param {string|string[]} resources Resources that follow the criticalResources to load
 * @param {Function=} onLoaded callback to use post resources being loaded.
 */
export const useResources = (criticalResources, resources, onLoaded) => {
  const [loaded, setLoaded] = useState(false)
  const onLoadedRef = useRef(onLoaded)
  useEffect(() => {
    onLoadedRef.current = onLoaded
  }, [onLoaded])

  const targetCriticalResources = getResourcesNotLoaded(criticalResources)
  const targetResources = getResourcesNotLoaded(resources)

  useEffect(() => {
    const handleOnLoad = () => {
      if (onLoadedRef.current) onLoadedRef.current()
      setLoaded(true)
    }

    if (!targetCriticalResources.length && !targetResources.length) {
      // if both are empty, then the fragments are loaded already
      handleOnLoad()
    } else {
      // first resolve the critical resources, if specified
      loadResources(targetCriticalResources)
        .then(() => loadResources(targetResources)) // then remaining resources
        .then(() => {
          handleOnLoad()
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, []) // treat it like componentDidMount

  return loaded
}

/**
 * HOC to leverage external script dependencies by wrapping your component
 *
 */
export function WithResourcesHOC({ criticalResources, resources, fallBack }) {
  return function resourceLoaded(WrappedComponent) {
    return (props) => {
      const loaded = useResources(criticalResources, resources)

      if (!loaded) {
        return fallBack
      }
      return <WrappedComponent {...props} />
    }
  }
}

export function WithResources({
  criticalResources,
  resources,
  fallBack,
  children,
  onLoaded,
}) {
  const loaded = useResources(criticalResources, resources, onLoaded)
  if (!loaded) {
    return fallBack
  }
  return children
}
