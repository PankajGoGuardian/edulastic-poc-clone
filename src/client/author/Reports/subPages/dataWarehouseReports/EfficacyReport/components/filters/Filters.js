import React, { useMemo, useRef, useState } from 'react'
import qs from 'qs'
import { get, isEmpty, mapValues } from 'lodash'

import { connect } from 'react-redux'
import { reportGroupType } from '@edulastic/constants/const/report'
import { resetStudentFilters as resetFilters } from '../../../../../common/util'
import { getTermOptions } from '../../../../../../utils/reports'
import { staticDropDownData } from '../../utils'

import { getArrayOfAllTestTypes } from '../../../../../../../common/utils/testTypeUtils'
import useFiltersFromURL from './hooks/useFiltersFromURL'
import useUrlSearchParams from '../../../../../common/hooks/useUrlSearchParams'
import FiltersView from './FilterView'
import useFiltersPreload from '../../../../../common/hooks/useFiltersPreload'
import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../../../src/selectors/user'
import { actions, selectors } from '../../ducks'
import { fetchUpdateTagsDataAction } from '../../../../../ducks'
import {
  commonFilterKeys,
  filterKeysToCompareByKeys,
  nextCompareByKeys,
} from '../../../common/utils'

const FILTER_KEYS_MAP = Object.keys(staticDropDownData.initialFilters).reduce(
  (res, ele) => ({ [ele]: ele, ...res }),
  {}
)

const clearTestFilterKeys = [
  FILTER_KEYS_MAP.termId,
  FILTER_KEYS_MAP.testGrades,
  FILTER_KEYS_MAP.testSubjects,
  FILTER_KEYS_MAP.tagIds,
  FILTER_KEYS_MAP.assessmentTypes,
]

