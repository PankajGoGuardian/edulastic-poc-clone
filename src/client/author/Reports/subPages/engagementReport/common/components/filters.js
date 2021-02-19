import React, { useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spin } from 'antd'

import { roleuser } from '@edulastic/constants'

import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel,
} from '../../../../common/styled'

import {
  getReportsERFilterLoadingState,
  getERFilterDataRequestAction,
  getReportsERFilterData,
  getFiltersSelector,
  setFiltersAction,
  getReportsPrevERFilterData,
  setPrevERFilterDataAction,
} from '../filterDataDucks'
import { getUser } from '../../../../../src/selectors/user'

import { resetStudentFilters } from '../../../../common/util'
import { processSchoolYear } from '../../../multipleAssessmentReport/common/utils/transformers'

import staticDropDownData from '../static/staticDropDownData.json'

const EngagementReportFilters = ({
  style,
  loc,
  location,
  history,
  showApply,
  setShowApply,
  setFirstLoad,
  reportId,
  user,
  getERFilterDataRequest,
  loading,
  ERFilterData,
  prevERFilterData,
  setPrevERFilterData,
  filters,
  setFilters: _setFilters,
  onGoClick: _onGoClick,
}) => {
  const assessmentTypesRef = useRef()
  const role = get(user, 'role', '')
  const schoolYears = useMemo(() => processSchoolYear(user), [user])
  const defaultTermId = get(user, 'orgData.defaultTermId', '') || schoolYears[0]

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      getERFilterDataRequest({ reportId })
      _setFilters({ ...filters, ...search })
    } else if (ERFilterData !== prevERFilterData) {
      const termId = search.termId || defaultTermId
      const q = { ...search, termId }
      if (role === roleuser.SCHOOL_ADMIN) {
        q.schoolIds = get(user, 'institutionIds', []).join(',')
      }
      getERFilterDataRequest(q)
    }
  }, [])

  if (ERFilterData !== prevERFilterData && !isEmpty(ERFilterData)) {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      _onGoClick({ filters: { ...filters, ...search } })
    } else {
      const urlSchoolYear =
        schoolYears.find((item) => item.key === search.termId) ||
        schoolYears.find((item) => item.key === defaultTermId) ||
        (schoolYears[0] ? schoolYears[0] : { key: '', title: '' })
      const urlSubject =
        staticDropDownData.subjects.find(
          (item) => item.key === search.subject
        ) || staticDropDownData.subjects[0]
      const urlGrade =
        staticDropDownData.grades.find((item) => item.key === search.grade) ||
        staticDropDownData.grades[0]

      const _filters = {
        termId: urlSchoolYear.key,
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        subject: urlSubject.key,
        grade: urlGrade.key,
        assessmentTypes: search.assessmentTypes || '',
      }

      _setFilters(_filters)
      _onGoClick({ filters: { ..._filters } })
    }
    setFirstLoad(false)
    // update prevERFilterData
    setPrevERFilterData(ERFilterData)
  }

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      ..._settings,
    }
    setShowApply(false)
    _onGoClick(settings)
  }

  const setFilters = (_filters) => {
    setShowApply(true)
    _setFilters(_filters)
  }

  const updateFilterDropdownCB = (selected, keyName, multiple = false) => {
    const _filters = { ...filters }
    resetStudentFilters(_filters, keyName, selected, multiple)
    _filters[keyName] = multiple ? selected : selected.key
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    setFilters(_filters)
  }

  return loading ? (
    <StyledFilterWrapper style={style}>
      <Spin />
    </StyledFilterWrapper>
  ) : (
    <StyledFilterWrapper data-cy="filters" style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        {showApply && (
          <StyledGoButton data-cy="applyFilter" onClick={onGoClick}>APPLY</StyledGoButton>
        )}
      </GoButtonWrapper>
      <PerfectScrollbar>
        <SearchField>
          <FilterLabel data-cy="schoolYear">School Year</FilterLabel>
          <ControlDropDown
            by={filters.termId}
            selectCB={(e) => updateFilterDropdownCB(e, 'termId')}
            data={schoolYears}
            prefix="School Year"
            showPrefixOnSelected={false}
          />
        </SearchField>
        <SearchField>
          <SchoolAutoComplete
            dataCy="school"
            selectedSchoolIds={
              filters.schoolIds ? filters.schoolIds.split(',') : []
            }
            selectCB={(e) =>
              updateFilterDropdownCB(e.join(','), 'schoolIds', true)
            }
          />
        </SearchField>
        {loc === 'activity-by-teacher' && (
          <SearchField>
            <TeacherAutoComplete
              dataCy="teacher"
              termId={filters.termId}
              school={filters.schoolIds}
              selectedTeacherIds={
                filters.teacherIds ? filters.teacherIds.split(',') : []
              }
              selectCB={(e) =>
                updateFilterDropdownCB(e.join(','), 'teacherIds', true)
              }
            />
          </SearchField>
        )}
        <SearchField>
          <FilterLabel data-cy="classGrade">Grade</FilterLabel>
          <ControlDropDown
            prefix="Grade"
            className="custom-1-scrollbar"
            by={filters.grade}
            selectCB={(e) => updateFilterDropdownCB(e, 'grade')}
            data={staticDropDownData.grades}
            showPrefixOnSelected={false}
          />
        </SearchField>
        <SearchField>
          <FilterLabel data-cy="classSubject">Subject</FilterLabel>
          <ControlDropDown
            by={filters.subject}
            selectCB={(e) => updateFilterDropdownCB(e, 'subject')}
            data={staticDropDownData.subjects}
            prefix="Subject"
            showPrefixOnSelected={false}
          />
        </SearchField>
        <SearchField>
          <MultiSelectDropdown
            dataCy="testTypes"
            label="Test Type"
            el={assessmentTypesRef}
            onChange={(e) =>
              updateFilterDropdownCB(e.join(','), 'assessmentTypes', true)
            }
            value={
              filters.assessmentTypes && filters.assessmentTypes !== 'All'
                ? filters.assessmentTypes.split(',')
                : []
            }
            options={staticDropDownData.assessmentType.filter(
              (a) => a.key !== 'All'
            )}
          />
        </SearchField>
      </PerfectScrollbar>
    </StyledFilterWrapper>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      user: getUser(state),
      loading: getReportsERFilterLoadingState(state),
      ERFilterData: getReportsERFilterData(state),
      prevERFilterData: getReportsPrevERFilterData(state),
      filters: getFiltersSelector(state),
    }),
    {
      getERFilterDataRequest: getERFilterDataRequestAction,
      setPrevERFilterData: setPrevERFilterDataAction,
      setFilters: setFiltersAction,
    }
  )
)

export default enhance(EngagementReportFilters)
