import React from 'react'
import { connect } from 'react-redux'

import FilterTags from '../../../../../common/components/FilterTags'
import {
  getFiltersSelector,
  setFiltersAction,
  getSelectedClassSelector,
  setSelectedClassAction,
  getTagsDataSelector,
  setTagsDataAction,
} from '../../filterDataDucks'

import staticDropDownData from '../../static/staticDropDownData.json'

const StudentProfileRowFilters = ({
  performanceBandRequired,
  standardProficiencyRequired,
  filters,
  setFilters,
  selectedClassIds,
  setSelectedClassIds,
  tagsData,
  setTagsData,
}) => {
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'performanceBandProfileId') &&
      (standardProficiencyRequired || t.key !== 'standardsProficiencyProfileId')
  )

  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles selectedClassIds
    if (type === 'classIds') {
      if (selectedClassIds.includes(key)) {
        const _selectedClassIds = selectedClassIds
          .split(',')
          .filter((d) => d !== key)
          .join(',')
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
        setSelectedClassIds(_selectedClassIds)
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
    selectedClassIds: getSelectedClassSelector(state),
    tagsData: getTagsDataSelector(state),
  }),
  {
    setFilters: setFiltersAction,
    setSelectedClassIds: setSelectedClassAction,
    setTagsData: setTagsDataAction,
  }
)(StudentProfileRowFilters)
