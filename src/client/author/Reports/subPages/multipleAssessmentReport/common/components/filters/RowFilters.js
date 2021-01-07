import React from 'react'
import { connect } from 'react-redux'

import FilterTags from '../../../../../common/components/FilterTags'
import {
  getFiltersSelector,
  setFiltersAction,
  getTagsDataSelector,
  setTagsDataAction,
} from '../../filterDataDucks'

import staticDropDownData from '../../static/staticDropDownData.json'

const MultipleAssessmentRowFilters = ({
  setShowFilter,
  setShowApply,
  filters,
  setFilters,
  tagsData,
  setTagsData,
}) => {
  const handleCloseTag = (type, { key }) => {
    const _filters = { ...filters }
    const _tagsData = { ...tagsData }
    // handles single selection filters
    if (filters[type] === key) {
      _filters[type] = staticDropDownData.initialFilters[type]
      delete _tagsData[type]
    }
    // handles multiple selection filters
    else if (filters[type].includes(key)) {
      _filters[type] = filters[type]
        .split(',')
        .filter((d) => d !== key)
        .join(',')
      _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
    }
    setTagsData(_tagsData)
    setFilters(_filters)
    setShowApply(true)
    setShowFilter(true)
  }

  return (
    <FilterTags
      tagsData={tagsData}
      tagTypes={staticDropDownData.tagTypes}
      handleCloseTag={handleCloseTag}
    />
  )
}

export default connect(
  (state) => ({
    filters: getFiltersSelector(state),
    tagsData: getTagsDataSelector(state),
  }),
  {
    setFilters: setFiltersAction,
    setTagsData: setTagsDataAction,
  }
)(MultipleAssessmentRowFilters)