const Filters = ({
  // value props
  showFilter,
  showApply,
  firstLoad = false,
  isPrinting = false,
  location,
  userRole,
  orgData,
  defaultTermId,
  reportId = '',
  loadingFiltersData,
  prevFiltersData,
  selectedFilterTagsData,
  filtersData,
  filtersTabKey,
  filters,
  tableFilters,
  filterTagsData,
  // action props
  toggleFilter,
  setShowApply,
  setFirstLoad,
  fetchFiltersDataRequest,
  setFiltersTabKey,
  setFilters,
  setFilterTagsData,
  setPrevFiltersData,
  onGoClick: _onGoClick,
  fetchUpdateTagsData,
  history,
}) => {
  const [showPageLevelApply, setShowPageLevelApply] = useState(false)

  const assessmentTypesRef = useRef()
  const { terms = [], schools } = orgData
  const schoolYears = useMemo(() => getTermOptions(terms), [terms])
  const institutionIds = useMemo(() => schools.map((s) => s._id), [schools])

  const {
    bandInfo = [],
    demographics = [],
    testTypes: availableAssessmentType = getArrayOfAllTestTypes(),
    externalTests = [],
    externalBands = [],
  } = get(filtersData, 'data.result', {})

  const performanceBandsList = useMemo(
    () => bandInfo.map((p) => ({ key: p._id, title: p.name })),
    [bandInfo]
  )

  const search = useUrlSearchParams(location)

  useFiltersPreload({
    reportId,
    fetchFiltersDataRequest,
    setFilters,
    filters,
    search,
    firstLoad,
    userRole,
    institutionIds,
    termId:
      search.termId ||
      defaultTermId ||
      (schoolYears.length ? schoolYears[0].key : ''),
    externalTestsRequired: true,
    externalBandsRequired: true,
  })

  useFiltersFromURL({
    _onGoClick,
    defaultTermId,
    fetchUpdateTagsData,
    filters,
    filtersData,
    prevFiltersData,
    location,
    reportId,
    schoolYears,
    performanceBandsList,
    availableAssessmentType,
    search,
    setFilters,
    setPrevFiltersData,
    setFilterTagsData,
    setFirstLoad,
    setShowApply,
    toggleFilter,
    userRole,
  })

  const onGoClick = (_settings = {}) => {
    const newSettings = {
      requestFilters: { ...filters },
      selectedFilterTagsData: { ...filterTagsData },
      ..._settings,
    }
    setFilters({ ...filters })
    setShowPageLevelApply(false)
    setShowApply(false)
    _onGoClick(newSettings)
    toggleFilter(null, false)
  }

  const onAssessmentSelect = (selected, keyName) => {
    const _filterTagsData = { ...filterTagsData, [keyName]: selected }
    const _filters = { ...filters, [keyName]: selected.key || '' }
    if (!_filters[keyName]) {
      delete _filterTagsData[keyName]
    }
    // NOTE: this fixes Apply button shown intermittently on page refresh
    // However, unlike other autocompletes, Apply button will not be shown if same test is selected from dropdown
    if (_filters[keyName] !== filters[keyName]) {
      const _showpageLevelApply = firstLoad ? showPageLevelApply : true
      setShowPageLevelApply(_showpageLevelApply)
      setFilters(_filters)
    }
    setFilterTagsData(_filterTagsData)
  }

  const handleCloseTag = (type, { key }) => {
    const _filterTagsData = { ...filterTagsData }
    const _filters = { ...filters }
    resetFilters(_filterTagsData, _filters, type, '')
    // handles single selection filters
    if (filters[type] === key) {
      _filters[type] = staticDropDownData.initialFilters[type]
      delete _filterTagsData[type]
    }
    // handles multiple selection filters
    else if (filters[type].includes(key)) {
      _filters[type] = filters[type]
        .split(',')
        .filter((d) => d !== key)
        .join(',')
      _filterTagsData[type] = filterTagsData[type].filter((d) => d.key !== key)
    }
    setFilters(_filters)
    setFilterTagsData(_filterTagsData)
    setShowApply(true)
    toggleFilter(null, true)
  }

  const handleTagClick = (filterKey) => {
    const _filtersTabKey =
      staticDropDownData.tagTypes.find((filter) => filter.key === filterKey)
        ?.tabKey || -1
    if (_filtersTabKey !== -1) {
      toggleFilter(null, true)
      setFiltersTabKey(_filtersTabKey)
    }
  }

  const updateFilterDropdownCB = (
    selected,
    keyName,
    multiple = false,
    isPageLevelFilter = false
  ) => {
    // update tags data
    const _filterTagsData = { ...filterTagsData, [keyName]: selected }
    if (
      !multiple &&
      (!selected.key || selected.key === 'All' || selected.key === 'all')
    ) {
      delete _filterTagsData[keyName]
    }
    const _filters = { ...filters }
    const isClearTestFilterKey = clearTestFilterKeys.includes(keyName)
    if (isClearTestFilterKey) {
      _filters.preTestId = ''
      _filters.postTestId = ''
    }
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    resetFilters(_filterTagsData, _filters, keyName, _selected)
    setFilterTagsData(_filterTagsData)
    // update filters
    _filters[keyName] = _selected
    if (commonFilterKeys.includes(keyName)) {
      if (isEmpty(_selected)) {
        _filters.selectedCompareBy = filterKeysToCompareByKeys[keyName]
      } else {
        _filters.selectedCompareBy =
          nextCompareByKeys[filterKeysToCompareByKeys[keyName]]
      }
    } else if (!_filters.selectedCompareBy) {
      _filters.selectedCompareBy = tableFilters.compareBy.key
    }
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    delete _filters.selectedCompareBy
    if (isPageLevelFilter) {
      setFilters({ ..._filters })
      setShowPageLevelApply(true)
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  return (
    <FiltersView
      reportId={reportId}
      isPrinting={isPrinting}
      handleTagClick={handleTagClick}
      handleCloseTag={handleCloseTag}
      showFilter={showFilter}
      toggleFilter={toggleFilter}
      filtersTabKey={filtersTabKey}
      setFiltersTabKey={setFiltersTabKey}
      filters={filters}
      selectedFilterTagsData={selectedFilterTagsData}
      tagTypes={staticDropDownData.tagTypes}
      updateFilterDropdownCB={updateFilterDropdownCB}
      onAssessmentSelect={onAssessmentSelect}
      schoolYears={schoolYears}
      performanceBandsList={performanceBandsList}
      assessmentTypesRef={assessmentTypesRef}
      availableAssessmentType={availableAssessmentType}
      externalTests={externalTests}
      externalBands={externalBands}
      userRole={userRole}
      demographics={demographics}
      showPageLevelApply={showPageLevelApply}
      showApply={showApply}
      loadingFiltersData={loadingFiltersData}
      onGoClick={onGoClick}
    />
  )
}

const enhance = connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    userRole: getUserRole(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
  }),
  {
    ...actions,
    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.DW_EFFICACY_REPORT,
        ...opts,
      }),
  }
)

export default enhance(Filters)
