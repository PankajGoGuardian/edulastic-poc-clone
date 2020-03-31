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
// @ts-check
import React, { useState, useEffect } from "react";
import load from "loadjs";

const NAMESPACE = "edulaticV2LoadedResources";
const LOADING_RESOURCES = "edulasticV2LoadingResources";

// map for keeping track of loaded resources
window[NAMESPACE] = {};
window[LOADING_RESOURCES] = {};

/**
 *
 * @param {string|string[]} resources
 */
const getResourcesNotLoaded = resources => {
  const allResources = Array.isArray(resources) ? resources : [resources];

  // we check for both loading yet and already loaded since do not want to retrigger them
  return allResources.filter(a => a).filter(x => !window[NAMESPACE][x] && !window[LOADING_RESOURCES][x]);
};

/**
 * return a promise, that will be resolved when the resource is loaded.
 * @param {string|string[]} resources
 */
const loadResources = (resources = []) => {
  // filter out the loading & loaded resouces
  const targetResources = getResourcesNotLoaded(resources);

  if (!targetResources.length) return Promise.resolve();

  targetResources.forEach(resource => {
    window[LOADING_RESOURCES][resource] = true;
  });

  return load(targetResources, { returnPromise: true, async: true, numRetries: 1 })
    .then(() => {
      targetResources.forEach(resource => {
        window[LOADING_RESOURCES][resource] = false;
        // flag the resource as already loaded!
        window[NAMESPACE][resource] = true;
      });
    })
    .catch(pathsNotFound => {
      // replace them from the global context as never loaded and see if next render will invoke them,
      // we already retried once.
      pathsNotFound.forEach(resource => {
        window[LOADING_RESOURCES][resource] = false;
        window[NAMESPACE][resource] = false;
      });

      throw new Error(`Some resources could not be loaded ${pathsNotFound}`);
    });
};

/**
 * Hook to leverage external script dependencies into your component
 * @param {string|string[]} criticalResources Dependencies that needs to be loaded first, the order is synchronous.
 * @param {string|string[]} resources Resources that follow the criticalResources to load
 * @param {Function=} onLoaded callback to use post resources being loaded.
 */
export const useResources = (criticalResources, resources, onLoaded) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // first resolve the critical resources, if specified
    loadResources(criticalResources)
      .then(() => loadResources(resources)) // then remaining resources
      .then(() => {
        if (onLoaded) onLoaded();
        setLoaded(true);
      });
  }, [resources]);

  return loaded;
};

/**
 * HOC to leverage external script dependencies by wrapping your component
 *
 */
export function WithResourcesHOC({ criticalResources, resources, fallBack }) {
  return function resourceLoaded(WrappedComponent) {
    return props => {
      const loaded = useResources(criticalResources, resources);

      if (!loaded) {
        return fallBack;
      }
      return <WrappedComponent {...props} />;
    };
  };
}

export function WithResources({ criticalResources, resources, fallBack, children, onLoaded }) {
  const loaded = useResources(criticalResources, resources, onLoaded);
  if (!loaded) {
    return fallBack;
  }
  return children;
}
