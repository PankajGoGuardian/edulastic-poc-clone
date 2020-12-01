import React, { useEffect, useMemo, useState, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spin } from 'antd'
import { roleuser } from '@edulastic/constants'

import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import { Collapsable } from '../../../../common/components/widgets/Collapsable'
import AssessmentAutoComplete from './AssessmentAutoComplete'
import SchoolAutoComplete from './SchoolAutoComplete'
import CourseAutoComplete from './CourseAutoComplete'
import TeacherAutoComplete from './TeacherAutoComplete'
import ClassAutoComplete from './ClassAutoComplete'
import GroupsAutoComplete from './GroupsAutoComplete'
import {
  StyledFilterWrapper,
  StyledGoButton,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel,
} from '../../../../common/styled'

import {
  getReportsSARFilterLoadingState,
  getSARFilterDataRequestAction,
  getReportsSARFilterData,
  getFiltersAndTestIdSelector,
  setFiltersOrTestIdAction,
  getReportsPrevSARFilterData,
  setPrevSARFilterDataAction,
} from '../filterDataDucks'
import {
  getUserRole,
  getUserOrgId,
  getUser,
} from '../../../../../src/selectors/user'

import staticDropDownData from '../static/staticDropDownData.json'

const getTestIdFromURL = (url) => {
  if (url.length > 16) {
    const _url = url.substring(16)
    const index = _url.indexOf('test/')
    if (index >= 0) {
      const testId = _url.substring(index + 5)
      return testId
    }
  }
  return ''
}

