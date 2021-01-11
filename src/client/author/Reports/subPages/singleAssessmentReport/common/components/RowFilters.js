import React from 'react'
import { connect } from 'react-redux'

import FilterTags from '../../../../common/components/FilterTags'

import {
  getFiltersAndTestIdSelector,
  setFiltersOrTestIdAction,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTagsDataSelector,
  setTagsDataAction,
} from '../filterDataDucks'

import staticDropDownData from '../static/staticDropDownData.json'

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)

const SingleAssessmentRowFilters = ({
  setShowFilter,
  setShowApply,
  performanceBandRequired,
  standardProficiencyRequired,
  demographicsRequired,
  filtersAndTestId: { filters, testId },
  setFiltersOrTestId,
  tempDdFilter,
  setTempDdFilter,
  tagsData,
  setTagsData,
}) => {
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'performanceBandProfile') &&
      (standardProficiencyRequired ||
        t.key !== 'standardsProficiencyProfile') &&
      (demographicsRequired || !ddFilterTypes.includes(t.key))
  )

  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles tempDdFilters
    if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = staticDropDownData.initialDdFilters[type]
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
      setFiltersOrTestId({ filters: _filters, testId })
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
    filtersAndTestId: getFiltersAndTestIdSelector(state),
    tempDdFilter: getTempDdFilterSelector(state),
    tagsData: getTagsDataSelector(state),
  }),
  {
    setFiltersOrTestId: setFiltersOrTestIdAction,
    setTempDdFilter: setTempDdFilterAction,
    setTagsData: setTagsDataAction,
  }
)(SingleAssessmentRowFilters)
