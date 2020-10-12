import React, { useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, keyBy, uniqBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Select, Spin } from 'antd'
import { SelectInputStyled } from '@edulastic/common'

import { roleuser } from '@edulastic/constants'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { MultipleSelect } from '../../../../common/components/widgets/MultipleSelect'
import { toggleItem } from '../../../../common/util'

import {
  getUserRole,
  getUser,
  getInterestedCurriculumsSelector,
  getInterestedGradesSelector,
} from '../../../../../src/selectors/user'

import {
  getFiltersSelector,
  getTestIdSelector,
  setFiltersAction,
  setTestIdAction,
  getStandardsBrowseStandardsRequestAction,
  getReportsStandardsBrowseStandards,
  getStandardsFiltersRequestAction,
  getReportsStandardsFilters,
  getPrevBrowseStandardsSelector,
  getPrevStandardsFiltersSelector,
  setPrevBrowseStandardsAction,
  setPrevStandardsFiltersAction,
  getReportsStandardsFiltersLoader,
} from '../filterDataDucks'

import filtersDropDownData from '../static/json/filtersDropDownData.json'
import { getDomains } from '../utils'
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel,
} from '../../../../common/styled'

const DropdownFilters = ({ dataCy, onChange, value = '', options = [] }) => (
  <SelectInputStyled
    data-cy={dataCy}
    onChange={onChange}
    value={`${value}`}
    optionFilterProp="children"
    getPopupContainer={(triggerNode) => triggerNode.parentNode}
    fontSize="11px"
    arrowFontSize="11px"
    height="34px"
    padding="8px 18px"
    noBorder
    style={{ border: '1px solid #e5e5e5' }}
  >
    {options.map((data) => (
      <Select.Option key={`${data.key}`} value={`${data.key}`}>
        {data.title}
      </Select.Option>
    ))}
  </SelectInputStyled>
)

