import React, { useMemo, useRef } from 'react'
import qs from 'qs'
import { get, mapValues } from 'lodash'

import { connect } from 'react-redux'

import { resetStudentFilters as resetFilters } from '../../../../../common/util'
import { getTermOptions } from '../../../../../../utils/reports'
import {
  staticDropDownData,
  availableTestTypes as availableAssessmentType,
} from '../../utils'

import { actions, selectors } from '../../ducks'
import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../../../src/selectors/user'
import { fetchUpdateTagsDataAction } from '../../../../../ducks'
import FiltersView from './FiltersView'
import useFiltersPreload from './hooks/useFiltersPreload'
import useFiltersFromURL from './hooks/useFiltersFromURL'
import useUrlSearchParams from './hooks/useUrlSearchParams'

const Filters = ({
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
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  settings,
  selectedFilterTagsData = settings.selectedFilterTagsData || {},

  toggleFilter,
  setShowApply,
  setFirstLoad,
  fetchFiltersDataRequest,
  setFiltersTabKey,
  setFilters,
  setFilterTagsData,
  onGoClick: _onGoClick,
  fetchUpdateTagsData,
  history,
}) => {
  const assessmentTypesRef = useRef()

  const tagTypes = staticDropDownData.tagTypes
  const { terms = [], schools } = orgData
  const schoolYears = useMemo(() => getTermOptions(terms), [terms])
  const institutionIds = useMemo(() => schools.map((s) => s._id), [schools])

  const { demographics = [] } = get(filtersData, 'data.result', {})

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
  })

  useFiltersFromURL({
    _onGoClick,
    availableAssessmentType,
    defaultTermId,
    fetchUpdateTagsData,
    filters,
    filtersData,
    location,
    reportId,
    schoolYears,
    search,
    setFilters,
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
    setFilters({ ...filters, showApply: false })
    setShowApply(false)
    _onGoClick(newSettings)
    toggleFilter(null, false)
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
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    resetFilters(_filterTagsData, _filters, keyName, _selected)
    setFilterTagsData(_filterTagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    if (keyName === 'profileId') {
      setFiltersTabKey(
        staticDropDownData.filterSections.PERFORMANCE_FILTERS.key
      )
      setFilters({ ..._filters, showApply: true })
      setShowApply(true)
    }
    if (isPageLevelFilter) {
      setFilters({ ..._filters, showApply: true })
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  return (
    <FiltersView
      isPrinting={isPrinting}
      reportId={reportId}
      selectedFilterTagsData={selectedFilterTagsData}
      tagTypes={tagTypes}
      handleCloseTag={handleCloseTag}
      handleTagClick={handleTagClick}
      showFilter={showFilter}
      toggleFilter={toggleFilter}
      filtersTabKey={filtersTabKey}
      setFiltersTabKey={setFiltersTabKey}
      filters={filters}
      updateFilterDropdownCB={updateFilterDropdownCB}
      schoolYears={schoolYears}
      assessmentTypesRef={assessmentTypesRef}
      availableAssessmentType={availableAssessmentType}
      userRole={userRole}
      demographics={demographics}
      terms={terms}
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
  { ...actions, fetchUpdateTagsData: fetchUpdateTagsDataAction }
)

export default enhance(Filters)
