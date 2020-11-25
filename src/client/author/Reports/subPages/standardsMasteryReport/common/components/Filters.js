import React, { useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, uniqBy, pickBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spin } from 'antd'

import { roleuser } from '@edulastic/constants'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { MultipleSelect } from '../../../../common/components/widgets/MultipleSelect'
import { toggleItem } from '../../../../common/util'

import {
  getUser,
  getInterestedGradesSelector,
  getInterestedCurriculumsSelector,
} from '../../../../../src/selectors/user'

import {
  getFiltersSelector,
  getTestIdSelector,
  setFiltersAction,
  setTestIdAction,
  getStandardsFiltersRequestAction,
  getReportsStandardsFilters,
  getPrevStandardsFiltersSelector,
  setPrevStandardsFiltersAction,
  getReportsStandardsFiltersLoader,
} from '../filterDataDucks'

import filtersDropDownData from '../static/json/filtersDropDownData.json'
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel,
} from '../../../../common/styled'

const StandardsFilters = ({
  user,
  loc,
  location,
  style,
  interestedGrades,
  interestedCurriculums,
  extraFilter,
  loading,
  filters,
  setFilters,
  testIds,
  setTestId: _setTestId,
  onGoClick: _onGoClick,
  getStandardsFiltersRequest,
  standardsFilters,
  prevStandardsFilters,
  setPrevStandardsFilters,
  showApply,
  setShowApply,
  reportId,
}) => {
  const standardsFilteresReceiveCount = useRef(0)

  const curriculumsList = useMemo(() => {
    let _curriculums = []
    if (interestedCurriculums.length) {
      _curriculums = interestedCurriculums.map((item) => ({
        key: `${item._id}`,
        title: item.name,
      }))
    }
    return _curriculums
  }, [interestedCurriculums])

  const schoolYear = useMemo(() => {
    let _schoolYear = []
    const arr = get(user, 'orgData.terms', [])
    if (arr.length) {
      _schoolYear = arr.map((item) => ({ key: item._id, title: item.name }))
    }
    return _schoolYear
  }, [user])

  // get initial filters from url and orgData
  const getInitialFilters = () => {
    const search = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    const defaultTermId =
      filters?.termId || get(user, 'orgData.defaultTermId', '')
    const urlSchoolYear =
      schoolYear.find((item) => item.key === search.termId) ||
      schoolYear.find((item) => item.key === defaultTermId) ||
      (schoolYear[0] ? schoolYear[0] : { key: '', title: '' })
    const urlCurriculum =
      curriculumsList.find((item) => item.key === search.curriculumId) ||
      curriculumsList[0]
    search.grade = search.grade || interestedGrades[0]
    const urlGrade =
      filtersDropDownData.grades.find((item) => item.key === search.grade) ||
      filtersDropDownData.grades[0]
    const urlAssessmentType =
      filtersDropDownData.assessmentTypes.find(
        (item) => item.key === search.assessmentType
      ) || filtersDropDownData.assessmentTypes[0]
    return {
      ...filters,
      termId: urlSchoolYear.key,
      curriculumId: urlCurriculum.key,
      grade: urlGrade.key,
      assessmentType: urlAssessmentType.key,
    }
  }

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      getStandardsFiltersRequest({ reportId })
      setFilters({ ...filters, ...search })
    } else {
      const _filters = getInitialFilters()
      setFilters({ ..._filters, ...search })
      const q = {
        termId: _filters.termId,
      }
      if (get(user, 'role', '') === roleuser.SCHOOL_ADMIN) {
        q.schoolIds = get(user, 'institutionIds', []).join(',')
      }
      getStandardsFiltersRequest(q)
    }
  }, [])

  useEffect(() => {
    if (filters.showApply) {
      setShowApply(true)
      setFilters({ ...filters, showApply: false })
    }
  }, [filters.showApply])

  const allTestIds = useMemo(() => {
    let arr = []
    if (!isEmpty(standardsFilters)) {
      let tempArr = get(standardsFilters, 'testData', [])
      tempArr = uniqBy(
        tempArr.filter((item) => item.testId),
        'testId'
      )
      tempArr = tempArr.map((item) => ({
        key: item.testId,
        title: item.testName,
      }))
      arr = arr.concat(tempArr)
    }
    return arr
  }, [standardsFilters])

  if (prevStandardsFilters !== standardsFilters && !isEmpty(standardsFilters)) {
    setPrevStandardsFilters(standardsFilters)
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      _onGoClick({
        filters: { ...filters, ...search },
        selectedTest: [],
      })
    } else if (standardsFilteresReceiveCount.current === 0) {
      // default filters
      const _filters = getInitialFilters()
      // filters fetched on page load
      const onLoadFilters = pickBy(
        get(standardsFilters, 'filters', {}),
        (f) => f !== 'All' && !isEmpty(f)
      )
      // get new filters
      const { testIds: onLoadTestIds, ...newFilters } = {
        ..._filters,
        ...onLoadFilters,
        domainIds: [],
      }
      // check if testIds in url are valid (present in the array)
      const urlTestIds = onLoadTestIds?.length
        ? onLoadTestIds
        : search.testIds || []
      const validTestIds = allTestIds.filter((test) =>
        urlTestIds.includes(test.key)
      )
      _setTestId(validTestIds)
      // checks to check if saved filters match the default
      const shouldUpdateSchoolYear = newFilters.termId !== filters.termId
      // settings to fetch the page data
      const settings = {
        filters: { ...newFilters },
        selectedTest: validTestIds,
      }
      setFilters(newFilters)
      // update standards filters for mismatch of saved filters
      if (shouldUpdateSchoolYear) {
        const q = { termId: newFilters.termId }
        if (get(user, 'role', '') === roleuser.SCHOOL_ADMIN) {
          q.schoolIds = get(user, 'institutionIds', []).join(',')
        }
        getStandardsFiltersRequest(q)
      }
      if (get(user, 'role', '') === roleuser.SCHOOL_ADMIN) {
        settings.filters.schoolIds = get(user, 'institutionIds', [])
      }
      // load page data
      _onGoClick(settings)
    }
    standardsFilteresReceiveCount.current++
  }

  // -----|-----|-----|-----| EVENT HANDLERS BEGIN |-----|-----|-----|----- //
  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: testIds,
    }
    if (get(user, 'role', '') === roleuser.SCHOOL_ADMIN) {
      settings.filters.schoolIds = get(user, 'institutionIds', [])
    }
    setShowApply(false)
    _onGoClick(settings)
  }

  const setTestId = (_testId) => {
    setShowApply(true)
    _setTestId(_testId)
  }

  const updateSchoolYearDropDownCB = (selected) => {
    const obj = {
      ...filters,
      termId: selected.key,
      showApply: true,
    }
    setFilters(obj)
    const q = {
      termId: selected.key,
    }
    if (get(user, 'role', '') === roleuser.SCHOOL_ADMIN) {
      Object.assign(q, {
        schoolIds: get(user, 'institutionIds', []).join(','),
      })
    }
    getStandardsFiltersRequest(q)
  }

  const updateFilterDropdownCB = (selected, keyName) => {
    const _filters = {
      ...filters,
      [keyName]: selected.key,
      showApply: true,
    }
    setFilters(_filters)
  }

  const onSelectTest = (test) => {
    const items = toggleItem(
      testIds.map((_test) => _test.key),
      test.key
    )
    setTestId(allTestIds.filter((_test) => !!items.includes(_test.key)))
  }

  const onChangeTest = (items) => {
    if (!items.length) {
      setTestId([])
    }
  }

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //
  const middleFilters = [...extraFilter]
  const endFilters =
    loc === 'standards-gradebook'
      ? middleFilters.splice(middleFilters.length - 5)
      : null

  return loading ? (
    <StyledFilterWrapper style={style}>
      <Spin />
    </StyledFilterWrapper>
  ) : (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        {showApply && (
          <StyledGoButton onClick={onGoClick}>APPLY</StyledGoButton>
        )}
      </GoButtonWrapper>
      <PerfectScrollbar>
        <SearchField>
          <FilterLabel>School Year</FilterLabel>
          <ControlDropDown
            by={filters.termId}
            selectCB={updateSchoolYearDropDownCB}
            data={schoolYear}
            prefix="School Year"
            showPrefixOnSelected={false}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Grade</FilterLabel>
          <ControlDropDown
            by={filters.grade}
            selectCB={(e) => updateFilterDropdownCB(e, 'grade')}
            data={filtersDropDownData.grades}
            prefix="Grade"
            showPrefixOnSelected={false}
          />
        </SearchField>
        {middleFilters}
        <SearchField>
          <FilterLabel>Assessment Name</FilterLabel>
          <MultipleSelect
            containerClassName="standards-mastery-report-assessment-autocomplete"
            data={(allTestIds || []).map((t) => ({
              ...t,
              title: `${t.title} (ID: ${
                t.key?.substring(t.key.length - 5) || ''
              })`,
            }))}
            valueToDisplay={
              testIds?.length > 1
                ? { key: '', title: 'Multiple Assessment' }
                : (testIds || []).map((t) => ({
                    ...t,
                    title: `${t.title} (ID: ${
                      t.key?.substring(t.key.length - 5) || ''
                    })`,
                  }))
            }
            by={testIds}
            prefix="Assessment Name"
            onSelect={onSelectTest}
            onChange={onChangeTest}
            placeholder="All Assessments"
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Assessment Type</FilterLabel>
          <ControlDropDown
            by={filters.assessmentType}
            selectCB={(e) => updateFilterDropdownCB(e, 'assessmentType')}
            data={filtersDropDownData.assessmentTypes}
            prefix="Assessment Type"
            showPrefixOnSelected={false}
          />
        </SearchField>
        {endFilters}
      </PerfectScrollbar>
    </StyledFilterWrapper>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsStandardsFiltersLoader(state),
      standardsFilters: getReportsStandardsFilters(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state) || [],
      user: getUser(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      prevStandardsFilters: getPrevStandardsFiltersSelector(state),
    }),
    {
      getStandardsFiltersRequest: getStandardsFiltersRequestAction,
      setFilters: setFiltersAction,
      setTestId: setTestIdAction,
      setPrevStandardsFilters: setPrevStandardsFiltersAction,
    }
  )
)

export default enhance(StandardsFilters)
