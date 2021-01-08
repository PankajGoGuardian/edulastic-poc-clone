import React from 'react'
import { connect } from 'react-redux'

import FilterTags from '../../../../common/components/FilterTags'
import {
  getFiltersAndTestIdSelector,
  setFiltersOrTestIdAction,
  getTagsDataSelector,
  setTagsDataAction,
} from '../filterDataDucks'

import staticDropDownData from '../static/staticDropDownData.json'

const SingleAssessmentRowFilters = ({
  setShowFilter,
  setShowApply,
  performanceBandRequired,
  standardProficiencyRequired,
  filtersAndTestId: { filters, testId },
  setFiltersOrTestId,
  tagsData,
  setTagsData,
}) => {
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'performanceBandProfile') &&
      (standardProficiencyRequired || t.key !== 'standardsProficiencyProfile')
  )

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
    setFiltersOrTestId({ filters: _filters, testId })
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
    tagsData: getTagsDataSelector(state),
  }),
  {
    setFiltersOrTestId: setFiltersOrTestIdAction,
    setTagsData: setTagsDataAction,
  }
)(SingleAssessmentRowFilters)
