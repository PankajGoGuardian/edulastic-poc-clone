import { createSelector } from 'reselect'

export const stateSelector = (state) => state.itemDetail

export const getItemDetailSelector = createSelector(
  stateSelector,
  (state) => state.item
)

export const getItemIdSelector = createSelector(
  getItemDetailSelector,
  (item) => item && item._id
)

export const getRows = (item, returnDummy = true) =>
  item.rows.map((row) => {
    let widgets = row.widgets
      .map((widget) => {
        let referencePopulate
        let activity = {
          timespent: null,
          qIndex: null,
        }

        if (item.data && item.data.questions && item.data.questions.length) {
          referencePopulate = item.data.questions.find(
            (q) => q.id === widget.reference
          )
        }

        if (widget && widget.entity && widget.entity.activity) {
          const { timespent, qIndex } = widget.entity.activity
          activity = { timespent, qIndex }
        }

        if (
          !referencePopulate &&
          item.data &&
          item.data.resources &&
          item.data.resources.length
        ) {
          referencePopulate = item.data.resources.find(
            (r) => r.id === widget.reference
          )
        }
        if (referencePopulate || returnDummy) {
          if (!referencePopulate) {
            referencePopulate = {
              data: null,
            }
          }
          return {
            ...widget,
            activity,
            referencePopulate,
            qIndex: referencePopulate.qIndex,
          }
        }
        return false
      })
      .filter((o) => o)
    if (item.isDocBased) {
      widgets = widgets.sort((a, b) => a.qIndex - b.qIndex)
    }
    return {
      ...row,
      widgets,
    }
  })

export const getItemDetailRowsSelector = createSelector(
  getItemDetailSelector,
  (item) => {
    if (!item) return []
    return getRows(item)
  }
)

export const getItemDetailLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)
export const getItemDetailUpdatingSelector = createSelector(
  stateSelector,
  (state) => state.updating
)
export const getItemDetailDraggingSelector = createSelector(
  stateSelector,
  (state) => state.dragging
)

export const getItemDetailDimensionTypeSelector = createSelector(
  getItemDetailSelector,
  (state) => {
    if (!state) return ''
    const left = state.rows[0].dimension.trim().slice(0, -1)
    const right = state.rows[1]
      ? state.rows[1].dimension.trim().slice(0, -1)
      : '100'
    return `${left}-${right}`
  }
)

export const getItemDetailValidationSelector = createSelector(
  getItemDetailRowsSelector,
  (rows) => {
    const validations = {}
    rows.forEach((row) => {
      row.widgets.forEach(({ entity }) => {
        validations[entity.id] = entity
      })
    })
    return validations
  }
)
