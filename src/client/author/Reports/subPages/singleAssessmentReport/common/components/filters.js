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
  getStandardMasteryScale,
} from '../filterDataDucks'
import {
  getUserRole,
  getUserOrgId,
  getUser,
} from '../../../../../src/selectors/user'
import { resetStudentFilters } from '../../../../common/util'

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
  tagsData,
  setTagsData,
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
  assessmentPerformanceBandProfile,
  assessmentStandardMasteryScale,
  toggleFilter,
}) => {
  const assessmentTypeRef = useRef()

  const performanceBandProfiles = get(SARFilterData, 'data.result.bandInfo', [])
  const performanceBandList = useMemo(
    () =>
      performanceBandProfiles.map((profile) => ({
        key: profile._id,
        title: profile.name,
      })),
    [performanceBandProfiles]
  )
  const standardProficiencyProfiles = get(
    SARFilterData,
    'data.result.scaleInfo',
    []
  )
  const standardProficiencyList = useMemo(
    () =>
      standardProficiencyProfiles.map((s) => ({ key: s._id, title: s.name })),
    [standardProficiencyProfiles]
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

  const selectedPerformanceBand =
    performanceBandList.find((p) => p.key === filters.performanceBandProfile) ||
    performanceBandList.find(
      (p) => p.key === assessmentPerformanceBandProfile?._id
    ) ||
    performanceBandList[0]

  const selectedStandardProficiency =
    standardProficiencyList.find(
      (p) => p.key === filters.standardsProficiencyProfile
    ) ||
    standardProficiencyList.find(
      (p) => p.key === assessmentStandardMasteryScale?._id
    ) ||
    standardProficiencyList[0]

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

  /**
   * if performanceBandProfile / standardsProficiencyProfile is not selected
   * performance band / standards mastery is fetched from the assessment (page data api)
   * this behaviour is kept dynamic for any selected test (apply button is not shown)
   * until the user manually selects a performance band / standards proficiency
   * however, filter tags need to reflect these dynamic changes
   * hence, the useEffect only updates tagsData for now
   */
  useEffect(() => {
    const _tagsData = {
      ...tagsData,
      performanceBandProfile: selectedPerformanceBand,
      standardsProficiencyProfile: selectedStandardProficiency,
    }
    setTagsData(_tagsData)
  }, [assessmentPerformanceBandProfile, assessmentStandardMasteryScale])

  if (SARFilterData !== prevSARFilterData && !isEmpty(SARFilterData)) {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    const _testId = getTestIdFromURL(location.pathname) || ''
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
      const urlSubject =
        staticDropDownData.subjects.find(
          (item) => item.key === search.subject
        ) || staticDropDownData.subjects[0]
      const urlGrade =
        staticDropDownData.grades.find((item) => item.key === search.grade) ||
        staticDropDownData.grades[0]
      const urlStudentSubject =
        staticDropDownData.subjects.find(
          (item) => item.key === search.studentSubject
        ) || staticDropDownData.subjects[0]
      const urlStudentGrade =
        staticDropDownData.grades.find(
          (item) => item.key === search.studentGrade
        ) || staticDropDownData.grades[0]
      const urlStandardProficiency = standardProficiencyList.find(
        (item) => item.key === search.standardsProficiencyProfile
      )
      const urlPerformanceBand = performanceBandList.find(
        (item) => item.key === search.performanceBandProfile
      )

      const _filters = {
        termId: urlSchoolYear.key,
        grade: urlGrade.key,
        subject: urlSubject.key,
        assessmentTypes: search.assessmentTypes || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        studentGrade: urlStudentGrade.key,
        studentSubject: urlStudentSubject.key,
        studentCourseId: search.studentCourseId || 'All',
        classId: search.classId || '',
        groupId: search.groupId || '',
        standardsProficiencyProfile: urlStandardProficiency?.key || '',
        performanceBandProfile: urlPerformanceBand?.key || '',
      }
      if (role === 'teacher') {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _tagsData = {
        termId: urlSchoolYear,
        subject: urlSubject,
        grade: urlGrade,
        assessmentTypes: staticDropDownData.assessmentType.filter((a) =>
          assessmentTypesArr.includes(a.key)
        ),
        studentSubject: urlStudentSubject,
        studentGrade: urlStudentGrade,
        standardsProficiencyProfile: urlStandardProficiency,
        performanceBandProfile: urlPerformanceBand,
      }
      // set tagsData, filters and testId
      setTagsData(_tagsData)
      setFiltersOrTestId({ filters: _filters, testId: _testId })
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
    const _tagsData = { ...tagsData, testId: selected }
    if (firstLoad && !selected.key) {
      delete _tagsData.testId
      toggleFilter(null, true)
      setFirstLoad(false)
      return
    }
    setTagsData(_tagsData)
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
    // update tags data
    const _tagsData = { ...tagsData, [keyName]: selected }
    if (!multiple && (!selected.key || selected.key === 'All')) {
      delete _tagsData[keyName]
    }
    const _filters = { ...filters }
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    resetStudentFilters(_tagsData, _filters, keyName, _selected)
    setTagsData(_tagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
    setFiltersOrTestId({ filters: _filters, testId })
    setShowApply(true)
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
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'termId')
              }
              data={schoolYear}
              prefix="School Year"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="testGrade">Test Grade</FilterLabel>
            <ControlDropDown
              by={filters.grade}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'grade')
              }
              data={staticDropDownData.grades}
              prefix="Test Grade"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="testSubject">Test Subject</FilterLabel>
            <ControlDropDown
              by={filters.subject}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'subject')
              }
              data={staticDropDownData.subjects}
              prefix="Test Subject"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <MultiSelectDropdown
              data-cy="testType"
              label="Test Type"
              el={assessmentTypeRef}
              onChange={(e) => {
                const selected = staticDropDownData.assessmentType.filter((a) =>
                  e.includes(a.key)
                )
                updateFilterDropdownCB(selected, 'assessmentTypes', true)
              }}
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
          {prevSARFilterData && (
            <SearchField>
              <FilterLabel data-cy="test">Test</FilterLabel>
              <AssessmentAutoComplete
                firstLoad={firstLoad}
                termId={filters.termId}
                grade={filters.grade !== 'All' && filters.grade}
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
                  selectCB={(e) => updateFilterDropdownCB(e, 'schoolIds', true)}
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
                    updateFilterDropdownCB(e, 'teacherIds', true)
                  }
                />
              </SearchField>
            </>
          )}
          <SearchField>
            <FilterLabel data-cy="classGrade">Class Grade</FilterLabel>
            <ControlDropDown
              by={filters.studentGrade}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'studentGrade')
              }
              data={staticDropDownData.grades}
              prefix="Grade"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="classSubject">Class Subject</FilterLabel>
            <ControlDropDown
              by={filters.studentSubject}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'studentSubject')
              }
              data={staticDropDownData.subjects}
              prefix="Subject"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="course">Course</FilterLabel>
            <CourseAutoComplete
              selectedCourseId={filters.studentCourseId}
              selectCB={(e) => updateFilterDropdownCB(e, 'studentCourseId')}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="classTitle">Class</FilterLabel>
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
              selectCB={(e) => {
                updateFilterDropdownCB(e, 'classId')
              }}
              selectedClassId={filters.classId}
            />
          </SearchField>
          <SearchField>
            <FilterLabel data-cy="group">Group</FilterLabel>
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
              selectCB={(e) => {
                updateFilterDropdownCB(e, 'groupId')
              }}
              selectedGroupId={filters.groupId}
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
                  by={selectedStandardProficiency.key}
                  selectCB={(e, selected) =>
                    updateFilterDropdownCB(
                      selected,
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
                  by={selectedPerformanceBand}
                  selectCB={(e, selected) =>
                    updateFilterDropdownCB(
                      selected,
                      'performanceBandProfile',
                      false
                    )
                  }
                  data={performanceBandList}
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
      assessmentPerformanceBandProfile: getPerformanceBandProfile(state),
      assessmentStandardMasteryScale: getStandardMasteryScale(state),
    }),
    {
      getSARFilterDataRequest: getSARFilterDataRequestAction,
      setFiltersOrTestId: setFiltersOrTestIdAction,
      setPrevSARFilterData: setPrevSARFilterDataAction,
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
