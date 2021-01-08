import React from 'react'
import { connect } from 'react-redux'

import FilterTags from '../../../../../common/components/FilterTags'
import {
  getFiltersSelector,
  setFiltersAction,
  getTestIdSelector,
  setTestIdAction,
  getTagsDataSelector,
  setTagsDataAction,
} from '../../filterDataDucks'

import staticDropDownData from '../../static/staticDropDownData.json'

const MultipleAssessmentRowFilters = ({
  setShowFilter,
  setShowApply,
  filters,
  setFilters,
  testIds,
  setTestIds,
  tagsData,
  setTagsData,
}) => {
  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles testIds
    if (type === 'testIds') {
      if (testIds.includes(key)) {
        const _testIds = testIds.filter((d) => d !== key)
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
        setTestIds(_testIds)
      }
    } else {
      const _filters = { ...filters }
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
      setFilters(_filters)
    }
    setTagsData(_tagsData)
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
    testIds: getTestIdSelector(state),
    tagsData: getTagsDataSelector(state),
  }),
  {
    setFilters: setFiltersAction,
    setTestIds: setTestIdAction,
    setTagsData: setTagsDataAction,
  }
)(MultipleAssessmentRowFilters)
