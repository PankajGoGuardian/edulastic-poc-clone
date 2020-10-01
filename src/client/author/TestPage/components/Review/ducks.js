import { createSelector } from 'reselect'
import { get } from 'lodash'
import { getTestItemsSelector } from '../AddItems/ducks'

// selectors

export const getStandardsSelector = createSelector(
  getTestItemsSelector,
  (state) => {
    const result = {}

    state.forEach((item) => {
      const tags = get(item, 'data.questions', []).reduce((acc, question) => {
        const t = get(question, 'standardsMap.domains', []).reduce(
          (r, { standards }) => [...r, ...standards.map((s) => s.name)],
          []
        )
        return [...acc, ...t]
      }, [])

      result[item._id] = tags
    })

    return result
  }
)
