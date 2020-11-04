import React, { useEffect, useMemo, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spin } from 'antd'

import { roleuser } from '@edulastic/constants'

import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import AssessmentAutoComplete from './AssessmentAutoComplete'
import SchoolAutoComplete from './SchoolAutoComplete'
import CourseAutoComplete from './CourseAutoComplete'
import TeacherAutoComplete from './TeacherAutoComplete'
import ClassAutoComplete from './ClassAutoComplete'
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
  getTestListLoadingSelector,
} from '../filterDataDucks'
import {
  getUserRole,
  getUserOrgId,
  getUser,
} from '../../../../../src/selectors/user'

import { receivePerformanceBandAction } from '../../../../../PerformanceBand/ducks'
import { receiveStandardsProficiencyAction } from '../../../../../StandardsProficiency/ducks'

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
  testListLoading,
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
}) => {
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
    if (SARFilterData !== prevSARFilterData) {
      const search = pickBy(
        qs.parse(location.search, { ignoreQueryPrefix: true }),
        (f) => f !== 'All' && !isEmpty(f)
      )
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
    let search = qs.parse(location.search, { ignoreQueryPrefix: true })
    search.testId = getTestIdFromURL(location.pathname)

    // get saved filters from backend
    const savedFilters = get(SARFilterData, 'data.result.reportFilters')
    // select common assessment as default if assessment type is not set for admins
    if (
      user.role === roleuser.DISTRICT_ADMIN ||
      user.role === roleuser.SCHOOL_ADMIN
    ) {
      search.assessmentType =
        search.assessmentType ||
        savedFilters.assessmentType ||
        'common assessment'
    }

    if (firstLoad) {
      search = {
        termId: savedFilters.termId,
        subject: savedFilters.subject,
        grade: savedFilters.grade,
        ...pickBy(search, (f) => f !== 'All' && !isEmpty(f)),
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
    const urlAssessmentType = staticDropDownData.assessmentType.find(
      (item) => item.key === search.assessmentType
    ) || {
      key: 'All',
      title: 'All Assignment Types',
    }
    const urlTestId = search.testId || ''

    const obtainedFilters = {
      termId: urlSchoolYear.key,
      subject: urlSubject.key,
      grade: urlGrade.key,
      courseId: search.courseId || 'All',
      classId: search.classId || 'All',
      groupId: search.groupId || 'All',
      schoolId: search.schoolId || 'All',
      teacherId: search.teacherId || 'All',
      assessmentType: urlAssessmentType.key,
    }
    const urlParams = { ...obtainedFilters }

    if (role === 'teacher') {
      delete urlParams.schoolId
      delete urlParams.teacherId
    }

    // set filters and testId
    setFiltersOrTestId({ filters: urlParams, testId: urlTestId })
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
    if (firstLoad) {
      setFirstLoad(false)
      _onGoClick({
        filters: { ...filters },
        selectedTest: { key: _testId },
      })
    } else {
      setShowApply(true)
    }
  }

  const updateFilterDropdownCB = (selected, keyName) => {
    const _filters = {
      ...filters,
      [keyName]: selected.key,
    }
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
    setFiltersOrTestId({ filters: _filters })
    // delay state change by 1 second
    // to wait for the testList to start loading
    setTimeout(() => setShowApply(true), 1000)
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
        {showApply && !testListLoading && (
          <StyledGoButton onClick={onGoClick}>APPLY</StyledGoButton>
        )}
      </GoButtonWrapper>
      <PerfectScrollbar>
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
        {prevSARFilterData && (
          <SearchField>
            <FilterLabel>Assessment</FilterLabel>
            <AssessmentAutoComplete
              firstLoad={firstLoad}
              termId={filters.termId}
              grade={filters.grade !== 'All' && filters.grade}
              subject={filters.subject !== 'All' && filters.subject}
              assessmentType={
                filters.assessmentType !== 'All' && filters.assessmentType
              }
              selectedTestId={testId || getTestIdFromURL(location.pathname)}
              selectCB={updateTestId}
            />
          </SearchField>
        )}
        <SearchField>
          <FilterLabel>Grade</FilterLabel>
          <ControlDropDown
            by={filters.grade}
            selectCB={(e) => updateFilterDropdownCB(e, 'grade')}
            data={staticDropDownData.grades}
            prefix="Grade"
            showPrefixOnSelected={false}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Subject</FilterLabel>
          <ControlDropDown
            by={filters.subject}
            selectCB={(e) => updateFilterDropdownCB(e, 'subject')}
            data={staticDropDownData.subjects}
            prefix="Subject"
            showPrefixOnSelected={false}
          />
        </SearchField>
        {role !== 'teacher' && (
          <>
            <SearchField>
              <FilterLabel>School</FilterLabel>
              <SchoolAutoComplete
                selectedSchoolId={
                  filters.schoolId !== 'All' && filters.schoolId
                }
                selectCB={(e) => updateFilterDropdownCB(e, 'schoolId')}
              />
            </SearchField>
            <SearchField>
              <FilterLabel>Teacher</FilterLabel>
              <TeacherAutoComplete
                selectedTeacherId={
                  filters.teacherId !== 'All' && filters.teacherId
                }
                selectCB={(e) => updateFilterDropdownCB(e, 'teacherId')}
              />
            </SearchField>
          </>
        )}
        <SearchField>
          <FilterLabel>Assessment Type</FilterLabel>
          <ControlDropDown
            by={filters.assessmentType}
            selectCB={(e) => updateFilterDropdownCB(e, 'assessmentType')}
            data={staticDropDownData.assessmentType}
            prefix="Assessment Type"
            showPrefixOnSelected={false}
          />
        </SearchField>
        {isStandardProficiencyRequired && (
          <SearchField>
            <FilterLabel>Standard Proficiency</FilterLabel>
            <ControlDropDown
              by={
                filters.standardsProficiencyProfile ||
                standardProficiencyProfiles[0]?._id
              }
              selectCB={(e) =>
                updateFilterDropdownCB(e, 'standardsProficiencyProfile', false)
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
        <SearchField>
          <FilterLabel>Course</FilterLabel>
          <CourseAutoComplete
            selectedCourseId={filters.courseId !== 'All' && filters.courseId}
            selectCB={(e) => updateFilterDropdownCB(e, 'courseId')}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Class</FilterLabel>
          <ClassAutoComplete
            grade={filters.grade !== 'All' && filters.grade}
            subject={filters.subject !== 'All' && filters.subject}
            school={filters.schoolId !== 'All' && filters.schoolId}
            selectedClass={selectedClass}
            selectCB={(e) => {
              updateSearchableFilter(e, 'classId', setSelectedClass)
            }}
          />
        </SearchField>
        <SearchField>
          <FilterLabel>Group</FilterLabel>
          <ClassAutoComplete
            type="custom"
            grade={filters.grade !== 'All' && filters.grade}
            subject={filters.subject !== 'All' && filters.subject}
            school={filters.schoolId !== 'All' && filters.schoolId}
            selectedClass={selectedGroup}
            selectCB={(e) => {
              updateSearchableFilter(e, 'groupId', setSelectedGroup)
            }}
          />
        </SearchField>
        {extraFilters}
      </PerfectScrollbar>
    </StyledFilterWrapper>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsSARFilterLoadingState(state),
      testListLoading: getTestListLoadingSelector(state),
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
      loadPerformanceBand: receivePerformanceBandAction,
      loadStandardProficiency: receiveStandardsProficiencyAction,
      setFiltersOrTestId: setFiltersOrTestIdAction,
      setPrevSARFilterData: setPrevSARFilterDataAction,
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
