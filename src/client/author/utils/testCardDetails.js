import { uniqBy } from 'lodash'
import { sharedTypeMap } from '../TestList/components/Item/Item'

/**
 *
 * @param {array} itemBanks from user's orgData
 * @param {array} collections from Test
 * @param {string} sharedType from Test
 * @returns collectionName
 */
export const getTestCollectionName = (itemBanks, collections, sharedType) => {
  let collectionName = 'PRIVATE'
  if (collections?.length > 0 && itemBanks.length > 0) {
    let filteredCollections = itemBanks.filter((c) =>
      collections.find((i) => i._id === c._id)
    )
    filteredCollections = uniqBy(filteredCollections, '_id')
    if (filteredCollections.length > 0)
      collectionName = filteredCollections.map((c) => c.name).join(', ')
  } else if (
    collections?.length &&
    collections.find((o) => o.name === 'Edulastic Certified')
  ) {
    collectionName = 'Edulastic Certified'
  } else if (sharedType) {
    // sharedType comes as number when "Shared with me" filter is selected
    if (!Number.isNaN(+sharedType)) {
      collectionName = sharedTypeMap[+sharedType]
    } else {
      collectionName = sharedType
    }
  }
  return collectionName
}
