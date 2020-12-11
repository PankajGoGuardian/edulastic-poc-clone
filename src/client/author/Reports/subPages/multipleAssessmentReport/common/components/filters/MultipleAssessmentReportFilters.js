import React, { useEffect, useMemo, Fragment, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spin } from 'antd'

import { notification } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'

import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { Collapsable } from '../../../../../common/components/widgets/Collapsable'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import AssessmentsAutoComplete from './AssessmentAutoComplete'
import CourseAutoComplete from '../../../../../common/components/autocompletes/CourseAutoComplete'
import ClassAutoComplete from '../../../../../common/components/autocompletes/ClassAutoComplete'
import GroupsAutoComplete from '../../../../../common/components/autocompletes/GroupsAutoComplete'
import SchoolAutoComplete from '../../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../../common/components/autocompletes/TeacherAutoComplete'
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel,
} from '../../../../../common/styled'

import { processSchoolYear } from '../../utils/transformers'

import {
  getReportsMARFilterLoadingState,
  getMARFilterDataRequestAction,
  getReportsMARFilterData,
  getFiltersSelector,
  setFiltersAction,
  getTestIdSelector,
  setTestIdAction,
  getReportsPrevMARFilterData,
  setPrevMARFilterDataAction,
} from '../../filterDataDucks'
import { getUserRole, getUser } from '../../../../../../src/selectors/user'
import { resetStudentFilters } from '../../../../../common/util'

import staticDropDownData from '../../static/staticDropDownData.json'

