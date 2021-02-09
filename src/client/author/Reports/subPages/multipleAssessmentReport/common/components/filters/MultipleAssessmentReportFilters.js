import React, { useEffect, useMemo, Fragment, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spin } from 'antd'

import { roleuser } from '@edulastic/constants'

import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { Collapsable } from '../../../../../common/components/widgets/Collapsable'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import AssessmentsAutoComplete from '../../../../../common/components/autocompletes/AssessmentsAutoComplete'
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
  tagsData,
  user,
  role,
  style,
  getMARFilterDataRequest,
  setFilters,
  setTestIds,
  setTagsData,
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
  const performanceBandProfiles = get(MARFilterData, 'data.result.bandInfo', [])
  const performanceBandList = useMemo(
    () => performanceBandProfiles.map((p) => ({ key: p._id, title: p.name })),
    [performanceBandProfiles]
  )
  const schoolYears = useMemo(() => processSchoolYear(user), [user])
  const defaultTermId = get(user, 'orgData.defaultTermId', '')

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      getMARFilterDataRequest({ reportId })
      setFilters({ ...filters, ...search })
      setTestIds([])
    } else if (MARFilterData !== prevMARFilterData) {
      const termId =
        search.termId ||
        defaultTermId ||
        (schoolYears.length ? schoolYears[0].key : '')
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
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      _onGoClick({ selectedTests: [], filters: { ...filters, ...search } })
    } else {
      // select common assessment as default if assessment type is not set for admins
      if (
        user.role === roleuser.DISTRICT_ADMIN ||
        user.role === roleuser.SCHOOL_ADMIN
      ) {
        search.assessmentTypes = search.assessmentTypes || 'common assessment'
      }
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
      const urlStudentSubject =
        staticDropDownData.subjects.find(
          (item) => item.key === search.studentSubject
        ) || staticDropDownData.subjects[0]
      const urlStudentGrade =
        staticDropDownData.grades.find(
          (item) => item.key === search.studentGrade
        ) || staticDropDownData.grades[0]
      const urlPerformanceBand =
        performanceBandList.find((item) => item.key === search.profileId) ||
        performanceBandList[0]

      const _filters = {
        termId: urlSchoolYear.key,
        subject: urlSubject.key,
        grade: urlGrade.key,
        assessmentTypes: search.assessmentTypes || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        studentSubject: urlStudentSubject.key,
        studentGrade: urlStudentGrade.key,
        studentCourseId: search.studentCourseId || 'All',
        classId: search.classId || '',
        groupId: search.groupId || '',
        profileId: urlPerformanceBand?.key || '',
      }
      if (role === roleuser.TEACHER) {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      if (role === roleuser.SCHOOL_ADMIN) {
        _filters.schoolIds =
          _filters.schoolIds || get(user, 'institutionIds', []).join(',')
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
        profileId: urlPerformanceBand,
      }

      // set tagsData, filters and testId
      setTagsData(_tagsData)
      setFilters(_filters)
      // TODO: enable selection of testIds from url and saved filters
      // const urlTestIds = search.testIds ? search.testIds.split(',') : []
      // setTestIds(urlTestIds)
      setTestIds([])
      _onGoClick({
        filters: { ..._filters },
        selectedTests: [],
      })
    }
    setFirstLoad(false)
    // update prevMARFilterData
    setPrevMARFilterData(MARFilterData)
  }

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      selectedTests: testIds,
      ..._settings,
    }
    _onGoClick(settings)
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
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    setFilters(_filters)
    setShowApply(true)
  }

  const onSelectTest = (selected) => {
    setTagsData({ ...tagsData, testIds: selected })
    setTestIds(selected.map((o) => o.key))
    setShowApply(true)
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
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'termId')
              }
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
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'grade')
              }
              data={staticDropDownData.grades}
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Test Subject</FilterLabel>
            <ControlDropDown
              by={filters.subject}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'subject')
              }
              data={staticDropDownData.subjects}
              prefix="Subject"
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <MultiSelectDropdown
              label="Test Type"
              el={assessmentTypesRef}
              onChange={(e) => {
                const selected = staticDropDownData.assessmentType.filter((a) =>
                  e.includes(a.key)
                )
                updateFilterDropdownCB(selected, 'assessmentTypes', true)
              }}
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
                firstLoad={firstLoad}
                termId={filters.termId}
                grade={filters.grade !== 'All' && filters.grade}
                subject={filters.subject !== 'All' && filters.subject}
                testTypes={filters.assessmentTypes}
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
                  selectCB={(e) => updateFilterDropdownCB(e, 'schoolIds', true)}
                />
              </SearchField>
              <SearchField>
                <TeacherAutoComplete
                  termId={filters.termId}
                  school={filters.schoolIds}
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
            <FilterLabel>Class Grade</FilterLabel>
            <ControlDropDown
              prefix="Grade"
              className="custom-1-scrollbar"
              by={filters.studentGrade}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'studentGrade')
              }
              data={staticDropDownData.grades}
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Class Subject</FilterLabel>
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
            <FilterLabel>Course</FilterLabel>
            <CourseAutoComplete
              selectedCourseId={filters.studentCourseId}
              selectCB={(e) => updateFilterDropdownCB(e, 'studentCourseId')}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Class</FilterLabel>
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
            <FilterLabel>Group</FilterLabel>
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
        {performanceBandRequired && (
          <Collapsable header="performance">
            <SearchField>
              <FilterLabel>Performance Band</FilterLabel>
              <ControlDropDown
                by={{ key: filters.profileId }}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'profileId')
                }
                data={performanceBandList}
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
      setTestIds: setTestIdAction,
      setPrevMARFilterData: setPrevMARFilterDataAction,
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
