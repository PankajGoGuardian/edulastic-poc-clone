import { groupBy } from 'lodash'

export const groupTestItemsByPassageId = (items = []) => {
  const groupByPassageId = groupBy(items, 'passageId')
  const _items = items
    .map((item) => {
      if (!item.passageId) {
        return item
      }
      const grouped = groupByPassageId[item.passageId]
      delete groupByPassageId[item.passageId]

      if (grouped && grouped.length <= 1) {
        return item
      }

      return grouped
    })
    .filter((x) => !!x)

  return _items
}
