import { isEmpty } from 'lodash'

export const getitemGroupToDeliverObject = (itemGroup = {}) => {
  const { _id: groupId = '', items: itemsInGroup = [], groupName = '' } =
    itemGroup || {}
  return {
    groupId,
    groupName,
    attempted: 0,
    skipped: 0,
    items: (itemsInGroup || [])
      .map((item) => item?._id)
      .filter((itemId) => !!itemId),
  }
}

export const getFormattedItemGroupsToDeliver = (itemGroupsToDeliver = []) => {
  if (!isEmpty(itemGroupsToDeliver)) {
    return itemGroupsToDeliver
      .map((itemGroup) => {
        if (isEmpty(itemGroup)) {
          return null
        }
        return getitemGroupToDeliverObject(itemGroup)
      })
      .filter((itemToDeliverInGroup) => !!itemToDeliverInGroup)
  }
  return []
}
