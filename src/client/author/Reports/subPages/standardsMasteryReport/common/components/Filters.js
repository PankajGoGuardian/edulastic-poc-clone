import React, { useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { capitalize, get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spin } from 'antd'

import { roleuser } from '@edulastic/constants'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import { Collapsable } from '../../../../common/components/widgets/Collapsable'
import AssessmentsAutoComplete from '../../../../common/components/autocompletes/AssessmentsAutoComplete'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import CourseAutoComplete from '../../../../common/components/autocompletes/CourseAutoComplete'
import ClassAutoComplete from '../../../../common/components/autocompletes/ClassAutoComplete'
import GroupsAutoComplete from '../../../../common/components/autocompletes/GroupsAutoComplete'

import { resetStudentFilters } from '../../../../common/util'
import { processSchoolYear } from '../../../multipleAssessmentReport/common/utils/transformers'

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

import staticDropDownData from '../static/json/staticDropDownData.json'
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
  history,
  location,
  style,
  interestedGrades,
  interestedCurriculums,
  loading,
  filters,
  setFilters,
  testIds,
  setTestIds,
  tagsData,
  setTagsData,
  onGoClick: _onGoClick,
  getStandardsFiltersRequest,
  standardsFilters,
  prevStandardsFilters,
  setPrevStandardsFilters,
  extraFilters,
  showApply,
  setShowApply,
  setFirstLoad,
  reportId,
}) => {
  const assessmentTypesRef = useRef()
  const role = get(user, 'role', '')
  const scaleInfo = get(standardsFilters, 'data.result.scaleInfo', [])
  const standardProficiencyList = useMemo(
    () =>
      scaleInfo.map((s) => ({ key: s._id, title: s.name, default: s.default })),
    [scaleInfo]
  )
  const defaultStandardProficiency =
    standardProficiencyList.find((s) => s.default) || standardProficiencyList[0]
  const schoolYears = useMemo(() => processSchoolYear(user), [user])
  const defaultTermId = get(user, 'orgData.defaultTermId', '')
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

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      getStandardsFiltersRequest({ reportId })
      setFilters({ ...filters, ...search })
      setTestIds([])
    } else {
      getStandardsFiltersRequest({})
    }
  }, [])

  if (prevStandardsFilters !== standardsFilters && !isEmpty(standardsFilters)) {
    let search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      _onGoClick({
        filters: { ...filters, ...search },
        selectedTests: [],
      })
    } else {
      // get saved filters from backend
      const savedFilters = pickBy(
        get(standardsFilters, 'data.result.reportFilters', {})
      )
      // update search filters from saved filters
      search = {
        ...search,
        termId: search.termId || savedFilters.termId,
        grade: search.grade || savedFilters.grade,
        subject: search.subject || savedFilters.subject,
        profileId: search.profileId || savedFilters.profileId,
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
        staticDropDownData.grades.find(
          (item) => item.key === (search.grade || interestedGrades[0])
        ) || staticDropDownData.grades[0]
      const urlTestSubject =
        staticDropDownData.subjects.find(
          (item) => item.key === search.testSubject
        ) || staticDropDownData.subjects[0]
      const urlTestGrade =
        staticDropDownData.allGrades.find(
          (item) => item.key === search.testGrade
        ) || staticDropDownData.allGrades[0]
      const urlCurriculum =
        curriculumsList.find((item) => item.key === search.curriculumId) ||
        curriculumsList[0]
      const urlStandardGrade =
        staticDropDownData.allGrades.find(
          (item) => item.key === search.standardGrade
        ) || staticDropDownData.allGrades[0]
      const urlStandardProficiency =
        standardProficiencyList.find((item) => item.key === search.profileId) ||
        defaultStandardProficiency

      const _filters = {
        termId: urlSchoolYear.key,
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        grade: urlGrade.key,
        subject: urlSubject.key,
        courseId: search.courseId || 'All',
        classId: search.classId || 'All',
        groupId: search.groupId || 'All',
        testGrade: urlTestGrade.key,
        testSubject: urlTestSubject.key,
        assessmentTypes: search.assessmentTypes || '',
        curriculumId: urlCurriculum.key || '',
        standardGrade: urlStandardGrade.key,
        profileId: urlStandardProficiency?.key || '',
        domainIds: [],
        standardId: search.standardId || '',
        showApply: false,
      }
      if (role === roleuser.TEACHER) {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _tagsData = {
        termId: urlSchoolYear,
        grade: urlGrade,
        subject: urlSubject,
        testGrade: urlTestGrade,
        testSubject: urlTestSubject,
        assessmentTypes: staticDropDownData.assessmentType.filter((a) =>
          assessmentTypesArr.includes(a.key)
        ),
        curriculumId: urlCurriculum,
        standardGrade: urlStandardGrade,
        profileId: urlStandardProficiency,
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
    // update prevSMRFilterData
    setPrevStandardsFilters(standardsFilters)
  }

  // -----|-----|-----|-----| EVENT HANDLERS BEGIN |-----|-----|-----|----- //

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      selectedTests: testIds,
      ..._settings,
    }
    if (role === roleuser.SCHOOL_ADMIN) {
      settings.filters.schoolIds =
        settings.filters.schoolIds || get(user, 'institutionIds', []).join(',')
    }
    setShowApply(false)
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
    const filterKey = ['grade', 'subject'].includes(keyName)
      ? `student${capitalize(keyName)}`
      : keyName
    resetStudentFilters(_tagsData, _filters, filterKey, _selected)
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

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //

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
        <Collapsable header="Find student" defaultActiveKey="0">
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
              by={filters.grade}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'grade')
              }
              data={staticDropDownData.grades}
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Class Subject</FilterLabel>
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
            <FilterLabel>Course</FilterLabel>
            <CourseAutoComplete
              selectedCourseId={filters.courseId}
              selectCB={(e) => updateFilterDropdownCB(e, 'courseId')}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Class</FilterLabel>
            <ClassAutoComplete
              termId={filters.termId}
              schoolIds={filters.schoolIds}
              teacherIds={filters.teacherIds}
              grade={filters.grade !== 'All' && filters.grade}
              subject={filters.subject !== 'All' && filters.subject}
              courseId={filters.courseId !== 'All' && filters.courseId}
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
              grade={filters.grade !== 'All' && filters.grade}
              subject={filters.subject !== 'All' && filters.subject}
              courseId={filters.courseId !== 'All' && filters.courseId}
              selectCB={(e) => {
                updateFilterDropdownCB(e, 'groupId')
              }}
              selectedGroupId={filters.groupId}
            />
          </SearchField>
        </Collapsable>
        <Collapsable header="Filter by test">
          <SearchField>
            <FilterLabel>Test Grade</FilterLabel>
            <ControlDropDown
              prefix="Grade"
              by={filters.testGrade}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'testGrade')
              }
              data={staticDropDownData.allGrades}
              showPrefixOnSelected={false}
            />
          </SearchField>
          <SearchField>
            <FilterLabel>Test Subject</FilterLabel>
            <ControlDropDown
              by={filters.testSubject}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'testSubject')
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
          <SearchField>
            <AssessmentsAutoComplete
              termId={filters.termId}
              grade={filters.testGrade !== 'All' && filters.testGrade}
              subject={filters.testSubject !== 'All' && filters.testSubject}
              testTypes={filters.assessmentTypes}
              selectedTestIds={testIds}
              selectCB={onSelectTest}
            />
          </SearchField>
        </Collapsable>
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
      setTestIds: setTestIdAction,
      setPrevStandardsFilters: setPrevStandardsFiltersAction,
    }
  )
)

export default enhance(StandardsFilters)