const SingleAssessmentReportFilters = ({
  loading,
  SARFilterData,
  user,
  role,
  getSARFilterDataRequest,
  filtersAndTestId: { filters, testId },
  setFiltersOrTestId,
  onGoClick: _onGoClick,
  location,
  style,
  history,
  setPrevSARFilterData,
  prevSARFilterData,
  performanceBandRequired,
  isStandardProficiencyRequired = false,
  extraFilters,
  showApply,
  setShowApply,
  firstLoad,
  setFirstLoad,
  reportId,
}) => {
  const assessmentTypeRef = useRef()
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)

  const performanceBandProfiles = get(SARFilterData, 'data.result.bandInfo', [])
  const standardProficiencyProfiles = get(
    SARFilterData,
    'data.result.scaleInfo',
    []
  )

  const defaultTermId = get(user, 'orgData.defaultTermId', '')
  const schoolYear = useMemo(() => {
    let schoolYears = []
    const arr = get(user, 'orgData.terms', [])
    if (arr.length) {
      schoolYears = arr.map((item) => ({ key: item._id, title: item.name }))
    }
    return schoolYears
  }, [user])

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      getSARFilterDataRequest({ reportId })
      const _testId = getTestIdFromURL(location.pathname)
      setFiltersOrTestId({
        filters: { ...filters, ...search },
        testId: _testId,
      })
    } else if (SARFilterData !== prevSARFilterData) {
      const termId =
        search.termId ||
        defaultTermId ||
        (schoolYear.length ? schoolYear[0].key : '')
      const q = { ...search, termId }
      if (firstLoad && isEmpty(search)) {
        q.firstLoad = true
      }
      getSARFilterDataRequest(q)
    }
  }, [])

  if (SARFilterData !== prevSARFilterData && !isEmpty(SARFilterData)) {
    let search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    const _testId = getTestIdFromURL(location.pathname)
    if (reportId) {
      _onGoClick({
        filters: { ...filters, ...search },
        selectedTest: { key: _testId },
      })
      setShowApply(false)
    } else {
      // get saved filters from backend
      const savedFilters = get(SARFilterData, 'data.result.reportFilters')
      // select common assessment as default if assessment type is not set for admins
      if (
        user.role === roleuser.DISTRICT_ADMIN ||
        user.role === roleuser.SCHOOL_ADMIN
      ) {
        search.assessmentTypes =
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
      const urlTestId = _testId || ''
      const obtainedFilters = {
        termId: urlSchoolYear.key,
        subject: urlSubject.key,
        grade: urlGrade.key,
        courseId: search.courseId || 'All',
        classId: search.classId || 'All',
        groupId: search.groupId || 'All',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        assessmentTypes: search.assessmentTypes || 'common assessment',
      }
      const urlParams = { ...obtainedFilters }

      if (role === 'teacher') {
        delete urlParams.schoolIds
        delete urlParams.teacherIds
      }

      // set filters and testId
      setFiltersOrTestId({ filters: urlParams, testId: urlTestId })
    }
    // update prevSARFilterData
    setPrevSARFilterData(SARFilterData)
  }

  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: { key: testId },
    }
    setShowApply(false)
    _onGoClick(settings)
  }

  const getNewPathname = () => {
    const splitted = location.pathname.split('/')
    splitted.splice(splitted.length - 1)
    return `${splitted.join('/')}/`
  }

  const updateTestId = (selected) => {
    const _testId = selected.key || ''
    setFiltersOrTestId({ testId: _testId })
    if (reportId) {
      setFirstLoad(false)
    } else if (firstLoad) {
      setFirstLoad(false)
      _onGoClick({
        filters: { ...filters },
        selectedTest: { key: _testId },
      })
    } else {
      setShowApply(true)
    }
  }

  const updateFilterDropdownCB = (selected, keyName, multiple = false) => {
    const _filters = {
      ...filters,
      [keyName]: multiple ? selected : selected.key,
    }
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
    setFiltersOrTestId({ filters: _filters })
    setShowApply(true)
  }

  const updateSearchableFilter = (selected, id, callback) => {
    updateFilterDropdownCB(selected, id)
    callback(selected)
  }

  const standardProficiencyList = useMemo(
    () =>
      standardProficiencyProfiles.map((s) => ({ key: s._id, title: s.name })),
    [standardProficiencyProfiles]
  )
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
        <Collapsable header="find the test" defaultActiveKey="0">
          <SearchField>
            <FilterLabel>School Year</FilterLabel>
            <ControlDropDown
              by={filters.termId}
              selectCB={(e) => updateFilterDropdownCB(e, 'termId')}
              data={schoolYear}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Test Grade</FilterLabel>
            <ControlDropDown
              by={filters.grade}
              selectCB={(e) => updateFilterDropdownCB(e, 'grade')}
              data={staticDropDownData.grades}
              prefix="Test Grade"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Test Subject</FilterLabel>
            <ControlDropDown
              by={filters.subject}
              selectCB={(e) => updateFilterDropdownCB(e, 'subject')}
              data={staticDropDownData.subjects}
              prefix="Test Subject"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <MultiSelectDropdown
              label="Test Type"
              el={assessmentTypeRef}
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
          {prevSARFilterData && (
            <SearchField>
              <FilterLabel>Test</FilterLabel>
              <AssessmentAutoComplete
                filters={filters}
                firstLoad={firstLoad}
                termId={filters.termId}
                selectedTestId={testId || getTestIdFromURL(location.pathname)}
                selectCB={updateTestId}
              />
            </SearchField>
          )}
        </Collapsable>
        <Collapsable header="student filter">
          {role !== 'teacher' && (
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
              by={filters.studentGrade}
              selectCB={(e) => updateFilterDropdownCB(e, 'studentGrade')}
              data={staticDropDownData.grades}
              prefix="Grade"
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
              selectedClass={selectedClass}
              selectCB={(e) => {
                updateSearchableFilter(e, 'classId', setSelectedClass)
              }}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Group</FilterLabel>
            <GroupsAutoComplete
              filters={filters}
              selectedGroup={selectedGroup}
              selectCB={(e) => {
                updateSearchableFilter(e, 'groupId', setSelectedGroup)
              }}
            />
          </SearchField>
        </Collapsable>
        {(isStandardProficiencyRequired || performanceBandRequired) && (
          <Collapsable header="performance">
            {isStandardProficiencyRequired && (
              <SearchField>
                <FilterLabel>Standard Proficiency</FilterLabel>
                <ControlDropDown
                  by={
                    filters.standardsProficiencyProfile ||
                    standardProficiencyProfiles[0]?._id
                  }
                  selectCB={(e) =>
                    updateFilterDropdownCB(
                      e,
                      'standardsProficiencyProfile',
                      false
                    )
                  }
                  data={standardProficiencyList}
                  prefix="Standard Proficiency"
                  showPrefixOnSelected={false}
                />
              </SearchField>
            )}
            {performanceBandRequired && (
              <SearchField>
                <FilterLabel>Performance Band </FilterLabel>
                <ControlDropDown
                  by={{
                    key:
                      filters.performanceBandProfile ||
                      performanceBandProfiles[0]?._id,
                  }}
                  selectCB={(e) =>
                    updateFilterDropdownCB(e, 'performanceBandProfile', false)
                  }
                  data={performanceBandProfiles.map((profile) => ({
                    key: profile._id,
                    title: profile.name,
                  }))}
                  prefix="Performance Band"
                  showPrefixOnSelected={false}
                />
              </SearchField>
            )}
          </Collapsable>
        )}
        {!isEmpty(extraFilters) && (
          <Collapsable header="demographic">{extraFilters}</Collapsable>
        )}
      </PerfectScrollbar>
    </StyledFilterWrapper>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsSARFilterLoadingState(state),
      SARFilterData: getReportsSARFilterData(state),
      filtersAndTestId: getFiltersAndTestIdSelector(state),
      role: getUserRole(state),
      districtId: getUserOrgId(state),
      user: getUser(state),
      prevSARFilterData: getReportsPrevSARFilterData(state),
      performanceBandProfiles: state?.performanceBandReducer?.profiles || [],
      performanceBandLoading: state?.performanceBandReducer?.loading || false,
      standardProficiencyProfiles:
        state?.standardsProficiencyReducer?.data || [],
      standardProficiencyLoading:
        state?.standardsProficiencyReducer?.loading || [],
    }),
    {
      getSARFilterDataRequest: getSARFilterDataRequestAction,
      setFiltersOrTestId: setFiltersOrTestIdAction,
      setPrevSARFilterData: setPrevSARFilterDataAction,
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