const SingleAssessmentReportFilters = ({
  loading,
  MARFilterData,
  filters,
  testIds,
  user,
  role,
  style,
  getMARFilterDataRequest,
  setFilters: _setFilters,
  setTestId,
  onGoClick: _onGoClick,
  location,
  history,
  setPrevMARFilterData,
  prevMARFilterData,
  performanceBandRequired,
  extraFilter,
  showApply,
  setShowApply,
  firstLoad,
  setFirstLoad,
  reportId,
}) => {
  const assessmentTypesRef = useRef()
  const profiles = get(MARFilterData, 'data.result.bandInfo', [])

  const schoolYear = useMemo(() => {
    let _schoolYear = []
    const arr = get(user, 'orgData.terms', [])
    if (arr.length) {
      _schoolYear = arr.map((item) => ({ key: item._id, title: item.name }))
    }
    return _schoolYear
  })

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      getMARFilterDataRequest({ reportId })
      _setFilters({ ...filters, ...search })
      setTestId([])
    } else if (MARFilterData !== prevMARFilterData) {
      const termId =
        search.termId ||
        get(user, 'orgData.defaultTermId', '') ||
        (schoolYear.length ? schoolYear[0].key : '')
      const q = { ...search, termId }
      if (firstLoad && isEmpty(search)) {
        q.firstLoad = true
      }
      if (role === roleuser.SCHOOL_ADMIN) {
        q.schoolIds = get(user, 'institutionIds', []).join(',')
      }
      getMARFilterDataRequest(q)
    }
  }, [])

  if (MARFilterData !== prevMARFilterData && !isEmpty(MARFilterData)) {
    let search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      _onGoClick({ selectedTest: [], filters: { ...filters, ...search } })
      setFirstLoad(false)
    } else {
      // get saved filters from backend
      const savedFilters = get(MARFilterData, 'data.result.reportFilters')
      // select common assessment as default if assessment type is not set for admins
      if (
        user.role === roleuser.DISTRICT_ADMIN ||
        user.role === roleuser.SCHOOL_ADMIN
      ) {
        savedFilters.assessmentTypes =
          search.assessmentTypes ||
          (savedFilters.assessmentTypes &&
            savedFilters.assessmentTypes.join(',')) ||
          'common assessment'
      }
      if (firstLoad) {
        search = {
          termId: search.termId || savedFilters.termId,
          subject: search.subject || savedFilters.subject,
          grade: search.grade || savedFilters.grade,
          ...search,
        }
      }
      const defaultTermId = get(user, 'orgData.defaultTermId', '')
      const urlSchoolYear =
        schoolYear.find((item) => item.key === search.termId) ||
        schoolYear.find((item) => item.key === defaultTermId) ||
        (schoolYear[0] ? schoolYear[0] : { key: '', title: '' })
      const urlSubject = staticDropDownData.subjects.find(
        (item) => item.key === search.subject
      ) || {
        key: 'All',
        title: 'All Subjects',
      }
      const urlGrade = staticDropDownData.grades.find(
        (item) => item.key === search.grade
      ) || {
        key: 'All',
        title: 'All Grades',
      }
      const urlStudentSubject = staticDropDownData.subjects.find(
        (item) => item.key === search.studentSubject
      ) || {
        key: 'All',
        title: 'All Subjects',
      }
      const urlStudentGrade = staticDropDownData.grades.find(
        (item) => item.key === search.studentGrade
      ) || {
        key: 'All',
        title: 'All Grades',
      }

      const obtainedFilters = {
        termId: urlSchoolYear.key,
        subject: urlSubject.key,
        grade: urlGrade.key,
        studentSubject: urlStudentSubject.key,
        studentGrade: urlStudentGrade.key,
        studentCourseId: search.studentCourseId || 'All',
        courseId: search.courseId || 'All',
        classId: search.classId || 'All',
        groupId: search.groupId || 'All',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        assessmentTypes: search.assessmentTypes || '',
      }

      const urlParams = { ...obtainedFilters }

      if (role === roleuser.TEACHER) {
        delete urlParams.schoolIds
        delete urlParams.teacherIds
      }
      // set filters and testId
      _setFilters(urlParams)
      // TODO: enable selection of testIds from url and saved filters
      // const urlTestIds = search.testIds ? search.testIds.split(',') : []
      // setTestId(urlTestIds)
      setTestId([])
    }
    // update prevMARFilterData
    setPrevMARFilterData(MARFilterData)
  }

  const schoolYears = useMemo(() => processSchoolYear(user), [user])

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      selectedTest: testIds,
      ..._settings,
    }
    if (role === roleuser.SCHOOL_ADMIN) {
      settings.filters.schoolIds =
        settings.filters.schoolIds || get(user, 'institutionIds', []).join(',')
    }
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

  const onChangePerformanceBand = (selected) => {
    const _filters = {
      ...filters,
      profileId: selected.key,
    }
    setFilters(_filters)
  }

  const onSelectTest = (selectedTestIds) => {
    setTestId(selectedTestIds)
    if (reportId) {
      setFirstLoad(false)
    } else if (firstLoad) {
      setFirstLoad(false)
      _onGoClick({
        filters: { ...filters },
        selectedTest: selectedTestIds,
      })
    } else if (selectedTestIds.length) {
      setShowApply(true)
    } else {
      notification({ type: 'warn', msg: `Test selection should not be empty` })
    }
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
        <Collapsable header="find the assessment" defaultActiveKey="0">
          <SearchField>
            <FilterLabel>School Year</FilterLabel>
            <ControlDropDown
              by={filters.termId}
              selectCB={(e) => updateFilterDropdownCB(e, 'termId')}
              data={schoolYears}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Test Grade</FilterLabel>
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
            <FilterLabel>Test Subject</FilterLabel>
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
              label="Test Type"
              el={assessmentTypesRef}
              onChange={(e) =>
                updateFilterDropdownCB(e.join(','), 'assessmentTypes', true)
              }
              value={
                filters.assessmentTypes
                  ? filters.assessmentTypes.split(',')
                  : []
              }
              options={staticDropDownData.assessmentType.filter(
                (a) => a.key !== 'All'
              )}
            />
          </SearchField>
          {prevMARFilterData && (
            <SearchField>
              <AssessmentsAutoComplete
                filters={filters}
                firstLoad={firstLoad}
                termId={filters.termId}
                selectedTestIds={testIds}
                selectCB={onSelectTest}
              />
            </SearchField>
          )}
        </Collapsable>
        <Collapsable header="class filter">
          {role !== roleuser.TEACHER && (
            <>
              <SearchField>
                <SchoolAutoComplete
                  selectedSchoolIds={
                    filters.schoolIds ? filters.schoolIds.split(',') : []
                  }
                  selectCB={(e) =>
                    updateFilterDropdownCB(e.join(','), 'schoolIds', true)
                  }
                />
              </SearchField>
              <SearchField>
                <TeacherAutoComplete
                  selectedTeacherIds={
                    filters.teacherIds ? filters.teacherIds.split(',') : []
                  }
                  school={filters.schoolIds}
                  selectCB={(e) =>
                    updateFilterDropdownCB(e.join(','), 'teacherIds', true)
                  }
                />
              </SearchField>
            </>
          )}
          <SearchField>
            <FilterLabel>Grade</FilterLabel>
            <ControlDropDown
              prefix="Grade"
              className="custom-1-scrollbar"
              by={filters.studentGrade}
              selectCB={(e) => updateFilterDropdownCB(e, 'studentGrade')}
              data={staticDropDownData.grades}
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Subject</FilterLabel>
            <ControlDropDown
              by={filters.studentSubject}
              selectCB={(e) => updateFilterDropdownCB(e, 'studentSubject')}
              data={staticDropDownData.subjects}
              prefix="Subject"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Course</FilterLabel>
            <CourseAutoComplete
              selectedCourseId={
                filters.studentCourseId !== 'All' && filters.studentCourseId
              }
              selectCB={(e) => updateFilterDropdownCB(e, 'studentCourseId')}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Class</FilterLabel>
            <ClassAutoComplete
              filters={filters}
              selectCB={(e) => {
                updateFilterDropdownCB(e, 'classId')
              }}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Group</FilterLabel>
            <GroupsAutoComplete
              filters={filters}
              selectCB={(e) => {
                updateFilterDropdownCB(e, 'groupId')
              }}
            />
          </SearchField>
        </Collapsable>

        {performanceBandRequired && (
          <Collapsable header="performance">
            <SearchField>
              <FilterLabel>Performance Band</FilterLabel>
              <ControlDropDown
                by={{ key: filters.profileId }}
                selectCB={onChangePerformanceBand}
                data={profiles.map((p) => ({ key: p._id, title: p.name }))}
                prefix="Performance Band"
                showPrefixOnSelected={false}
              />
            </SearchField>
          </Collapsable>
        )}
        {!isEmpty(extraFilter) && (
          <Collapsable header="demographic">{extraFilter}</Collapsable>
        )}
      </PerfectScrollbar>
    </StyledFilterWrapper>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsMARFilterLoadingState(state),
      MARFilterData: getReportsMARFilterData(state),
      filters: getFiltersSelector(state),
      testIds: getTestIdSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      prevMARFilterData: getReportsPrevMARFilterData(state),
    }),
    {
      getMARFilterDataRequest: getMARFilterDataRequestAction,
      setFilters: setFiltersAction,
      setTestId: setTestIdAction,
      setPrevMARFilterData: setPrevMARFilterDataAction,
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
