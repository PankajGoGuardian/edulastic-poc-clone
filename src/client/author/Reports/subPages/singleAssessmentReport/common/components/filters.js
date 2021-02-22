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
import { Collapsable } from '../../../../common/components/widgets/Collapsable'
import AssessmentAutoComplete from '../../../../common/components/autocompletes/AssessmentAutoComplete'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import CourseAutoComplete from '../../../../common/components/autocompletes/CourseAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import ClassAutoComplete from '../../../../common/components/autocompletes/ClassAutoComplete'
import GroupsAutoComplete from '../../../../common/components/autocompletes/GroupsAutoComplete'
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
  getPerformanceBandProfile,
  getStandardManteryScale,
} from '../filterDataDucks'
import { getTestListSelector } from '../../../../ducks'
import {
  getUserRole,
  getUserOrgId,
  getUser,
} from '../../../../../src/selectors/user'
import { resetStudentFilters } from '../../../../common/util'
import TagFilter from '../../../../../src/components/common/TagFilter'
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
  selectedPerformanceBandProfile,
  selectedStandardManteryScale,
  toggleFilter,
  testList,
}) => {
  const assessmentTypeRef = useRef()

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
    const search = pickBy(
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
      // select common assessment as default if assessment type is not set for admins
      if (
        user.role === roleuser.DISTRICT_ADMIN ||
        user.role === roleuser.SCHOOL_ADMIN
      ) {
        search.assessmentTypes = search.assessmentTypes || 'common assessment'
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
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        assessmentTypes: search.assessmentTypes || '',
        tags: [],
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
    if (firstLoad && !selected.key) {
      toggleFilter(null, true)
      setFirstLoad(false)
      return
    }
    const _testId = selected.key || ''
    setFiltersOrTestId({ testId: _testId })
    if (reportId) {
      setFirstLoad(false)
    } else if (firstLoad && selected.key) {
      setFirstLoad(false)
      _onGoClick({
        filters: { ...filters },
        selectedTest: { key: _testId },
      })
    } else if (selected.key) {
      setShowApply(true)
    } else if (firstLoad) {
      setFirstLoad(false)
    }
  }

  const updateFilterDropdownCB = (selected, keyName, multiple = false) => {
    const _filters = { ...filters }
    resetStudentFilters(_filters, keyName, selected, multiple)
    _filters[keyName] = multiple ? selected : selected.key
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
    const _testId = keyName === 'tags' ? '' : testId
    setFiltersOrTestId({ filters: _filters, testId: _testId })
    setShowApply(true)
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
    <StyledFilterWrapper data-cy="filters" style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
        {showApply && !isEmpty(testList) && (
          <StyledGoButton data-cy="applyFilter" onClick={onGoClick}>
            APPLY
          </StyledGoButton>
        )}
      </GoButtonWrapper>
      <PerfectScrollbar>
        <Collapsable header="find the test" defaultActiveKey="0">
          <SearchField>
            <FilterLabel data-cy="schoolYear">School Year</FilterLabel>
            <ControlDropDown
              by={filters.termId}
              selectCB={(e) => updateFilterDropdownCB(e, 'termId')}
              data={schoolYear}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="testGrade">Test Grade</FilterLabel>
            <ControlDropDown
              by={filters.grade}
              selectCB={(e) => updateFilterDropdownCB(e, 'grade')}
              data={staticDropDownData.grades}
              prefix="Test Grade"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="testSubject">Test Subject</FilterLabel>
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
              dataCy="testTypes"
              label="Test Type"
              el={assessmentTypeRef}
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
          <SearchField>
            <FilterLabel data-cy="tags-select">Tags</FilterLabel>
            <TagFilter
              onChangeField={(type, value) =>
                updateFilterDropdownCB(
                  value.map(({ _id }) => _id),
                  type,
                  true
                )
              }
              selectedTagIds={filters.tags}
            />
          </SearchField>

          {prevSARFilterData && (
            <SearchField>
              <FilterLabel data-cy="test">Test</FilterLabel>
              <AssessmentAutoComplete
                firstLoad={firstLoad}
                termId={filters.termId}
                grade={filters.grade !== 'All' && filters.grade}
                tags={filters.tags}
                subject={filters.subject !== 'All' && filters.subject}
                testTypes={filters.assessmentTypes}
                selectedTestId={testId || getTestIdFromURL(location.pathname)}
                selectCB={updateTestId}
              />
            </SearchField>
          )}
        </Collapsable>
        <Collapsable header="class filter">
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
                  termId={filters.termId}
                  school={filters.schoolIds}
                  testId={testId}
                  selectedTeacherIds={
                    filters.teacherIds ? filters.teacherIds.split(',') : []
                  }
                  selectCB={(e) =>
                    updateFilterDropdownCB(e.join(','), 'teacherIds', true)
                  }
                />
              </SearchField>
            </>
          )}
          <SearchField>
            <FilterLabel data-cy="classGrade">Class Grade</FilterLabel>
            <ControlDropDown
              by={filters.studentGrade}
              selectCB={(e) => updateFilterDropdownCB(e, 'studentGrade')}
              data={staticDropDownData.grades}
              prefix="Grade"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="classSubject">Class Subject</FilterLabel>
            <ControlDropDown
              by={filters.studentSubject}
              selectCB={(e) => updateFilterDropdownCB(e, 'studentSubject')}
              data={staticDropDownData.subjects}
              prefix="Subject"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="course">Course</FilterLabel>
            <CourseAutoComplete
              selectedCourseId={
                filters.studentCourseId !== 'All' && filters.studentCourseId
              }
              selectCB={(e) => updateFilterDropdownCB(e, 'studentCourseId')}
            />
          </SearchField>
          <SearchField>
            <ClassAutoComplete
              termId={filters.termId}
              schoolIds={filters.schoolIds}
              teacherIds={filters.teacherIds}
              grade={filters.studentGrade !== 'All' && filters.studentGrade}
              subject={
                filters.studentSubject !== 'All' && filters.studentSubject
              }
              courseId={
                filters.studentCourseId !== 'All' && filters.studentCourseId
              }
              selectedClassIds={
                filters.classIds ? filters.classIds.split(',') : []
              }
              selectCB={(e) =>
                updateFilterDropdownCB(e.join(','), 'classIds', true)
              }
            />
          </SearchField>
          <SearchField>
            <GroupsAutoComplete
              termId={filters.termId}
              schoolIds={filters.schoolIds}
              teacherIds={filters.teacherIds}
              grade={filters.studentGrade !== 'All' && filters.studentGrade}
              subject={
                filters.studentSubject !== 'All' && filters.studentSubject
              }
              courseId={
                filters.studentCourseId !== 'All' && filters.studentCourseId
              }
              selectedGroupIds={
                filters.groupIds ? filters.groupIds.split(',') : []
              }
              selectCB={(e) =>
                updateFilterDropdownCB(e.join(','), 'groupIds', true)
              }
            />
          </SearchField>
        </Collapsable>
        {(isStandardProficiencyRequired || performanceBandRequired) && (
          <Collapsable header="performance">
            {isStandardProficiencyRequired && (
              <SearchField>
                <FilterLabel data-cy="standardProficiency">
                  Standard Proficiency
                </FilterLabel>
                <ControlDropDown
                  by={
                    filters.standardsProficiencyProfile ||
                    selectedStandardManteryScale?._id ||
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
                <FilterLabel data-cy="performanceBand">
                  Performance Band
                </FilterLabel>
                <ControlDropDown
                  by={{
                    key:
                      filters.performanceBandProfile ||
                      selectedPerformanceBandProfile?._id ||
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
      standardProficiencyProfiles:
        state?.standardsProficiencyReducer?.data || [],
      standardProficiencyLoading:
        state?.standardsProficiencyReducer?.loading || [],
      selectedPerformanceBandProfile: getPerformanceBandProfile(state),
      selectedStandardManteryScale: getStandardManteryScale(state),
      testList: getTestListSelector(state),
    }),
    {
      getSARFilterDataRequest: getSARFilterDataRequestAction,
      setFiltersOrTestId: setFiltersOrTestIdAction,
      setPrevSARFilterData: setPrevSARFilterDataAction,
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
