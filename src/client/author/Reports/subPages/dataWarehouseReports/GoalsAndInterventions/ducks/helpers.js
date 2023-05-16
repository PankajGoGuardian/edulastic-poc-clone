import { isEmpty, uniqBy } from 'lodash'
import {
  ADVANCED_SEARCH_DATA,
  ADVANCED_SEARCH_DETAILS,
  ADVANCED_SEARCH_QUERY,
  INITIAL_STATE_ADV_SEARCH,
} from './constants'

// utils
const getUniqOptionsHelper = (state) => {
  const fetchedData = state?.data || []
  const selectedData = state?.selected || []
  return uniqBy([...fetchedData, ...selectedData], 'value')
}

// reducer function
const setAdvancedSearchDetailsHelper = (state, { payload }) => {
  const { key, data, isAttendanceBand } = payload
  const values = data.map((value) => {
    const name = value.name || value._source?.name || value._source?.tagName
    if (isAttendanceBand) {
      return {
        value: value._id,
        label: name,
        metaData: {
          _id: value._id,
          bands: value.bands,
          levels_min: value.bands.map(({ min }) => min),
        },
      }
    }
    return {
      value: value._id,
      label: name,
    }
  })
  state[ADVANCED_SEARCH_DETAILS][key].data = values
  state[ADVANCED_SEARCH_DETAILS][key].isLoading = false
}

const setAdvancedSearchQueryHelper = (state, { payload }) => {
  if (isEmpty(payload)) {
    state[ADVANCED_SEARCH_QUERY] =
      INITIAL_STATE_ADV_SEARCH[ADVANCED_SEARCH_QUERY]
    return
  }
  state[ADVANCED_SEARCH_QUERY] = payload
}
const setAdvanceSearchDataHelper = (state, { payload }) => {
  if (isEmpty(payload)) {
    state[ADVANCED_SEARCH_DATA].data =
      INITIAL_STATE_ADV_SEARCH[ADVANCED_SEARCH_DATA].data
  }
  state[ADVANCED_SEARCH_DATA].data = payload
  state[ADVANCED_SEARCH_DATA].isLoading = false
}
const setGroupDetailsHelper = (state, { payload }) => {
  if (isEmpty(payload)) {
    state.group.groupDetails = {}
  } else {
    state.group.status = 'finished'
  }
  state.group.groupDetails = payload
  state.group.isLoading = false
}

const resetAdvancedSearchDetailsHelper = (state) => {
  state[ADVANCED_SEARCH_DETAILS] =
    INITIAL_STATE_ADV_SEARCH.advancedSearchDetails
}

export {
  getUniqOptionsHelper,
  setAdvancedSearchDetailsHelper,
  setAdvancedSearchQueryHelper,
  setGroupDetailsHelper,
  setAdvanceSearchDataHelper,
  resetAdvancedSearchDetailsHelper,
}
