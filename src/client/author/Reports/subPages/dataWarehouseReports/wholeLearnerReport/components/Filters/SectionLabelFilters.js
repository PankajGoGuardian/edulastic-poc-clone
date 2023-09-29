import React from 'react'
import { get } from 'lodash'
import qs from 'qs'

import { EduIf } from '@edulastic/common'
import {
  EXTERNAL_SCORE_TYPES,
  getExternalScoreTypesListByTestTypes,
} from '../../../common/utils'
import { getArrayOfAllTestTypes } from '../../../../../../../common/utils/testTypeUtils'
import ExternalScoreTypeFilter from '../../../common/components/ExternalScoreTypeFilter'

/**
 * @typedef Props
 * @prop {Object} [history] - browser history object
 * @prop {Object} [location] - window location object
 * @prop {Boolean} [isSharedReport] - is shared report flag
 * @prop {Object} [filtersData] - filters api response data
 * @prop {Array} [testTypes] - selected test types filter
 * @prop {String} [externalScoreType] - selected external score type filter
 * @prop {Object} [filters] - unapplied filters
 * @prop {Object} [filterTagsData] - unapplied filter tags
 * @prop {Object} [settings] - contains applied filters, filter tags and selected student data
 * @prop {Function} [setFilters] - action to set unapplied filters
 * @prop {Function} [setFilterTagsData] - action to set unapplied filter tags
 * @prop {Function} [setSettings] - action to set applied filters, filter tags and selected student data
 */

/**
 * Whole Learner Report - Filters to display at the end of Section Label
 * @param {Props} props
 * @returns {React.Component}
 */
const SectionLabelFilters = ({
  history,
  location,
  isSharedReport,
  filtersData,
  testTypes,
  externalScoreType,
  filters,
  setFilters,
  filterTagsData,
  setFilterTagsData,
  settings,
  setSettings,
}) => {
  const { testTypes: availableTestTypes = getArrayOfAllTestTypes() } = get(
    filtersData,
    'data.result',
    {}
  )

  const externalScoreTypesList = getExternalScoreTypesListByTestTypes(
    testTypes,
    availableTestTypes
  )
  const selectedExternalScoreType =
    externalScoreTypesList.find((item) => item.key === externalScoreType) ||
    externalScoreTypesList.find(
      (item) => item.key === EXTERNAL_SCORE_TYPES.SCALED_SCORE
    )

  const updateFilterDropdownCB = (selected, keyName) => {
    const _selected = selected.key
    // TODO combine setFilterTagsData and setFilters action into one
    // update tags data
    const _filterTagsData = { ...filterTagsData, [keyName]: selected }
    setFilterTagsData(_filterTagsData)
    // update filters
    const _filters = { ...filters, [keyName]: _selected }
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    setFilters(_filters)
    // update settings
    setSettings({
      ...settings,
      frontEndFilters: {
        ...settings.frontEndFilters,
        externalScoreType: _selected,
      },
      selectedFilterTagsData: {
        ...settings.selectedFilterTagsData,
        externalScoreType: selected,
      },
    })
  }

  return (
    <EduIf condition={!isSharedReport && externalScoreTypesList.length}>
      <ExternalScoreTypeFilter
        selectedExternalScoreType={selectedExternalScoreType}
        externalScoreTypesList={externalScoreTypesList}
        updateFilterDropdownCB={updateFilterDropdownCB}
      />
    </EduIf>
  )
}

export default SectionLabelFilters
