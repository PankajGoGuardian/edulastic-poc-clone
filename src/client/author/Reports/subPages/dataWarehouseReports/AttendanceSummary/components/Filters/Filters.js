import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { get, mapValues } from 'lodash'

import { connect } from 'react-redux'

import { reportGroupType } from '@edulastic/constants/const/report'
import {
  removeFilter,
  resetStudentFilters as resetFilters,
} from '../../../../../common/util'
import { getTermOptions } from '../../../../../../utils/reports'
import { filterKeys, staticDropDownData } from '../../utils/constants'

import { actions, selectors } from '../../ducks'
import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../../../src/selectors/user'
import { fetchUpdateTagsDataAction } from '../../../../../ducks'
import FiltersView from './FiltersView'
import useFiltersFromURL from './hooks/useFiltersFromURL'
import useFiltersPreload from '../../../../../common/hooks/useFiltersPreload'
import { allFilterValue } from '../../../../../common/constants'
import { getSchoolsSelector } from '../../../../../../Schools/ducks'
import { getTeachersListSelector } from '../../../../../../Teacher/ducks'
import { getCourseListSelector } from '../../../../../../Courses/ducks'
import { getClassListSelector } from '../../../../../../AssignTest/duck'
import { getGroupListSelector } from '../../../../../../Groups/ducks'

const Filters = ({
  showFilter,
  showApply,
  firstLoad = false,
  isPrinting = false,
  location,
  search,
  userRole,
  orgData,
  defaultTermId,
  reportId = '',
  loadingFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  setFilters,
  filterTagsData,
  settings,
  selectedFilterTagsData = settings.selectedFilterTagsData || {},

  toggleFilter,
  setShowApply,
  setFirstLoad,
  fetchFiltersDataRequest,
  setFiltersTabKey,
  setFilterTagsData,
  onGoClick: _onGoClick,
  fetchUpdateTagsData,
  history,
  profileId,
  setProfileId,
  schoolList,
  teacherList,
  classList,
  groupList,
  courseList,
}) => {
  const tagTypes = staticDropDownData.tagTypes
  const { terms = [], schools } = orgData
  const schoolYears = useMemo(() => getTermOptions(terms), [terms])
  const institutionIds = useMemo(() => schools.map((s) => s._id), [schools])

  const { demographics = [], attendanceBandInfo = [] } = get(
    filtersData,
    'data.result',
    {}
  )

  const _attendanceBandInfo = attendanceBandInfo.map((item) => ({
    key: item._id,
    title: item.name,
  }))

  const termId =
    search.termId ||
    defaultTermId ||
    (schoolYears.length ? schoolYears[0].key : '')
  useFiltersPreload({
    reportId,
    fetchFiltersDataRequest,
    setFilters,
    filters,
    search,
    firstLoad,
    userRole,
    institutionIds,
    termId,
  })

  useFiltersFromURL({
    _onGoClick,
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
    schoolList,
    teacherList,
    classList,
    groupList,
    courseList,
    demographics,
  })

  useEffect(() => {
    if (attendanceBandInfo && attendanceBandInfo.length) {
      const [onethIndexAttendanceBand] = attendanceBandInfo
      const defalutProfileId =
        attendanceBandInfo.find((item) => item?._id === profileId)?._id ||
        onethIndexAttendanceBand?._id ||
        null
      if (profileId !== defalutProfileId) {
        setProfileId(defalutProfileId)
      }
    }
  }, [attendanceBandInfo])

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
    const { _filters, _filterTagsData } = removeFilter(
      filterTagsData,
      filters,
      type,
      key
    )
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
    if (keyName === filterKeys.ATTENDANCE_BAND) {
      return setProfileId(selected.key)
    }
    // update tags data
    const _filterTagsData = { ...filterTagsData, [keyName]: selected }
    const isSelectedKeyInvalid =
      !selected.key ||
      (typeof selected.key === 'string' &&
        selected.key.toLowerCase() === allFilterValue)

    if (!multiple && isSelectedKeyInvalid) {
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
      setFilters={setFilters}
      filterTagsData={filterTagsData}
      setFilterTagsData={setFilterTagsData}
      updateFilterDropdownCB={updateFilterDropdownCB}
      schoolYears={schoolYears}
      userRole={userRole}
      demographics={demographics}
      terms={terms}
      showApply={showApply}
      loadingFiltersData={loadingFiltersData}
      onGoClick={onGoClick}
      attendanceBandInfo={_attendanceBandInfo}
      profileId={profileId}
    />
  )
}

const enhance = connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    userRole: getUserRole(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
    schoolList: getSchoolsSelector(state),
    teacherList: getTeachersListSelector(state),
    courseList: getCourseListSelector(state),
    classList: getClassListSelector(state),
    groupList: getGroupListSelector(state),
  }),
  {
    ...actions,
    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.DW_ATTENDANCE_SUMMARY_REPORT,
        ...opts,
      }),
  }
)

export default enhance(Filters)
