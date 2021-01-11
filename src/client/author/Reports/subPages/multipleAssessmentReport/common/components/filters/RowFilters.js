import React from 'react'
import { connect } from 'react-redux'

import FilterTags from '../../../../../common/components/FilterTags'

import {
  getFiltersSelector,
  setFiltersAction,
  getTestIdSelector,
  setTestIdAction,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTagsDataSelector,
  setTagsDataAction,
} from '../../filterDataDucks'

import staticDropDownData from '../../static/staticDropDownData.json'

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)

const MultipleAssessmentRowFilters = ({
  setShowFilter,
  setShowApply,
  performanceBandRequired,
  demographicsRequired,
  filters,
  setFilters,
  testIds,
  setTestIds,
  tempDdFilter,
  setTempDdFilter,
  tagsData,
  setTagsData,
}) => {
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'profileId') &&
      (demographicsRequired || !ddFilterTypes.includes(t.key))
  )

  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles testIds
    if (type === 'testIds') {
      if (testIds.includes(key)) {
        const _testIds = testIds.filter((d) => d !== key)
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
        setTestIds(_testIds)
      }
    } // handles tempDdFilters
    else if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = ''
        delete _tagsData[type]
      }
      setTempDdFilter(_tempDdFilter)
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
      tagTypes={tagTypes}
      handleCloseTag={handleCloseTag}
    />
  )
}

export default connect(
  (state) => ({
    filters: getFiltersSelector(state),
    testIds: getTestIdSelector(state),
    tempDdFilter: getTempDdFilterSelector(state),
    tagsData: getTagsDataSelector(state),
  }),
  {
    setFilters: setFiltersAction,
    setTestIds: setTestIdAction,
    setTempDdFilter: setTempDdFilterAction,
    setTagsData: setTagsDataAction,
  }
)(MultipleAssessmentRowFilters)
