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
import { load } from "loaderjs";

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
  return allResources.filter(x => !window[NAMESPACE][x]);
};

/**
 * return a promise, that will be resolve when the resource is loaded.
 * @param {String} resource
 */
const addToQueue = resource => {
  // lexical scoping is noice!!
  let resolvePromise;

  // once the resource is loaded, we need to resolve the promise.
  const resourcePromise = new Promise(resolve => {
    resolvePromise = resolve;
  });

  if (!window[LOADING_RESOURCES][resource]) {
    window[LOADING_RESOURCES][resource] = [];

    load([resource]).then(() => {
      // once the resource is loaded, tell em all components that "your needs are met"
      (window[LOADING_RESOURCES][resource] || []).forEach(resolve => resolve());
      // flag the resource as already loaded!
      window[NAMESPACE][resource] = true;
    });
    // does failing needs to be handled?
  }

  window[LOADING_RESOURCES][resource].push(resolvePromise);

  // return the promise.
  return resourcePromise;
};

/**
 *
 * @param {string|string[]} resources
 * @param {Function=} onLoaded
 */
export const useResources = (resources, onLoaded) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const resourcesToLoad = getResourcesNotLoaded(resources);
    // array of promises that are waiting on the resource laoded!
    const allResources = resourcesToLoad.map(addToQueue);

    // if all resources are loaded..
    Promise.all(allResources).then(() => {
      if (onLoaded) onLoaded();
      setLoaded(true);
    });
  }, [resources]);
  return loaded;
};

export function WithResourcesHOC({ resources, fallBack }) {
  return function resourceLoaded(WrappedComponent) {
    return props => {
      const loaded = useResources(resources);

      if (!loaded) {
        return fallBack;
      }
      return <WrappedComponent {...props} />;
    };
  };
}

export function WithResources({ resources, fallBack, children, onLoaded }) {
  const loaded = useResources(resources, onLoaded);
  if (!loaded) {
    return fallBack;
  }
  return children;
}