const StandardsFilters = ({
  loading,
  filters,
  testIds,
  standardsFilters,
  browseStandards,
  user,
  interestedCurriculums,
  interestedGrades,
  getStandardsBrowseStandardsRequest,
  getStandardsFiltersRequest,
  setFilters: _setFilters,
  setTestId: _setTestId,
  onGoClick: _onGoClick,
  setShowApply,
  location,
  style,
  setPrevBrowseStandards,
  setPrevStandardsFilters,
  prevBrowseStandards,
  prevStandardsFilters,
  extraFilter,
  loc: _loc,
  role,
  showApply,
}) => {
  const browseStandardsReceiveCount = useRef(0)
  const standardsFilteresReceiveCount = useRef(0)

  const schoolYear = useMemo(() => {
    let _schoolYear = []
    const arr = get(user, 'orgData.terms', [])
    if (arr.length) {
      _schoolYear = arr.map((item) => ({ key: item._id, title: item.name }))
    }
    return _schoolYear
  }, [user])

  const curriculums = useMemo(() => {
    let _curriculums = []
    if (interestedCurriculums.length) {
      _curriculums = interestedCurriculums.map((item) => ({
        key: item._id,
        title: item.name,
      }))
    }
    return _curriculums
  }, [interestedCurriculums])

  // get initial filters from url and orgData
  const getInitialFilters = () => {
    const search = qs.parse(location.search.substring(1))
    const defaultTermId =
      filters?.termId || get(user, 'orgData.defaultTermId', '')
    const urlSchoolYear =
      schoolYear.find((item) => item.key === search.termId) ||
      schoolYear.find((item) => item.key === defaultTermId) ||
      (schoolYear[0] ? schoolYear[0] : { key: '', title: '' })
    const urlSubject =
      curriculums.find((item) => item.key === search.subject) ||
      (curriculums[0] ? curriculums[0] : { key: '', title: '' })
    const gradesKeys = keyBy(search.grades || interestedGrades)
    let urlGrade = filtersDropDownData.grades.filter(
      (item) => gradesKeys[item.key]
    )
    if (!urlGrade.length) {
      urlGrade = [filtersDropDownData.grades[0]]
    }
    return {
      ...filters,
      termId: urlSchoolYear.key,
      subject: urlSubject.key,
      grades: urlGrade.map((item) => item.key),
    }
  }

  useEffect(() => {
    const _filters = getInitialFilters()
    _setFilters(_filters)
    // fetch standards the first time report filters are loaded
    if (browseStandards !== prevBrowseStandards) {
      const q = {
        curriculumId: _filters.subject || undefined,
        grades: _filters.grades,
      }
      getStandardsBrowseStandardsRequest(q)
    }
    // fetch filters data each time report filters are loaded
    const _q = {
      termId: _filters.termId,
    }
    if (get(user, 'role', '') === roleuser.SCHOOL_ADMIN) {
      Object.assign(_q, {
        schoolIds: get(user, 'institutionIds', []).join(','),
      })
    }
    getStandardsFiltersRequest(_q)
  }, [])

  useEffect(() => {
    if (isEmpty(standardsFilters?.filters)) {
      _setFilters({
        ...filters,
        termId: filters.termId || get(user, 'orgData.defaultTermId', ''),
      })
    }
  }, [standardsFilters])

  const scaleInfo = get(standardsFilters, 'scaleInfo', [])

  const domains = useMemo(() => {
    let _domains = [{ key: 'All', title: 'All Domains' }]
    if (browseStandards && !isEmpty(browseStandards)) {
      let tempArr = get(browseStandards, 'data.result', [])

      let arr = []
      if (tempArr.length) {
        tempArr = getDomains(tempArr)
        arr = tempArr.map((item) => ({
          key: item.tloId,
          title: item.tloIdentifier,
        }))
      }
      _domains = _domains.concat(arr)
    }
    return _domains
  }, [browseStandards])

  if (browseStandards !== prevBrowseStandards && !isEmpty(browseStandards)) {
    setPrevBrowseStandards(browseStandards)
    // check if domainId in url is in the array if not select the first one
    const urlDomainId = domains.length > 1 ? domains.slice(1) : domains
    const _filters = {
      ...filters,
      domainIds: urlDomainId.map((item) => item.key).join(),
    }
    _setFilters(_filters)
    browseStandardsReceiveCount.current++
  }

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
    // allTestIds Received
    setPrevStandardsFilters(standardsFilters)
    if (standardsFilteresReceiveCount.current === 0) {
      const search = qs.parse(location.search.substring(1))
      // filters fetched on page load
      const onLoadFilters = get(standardsFilters, 'filters', [])
      const onLoadTestIds = get(standardsFilters, 'testIds')
      // check if testIds in url are valid (present in the array)
      const urlTestIds = onLoadTestIds || search.testIds || []
      const validTestIds = allTestIds.filter((test) =>
        urlTestIds.includes(test.key)
      )
      _setTestId(validTestIds)
      // checks to check if saved filters match the default
      const shouldUpdateSchoolYear =
        onLoadFilters.termId && onLoadFilters.termId !== filters.termId
      const shouldUpdateDomains =
        (onLoadFilters.subject && onLoadFilters.subject !== filters.subject) ||
        (onLoadFilters.grades?.[0] &&
          onLoadFilters.grades?.[0] !== filters.grades?.[0])
      // settings to fetch the page data
      const settings = {
        filters: { ...filters, ...onLoadFilters },
        selectedTest: validTestIds,
      }
      _setFilters({ ...filters, ...onLoadFilters })
      // update standards filters for mismatch of saved filters
      if (shouldUpdateSchoolYear) {
        const q = { termId: onLoadFilters.termId }
        if (get(user, 'role', '') === roleuser.SCHOOL_ADMIN) {
          Object.assign(q, {
            schoolIds: get(user, 'institutionIds', []).join(','),
          })
        }
        getStandardsFiltersRequest(q)
      }
      if (shouldUpdateDomains) {
        const q = {
          curriculumId: onLoadFilters.subject,
          grades: onLoadFilters.grades,
        }
        getStandardsBrowseStandardsRequest(q)
      }
      // load page data
      if (browseStandardsReceiveCount.current > 0) {
        _onGoClick(settings)
      }
    }
    standardsFilteresReceiveCount.current++
  }

  // -----|-----|-----|-----| EVENT HANDLERS BEGIN |-----|-----|-----|----- //
  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: testIds,
    }
    setShowApply(false)
    _onGoClick(settings)
  }

  const setFilters = (_filters) => {
    setShowApply(true)
    _setFilters(_filters)
  }

  const setTestId = (_testId) => {
    setShowApply(true)
    _setTestId(_testId)
  }

  const updateSchoolYearDropDownCB = (selected) => {
    const obj = {
      ...filters,
      termId: selected.key,
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

  const updateSubjectDropDownCB = (selected) => {
    const obj = {
      ...filters,
      subject: selected,
    }
    setFilters(obj)
    const q = {
      curriculumId: selected || undefined,
      grades: obj.grades,
    }
    getStandardsBrowseStandardsRequest(q)
  }

  const updateGradeDropDownCB = (selected) => {
    const obj = {
      ...filters,
      grades: [selected],
    }
    setFilters(obj)
    const q = {
      curriculumId: obj.subject || curriculums[0]?.key || undefined,
      grades: [selected],
    }
    getStandardsBrowseStandardsRequest(q)
  }

  const updateStandardProficiencyDropDownCB = (selected) => {
    const obj = {
      ...filters,
      profileId: selected.key,
    }
    setFilters(obj)
  }

  const updateDomainDropDownCB = (selected) => {
    if (selected === 'All') {
      const tempArr = domains.slice(1).map((item) => item.key)
      const obj = {
        ...filters,
        domainIds: tempArr.join(),
      }
      setFilters(obj)
    } else {
      const obj = {
        ...filters,
        domainIds: selected,
      }
      setFilters(obj)
    }
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

  const selectedProficiencyId = useMemo(
    () => scaleInfo.find((s) => s.default)?._id || '',
    [scaleInfo]
  )
  const standardProficiencyList = useMemo(
    () => scaleInfo.map((s) => ({ key: s._id, title: s.name })),
    [scaleInfo]
  )

  const selectedDomain =
    domains
      .slice(1)
      .map((item) => item.key)
      .join() === filters.domainIds
      ? 'All'
      : filters.domainIds

  const testNameFilter = (
    <SearchField>
      <FilterLabel>Assessment Name</FilterLabel>
      <MultipleSelect
        containerClassName="standards-gradebook-domain-autocomplete"
        data={(allTestIds || []).map((t) => ({
          ...t,
          title: `${t.title} (ID: ${t.key?.substring(t.key.length - 5) || ''})`,
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
  )
  const domainFilter = (
    <SearchField>
      <FilterLabel>Domain</FilterLabel>
      <DropdownFilters
        value={selectedDomain || domains[0]?.key}
        onChange={updateDomainDropDownCB}
        options={domains}
      />
    </SearchField>
  )
  const stdProficiencyFilter = (
    <SearchField>
      <FilterLabel>Standard Proficiency</FilterLabel>
      <ControlDropDown
        by={filters.profileId || selectedProficiencyId}
        selectCB={updateStandardProficiencyDropDownCB}
        data={standardProficiencyList}
        prefix="Standard Proficiency"
        showPrefixOnSelected={false}
      />
    </SearchField>
  )
  const withTestName = [...extraFilter]
  // Re ordering the filters as per requirment
  if (_loc === 'standards-gradebook') {
    withTestName.unshift(testNameFilter, domainFilter, stdProficiencyFilter)
  } else if (_loc === 'standards-performance-summary') {
    const roleBasedPlaceMent = roleuser.DA_SA_ROLE_ARRAY.includes(role) ? 2 : 0
    withTestName.splice(roleBasedPlaceMent, 0, testNameFilter, domainFilter)
    withTestName.push(stdProficiencyFilter)
  } else {
    withTestName.push(testNameFilter, domainFilter, stdProficiencyFilter)
  }
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
          <DropdownFilters
            className="custom-1-scrollbar"
            value={filters.grades[0]}
            onChange={updateGradeDropDownCB}
            options={filtersDropDownData.grades}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Subject</FilterLabel>
          <DropdownFilters
            value={filters.subject || curriculums[0]?.key}
            onChange={updateSubjectDropDownCB}
            options={curriculums}
          />
        </SearchField>
        {withTestName}
      </PerfectScrollbar>
    </StyledFilterWrapper>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsStandardsFiltersLoader(state),
      browseStandards: getReportsStandardsBrowseStandards(state),
      standardsFilters: getReportsStandardsFilters(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state) || [],
      role: getUserRole(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      prevBrowseStandards: getPrevBrowseStandardsSelector(state),
      prevStandardsFilters: getPrevStandardsFiltersSelector(state),
    }),
    {
      getStandardsBrowseStandardsRequest: getStandardsBrowseStandardsRequestAction,
      getStandardsFiltersRequest: getStandardsFiltersRequestAction,
      setFilters: setFiltersAction,
      setTestId: setTestIdAction,
      setPrevBrowseStandards: setPrevBrowseStandardsAction,
      setPrevStandardsFilters: setPrevStandardsFiltersAction,
    }
  )
)

export default enhance(StandardsFilters)
