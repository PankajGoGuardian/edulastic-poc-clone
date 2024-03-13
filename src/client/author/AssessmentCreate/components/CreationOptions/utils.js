import { AccessType } from './constants'

export const stopPropagation = (e) => {
  e.stopPropagation()
  e.preventDefault()
}

/**
 * Determines if access is allowed based on access type and user features.
 * @param {Object} access - The access object containing type and features.
 * @param {string} [access.type] - The type of access (e.g., "OR", "AND").
 * @param {Array} [access.features=[]] - The array of features associated with the access.
 * @param {Object} [userFeatures={}] - The object containing user features.
 * @returns {boolean} A boolean indicating whether access is allowed.
 */

export const isAccessAllowed = (access, userFeatures = {}) => {
  if (access?.type && access?.features?.length && userFeatures) {
    if (access.type === 'OR') {
      return access.features.some((feature) => userFeatures[feature.key])
    }
    if (access.type === 'AND') {
      return access.features.every((feature) => userFeatures[feature.key])
    }
  }

  return true
}

/**
 * Validates and updates access features based on user features and access type.
 * @param {Object} access - The access object containing features and type.
 * @param {Array} [access.features=[]] - The array of features associated with the access.
 * @param {string} [access.type] - The type of access (e.g., "OR", "AND").
 * @param {Object} [userFeatures={}] - The object containing user features.
 * @returns {Array} The updated array of access features after validation.
 */

export const validateAndUpdateAccessFeatures = (access, userFeatures = {}) => {
  const newAccess = { ...access } // Create a new object to avoid mutation
  const newAccessFeatures = newAccess.features.filter(
    (feature) => !userFeatures?.[feature.key]
  )

  if (
    newAccess?.type === AccessType.OR &&
    newAccessFeatures.length !== newAccess.features.length
  ) {
    newAccess.features = []
  } else {
    newAccess.features = newAccessFeatures
  }

  return newAccess.features
}
