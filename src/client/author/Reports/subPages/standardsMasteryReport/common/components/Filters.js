import React, { useState, useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, omit, pickBy, groupBy, reject } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col } from 'antd'

import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

import { reportGroupType } from '@edulastic/constants/const/report'
import FilterTags from '../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { MultipleSelect } from '../../../../common/components/widgets/MultipleSelect'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import AssessmentsAutoComplete from '../../../../common/components/autocompletes/AssessmentsAutoComplete'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import CourseAutoComplete from '../../../../common/components/autocompletes/CourseAutoComplete'
import ClassAutoComplete from '../../../../common/components/autocompletes/ClassAutoComplete'
import GroupsAutoComplete from '../../../../common/components/autocompletes/GroupsAutoComplete'
import { AutocompleteDropDown } from '../../../../common/components/widgets/autocompleteDropDown'
import TagFilter from '../../../../../src/components/common/TagFilter'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
  StyledEduButton,
  StyledDropDownContainer,
} from '../../../../common/styled'

import { resetStudentFilters, toggleItem } from '../../../../common/util'
import { processSchoolYear } from '../../../multipleAssessmentReport/common/utils/transformers'

import {
  getUser,
  getInterestedCurriculumsSelector,
  currentDistrictInstitutionIds,
  isPremiumUserSelector,
} from '../../../../../src/selectors/user'

import {
  getFiltersSelector,
  setFiltersAction,
  getStandardsFiltersRequestAction,
  getReportsStandardsFilters,
  getPrevStandardsFiltersSelector,
  setPrevStandardsFiltersAction,
  getReportsStandardsFiltersLoader,
} from '../filterDataDucks'
import { getReportsStandardsPerformanceSummary } from '../../standardsPerformance/ducks'
import { getReportsStandardsGradebook } from '../../standardsGradebook/ducks'
import { getReportsStandardsProgress } from '../../standardsProgress/ducks'

import staticDropDownData from '../static/json/staticDropDownData.json'
import { fetchUpdateTagsDataAction } from '../../../../ducks'
import {
  getArrayOfNonPremiumTestTypes,
  getArrayOfAllTestTypes,
} from '../../../../../../common/utils/testTypeUtils'

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)

const rubricsData = [
  {
    _id: '6019969a53e3edad44a47949',
    name: 'Two Point Rubric Short Response',
  },
  {
    _id: '6019969a53e3edad44a47945',
    name: '2Point Rubric Short Response',
  },
  {
    _id: '6019969a53e3edad44a4794c',
    name: 'Two Point Rubric Short Response.',
  },
]

const StandardsMasteryReportFilters = ({
  isPrinting,
  user,
  history,
  location,
  interestedCurriculums,
  loading,
  filters,
  setFilters,
  tempDdFilter,
  setTempDdFilter,
  tempTagsData,
  setTempTagsData,
  tagsData,
  setTagsData,
  demographicsRequired,
  onGoClick: _onGoClick,
  getStandardsFiltersRequest,
  standardsFilters,
  prevStandardsFilters,
  setPrevStandardsFilters,
  extraFilters,
  showApply,
  setShowApply,
  showFilter,
  toggleFilter,
  setFirstLoad,
  reportId,
  standardsPerformanceSummary,
  standardsGradebook,
  standardsProgress,
  loc,
  fetchUpdateTagsData,
  institutionIds,
  isPremium,
}) => {
  const availableAssessmentType = isPremium
    ? getArrayOfAllTestTypes()
    : getArrayOfNonPremiumTestTypes()
  const [activeTabKey, setActiveTabKey] = useState(
    staticDropDownData.filterSections.CLASS_FILTERS.key
  )
  const assessmentTypesRef = useRef()

  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) => demographicsRequired || !ddFilterTypes.includes(t.key)
  )

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

  // curate domainsData from page data
  const skillInfoOptions = {
    'standards-performance-summary': standardsPerformanceSummary,
    'standards-gradebook': standardsGradebook,
    'standards-progress': standardsProgress,
  }
  const skillInfo = get(skillInfoOptions[loc], 'data.result.skillInfo', [])
    .filter((o) => `${o.curriculumId}` === `${filters.curriculumId}`)
    .filter((o) =>
      filters.standardGrade && filters.standardGrade !== 'All'
        ? o.grades.includes(filters.standardGrade)
        : true
    )

  const domainGroup = groupBy(skillInfo, (o) => `${o.domainId}`)
  const allDomainIds = Object.keys(domainGroup).sort((a, b) =>
    a.localeCompare(b)
  )
  const domainsList = allDomainIds.map((domainId) => ({
    key: `${domainId}`,
    title: domainGroup[domainId][0].domain,
  }))
  const rubricsList = rubricsData.map(({ _id, name }) => ({
    key: `${_id}`,
    title: name,
  }))
  const selectedRubrics = (rubricsList || []).filter((o) =>
    filters.rubricIds?.includes(o.key)
  )
  const selectedDomains = (domainsList || []).filter((o) =>
    filters.domainIds?.includes(o.key)
  )
  const standardsList = skillInfo
    .filter((o) =>
      selectedDomains.length
        ? filters.domainIds.includes(`${o.domainId}`)
        : true
    )
    .sort((a, b) => a.domainId - b.domainId || a.standardId - b.standardId)
    .map((o) => ({
      key: `${o.standardId}`,
      title: o.standard,
    }))

  const standardIdFromPageData = useMemo(
    () =>
      loc === 'standards-progress'
        ? get(standardsProgress, 'data.result.standardId', '')
        : '',
    [loc, standardsProgress]
  )

  const search = useMemo(
    () =>
      pickBy(
        qs.parse(location.search, { ignoreQueryPrefix: true }),
        (f) => f !== 'All' && !isEmpty(f)
      ),
    [location.search]
  )

  useEffect(() => {
    if (reportId) {
      getStandardsFiltersRequest({ reportId })
      setFilters({ ...filters, ...search })
    } else {
      getStandardsFiltersRequest({})
    }
  }, [])

  const isTabRequired = (tabKey) => {
    switch (tabKey) {
      case staticDropDownData.filterSections.TEST_FILTERS.key:
        return true
      case staticDropDownData.filterSections.CLASS_FILTERS.key:
        return true
      case staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS.key:
        return demographicsRequired && !isEmpty(extraFilters)
      default:
        return false
    }
  }

  const resetForActiveTab = (tabKey) => {
    switch (tabKey) {
      case staticDropDownData.filterSections.STANDARD_FILTERS.key:
        setFilters({ ...filters, standardId: '' })
        setTempTagsData(omit(tempTagsData, 'standardId'))
        setTagsData(omit(tagsData, 'standardId'))
        break
      default: // do nothing
    }
  }

  useEffect(() => {
    if (showFilter && !isTabRequired(activeTabKey)) {
      resetForActiveTab(activeTabKey)
      setActiveTabKey(staticDropDownData.filterSections.CLASS_FILTERS.key)
    }
    if (loc !== 'standards-progress') {
      resetForActiveTab(staticDropDownData.filterSections.STANDARD_FILTERS.key)
    }
  }, [loc, showFilter])

  useEffect(() => {
    if (standardIdFromPageData) {
      const standardFromPageData = standardsList.find(
        (o) => o.key === standardIdFromPageData
      )
      setFilters({
        ...filters,
        standardId: standardIdFromPageData,
      })
      setTempTagsData({
        ...tempTagsData,
        standardId: standardFromPageData,
      })
      setTagsData({
        ...tagsData,
        standardId: standardFromPageData,
      })
    }
  }, [standardIdFromPageData])

  if (prevStandardsFilters !== standardsFilters && !isEmpty(standardsFilters)) {
    const source = location.state?.source
    if (reportId) {
      _onGoClick({
        filters: { ...filters, ...search },
        selectedTests: [],
        tagsData: {},
      })
    } else {
      // get saved filters from backend
      const savedFilters = pickBy(
        get(standardsFilters, 'data.result.reportFilters', {})
      )
      // update search filters from saved filters
      if (source === 'standard-reports') {
        Object.assign(search, {
          termId: search.termId || savedFilters.termId,
          grades: search.grades || savedFilters.grades,
          subjects: search.subjects || savedFilters.subjects,
          profileId: search.profileId || savedFilters.profileId,
        })
      }
      const urlSchoolYear =
        schoolYears.find((item) => item.key === search.termId) ||
        schoolYears.find((item) => item.key === defaultTermId) ||
        (schoolYears[0] ? schoolYears[0] : { key: '', title: '' })
      const urlSubjects = staticDropDownData.subjects.filter(
        (item) => search.subjects && search.subjects.includes(item.key)
      )
      const urlGrades = staticDropDownData.grades.filter(
        (item) => search.grades && search.grades.includes(item.key)
      )
      const urlTestSubjects = staticDropDownData.subjects.filter(
        (item) => search.testSubjects && search.testSubjects.includes(item.key)
      )
      const urlTestGrades = staticDropDownData.grades.filter(
        (item) => search.testGrades && search.testGrades.includes(item.key)
      )
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
      const urlAssignedBy =
        staticDropDownData.assignedBy.find(
          (a) => a.key === search.assignedBy
        ) || staticDropDownData.assignedBy[0]
      const _filters = {
        termId: urlSchoolYear.key,
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        grades: urlGrades.map((item) => item.key).join(',') || '',
        subjects: urlSubjects.map((item) => item.key).join(',') || '',
        courseId: search.courseId || 'All',
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',
        testGrades: urlTestGrades.map((item) => item.key).join(',') || '',
        testSubjects: urlTestSubjects.map((item) => item.key).join(',') || '',
        tagIds: search.tagIds || '',
        assessmentTypes: search.assessmentTypes || '',
        testIds: search.testIds || '',
        curriculumId: urlCurriculum.key || '',
        standardGrade: urlStandardGrade.key,
        profileId: urlStandardProficiency?.key || '',
        domainIds: [],
        rubricIds: [],
        standardId: search.standardId || '',
        assignedBy: urlAssignedBy.key,
      }
      if (role === roleuser.TEACHER) {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _tempTagsData = {
        termId: urlSchoolYear,
        grades: urlGrades,
        subjects: urlSubjects,
        testGrades: urlTestGrades,
        testSubjects: urlTestSubjects,
        assessmentTypes: availableAssessmentType.filter((a) =>
          assessmentTypesArr.includes(a.key)
        ),
        curriculumId: urlCurriculum,
        standardGrade: urlStandardGrade,
        profileId: urlStandardProficiency,
        assignedBy: urlAssignedBy,
      }
      // set tempTagsData, filters and testId
      setTempTagsData(_tempTagsData)
      setFilters(_filters)
      if (source === 'standard-reports') {
        setShowApply(true)
        toggleFilter(null, true)
      } else {
        _onGoClick({
          filters: { ..._filters },
          tagsData: { ..._tempTagsData },
        })
        fetchUpdateTagsData({
          tagIds: reject(_filters.tagIds?.split(','), isEmpty),
          testIds: reject(_filters.testIds?.split(','), isEmpty),
          schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          teacherIds: reject(_filters.teacherIds?.split(','), isEmpty),
          courseIds: reject([search.courseId], isEmpty),
          classIds: reject(_filters.classIds?.split(','), isEmpty),
          groupIds: reject(_filters.groupIds?.split(','), isEmpty),
          options: {
            termId: _filters.termId,
            schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          },
        })
      }
    }
    setFirstLoad(false)
    // update prevSMRFilterData
    setPrevStandardsFilters(standardsFilters)
  }

  // -----|-----|-----|-----| EVENT HANDLERS BEGIN |-----|-----|-----|----- //

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      tagsData: { ...tempTagsData },
      ..._settings,
    }
    if (role === roleuser.SCHOOL_ADMIN) {
      settings.filters.schoolIds =
        settings.filters.schoolIds || institutionIds.join(',')
    }
    setFilters({ ...filters, showApply: false })
    setShowApply(false)
    _onGoClick(settings)
    toggleFilter(null, false)
  }

  const updateFilterDropdownCB = (
    selected,
    keyName,
    multiple = false,
    isRowFilter = false
  ) => {
    // update tags data
    const _tempTagsData = { ...tempTagsData, [keyName]: selected }
    if (!multiple && (!selected.key || selected.key === 'All')) {
      delete _tempTagsData[keyName]
    }
    const _filters = { ...filters }
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    resetStudentFilters(_tempTagsData, _filters, keyName, _selected)
    if (keyName === 'curriculumId' && _filters.curriculumId !== _selected) {
      delete _tempTagsData.domainIds
      _filters.domainIds = []
    }
    setTempTagsData(_tempTagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    if (isRowFilter) {
      setFilters({ ..._filters, showApply: true })
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  const onMultiOptionSelect = (filter, filterName, optionsList) => {
    const _selectedIds = toggleItem(
      filters[filterName],
      filter.key
    ).filter((o) => optionsList.map((option) => option.key).includes(o))
    const selectedTagData = optionsList.filter((d) =>
      _selectedIds.includes(d.key)
    )
    const _tempTagsData = { ...tempTagsData }
    _tempTagsData[filterName] = selectedTagData
    const _filters = { ...filters, showApply: true }
    _filters[filterName] = _selectedIds
    setTempTagsData(_tempTagsData)
    setFilters(_filters)
  }

  const onMultiOptionChange = (selectedFilters, filterName) => {
    if (!selectedFilters?.length) {
      const _tempTagsData = { ...tempTagsData }
      _tempTagsData[filterName] = []
      const _filters = { ...filters, showApply: true }
      _filters[filterName] = []
      setTempTagsData(_tempTagsData)
      setFilters(_filters)
    }
  }

  const handleCloseTag = (type, { key }) => {
    const _tempTagsData = { ...tempTagsData }
    // handle tempDdFilters
    if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = staticDropDownData.initialDdFilters[type]
        delete _tempTagsData[type]
      }
      setTempDdFilter(_tempDdFilter)
    } else {
      const _filters = { ...filters }
      resetStudentFilters(_tempTagsData, _filters, type, '')
      // handle single selection filters
      if (filters[type] === key) {
        _filters[type] = staticDropDownData.initialFilters[type]
        delete _tempTagsData[type]
      }
      // handle multiple selection filters
      else if (filters[type].includes(key)) {
        _filters[type] = Array.isArray(filters[type])
          ? filters[type].filter((f) => f !== key)
          : filters[type]
              .split(',')
              .filter((d) => d !== key)
              .join(',')
        _tempTagsData[type] = tempTagsData[type].filter((d) => d.key !== key)
      }
      setFilters(_filters)
    }
    setTempTagsData(_tempTagsData)
    setShowApply(true)
    toggleFilter(null, true)
  }

  const handleTagClick = (filterKey) => {
    const tabKey =
      staticDropDownData.tagTypes.find((filter) => filter.key === filterKey)
        ?.tabKey || -1
    if (tabKey !== -1) {
      toggleFilter(null, true)
      setActiveTabKey(tabKey)
    }
  }

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //

  const standardProficiencyFilter = (
    <StyledDropDownContainer
      xs={24}
      sm={12}
      lg={6}
      autoFlex
      data-cy="standardProficiency"
    >
      <ControlDropDown
        by={filters.profileId || defaultStandardProficiency?.key || ''}
        selectCB={(e, selected) =>
          updateFilterDropdownCB(selected, 'profileId', false, true)
        }
        data={standardProficiencyList}
        prefix="Standard Proficiency"
        showPrefixOnSelected={false}
      />
    </StyledDropDownContainer>
  )

  return (
    <Row type="flex" gutter={[0, 5]} style={{ width: '100%' }}>
      <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
        <FilterTags
          isPrinting={isPrinting}
          visible={!reportId}
          tagsData={tagsData}
          tagTypes={tagTypes}
          handleCloseTag={handleCloseTag}
          handleTagClick={handleTagClick}
        />
        <ReportFiltersContainer visible={!reportId}>
          <StyledEduButton
            data-cy="filters"
            btnType="primary"
            isGhost={!showFilter}
            onClick={toggleFilter}
            style={{ height: '24px' }}
          >
            <IconFilter width={15} height={15} />
            FILTERS
          </StyledEduButton>
          <ReportFiltersWrapper visible={showFilter} loading={loading}>
            {loading && <Spin />}
            <Row className="report-filters-inner-wrapper">
              <Col span={24} style={{ padding: '0 5px' }}>
                <Tabs
                  animated={false}
                  activeKey={activeTabKey}
                  onChange={setActiveTabKey}
                >
                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.TEST_FILTERS.key}
                    tab={staticDropDownData.filterSections.TEST_FILTERS.title}
                    forceRender
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testGrade"
                          label="Test Grade"
                          onChange={(e) => {
                            const selected = staticDropDownData.grades.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(selected, 'testGrades', true)
                          }}
                          value={
                            filters.testGrades && filters.testGrades !== 'All'
                              ? filters.testGrades.split(',')
                              : []
                          }
                          options={staticDropDownData.grades}
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testSubject"
                          label="Test Subject"
                          onChange={(e) => {
                            const selected = staticDropDownData.subjects.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(
                              selected,
                              'testSubjects',
                              true
                            )
                          }}
                          value={
                            filters.testSubjects &&
                            filters.testSubjects !== 'All'
                              ? filters.testSubjects.split(',')
                              : []
                          }
                          options={staticDropDownData.subjects}
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testTypes"
                          label="Test Type"
                          el={assessmentTypesRef}
                          onChange={(e) => {
                            const selected = availableAssessmentType.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(
                              selected,
                              'assessmentTypes',
                              true
                            )
                          }}
                          value={
                            filters.assessmentTypes
                              ? filters.assessmentTypes.split(',')
                              : []
                          }
                          options={availableAssessmentType}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="tags-select">Tags</FilterLabel>
                        <TagFilter
                          onChangeField={(type, selected) => {
                            const _selected = selected.map(
                              ({ _id: key, tagName: title }) => ({
                                key,
                                title,
                              })
                            )
                            updateFilterDropdownCB(_selected, 'tagIds', true)
                          }}
                          selectedTagIds={
                            filters.tagIds ? filters.tagIds.split(',') : []
                          }
                        />
                      </Col>
                      <Col span={18}>
                        <AssessmentsAutoComplete
                          dataCy="tests"
                          termId={filters.termId}
                          grades={filters.testGrades}
                          subjects={filters.testSubjects}
                          tagIds={filters.tagIds}
                          testTypes={filters.assessmentTypes}
                          selectedTestIds={
                            filters.testIds ? filters.testIds.split(',') : []
                          }
                          selectCB={(e) =>
                            updateFilterDropdownCB(e, 'testIds', true)
                          }
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                    tab={staticDropDownData.filterSections.CLASS_FILTERS.title}
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      <Col span={6}>
                        <FilterLabel data-cy="assignedBy">
                          Assigned By
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.assignedBy}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'assignedBy')
                          }
                          data={staticDropDownData.assignedBy}
                          prefix="Assigned By"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="schoolYear">
                          School Year
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.termId}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'termId')
                          }
                          data={schoolYears}
                          prefix="School Year"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      {role !== roleuser.TEACHER && (
                        <>
                          <Col span={6}>
                            <SchoolAutoComplete
                              dataCy="schools"
                              selectedSchoolIds={
                                filters.schoolIds
                                  ? filters.schoolIds.split(',')
                                  : []
                              }
                              selectCB={(e) =>
                                updateFilterDropdownCB(e, 'schoolIds', true)
                              }
                            />
                          </Col>
                          <Col span={6}>
                            <TeacherAutoComplete
                              dataCy="teachers"
                              termId={filters.termId}
                              school={filters.schoolIds}
                              selectedTeacherIds={
                                filters.teacherIds
                                  ? filters.teacherIds.split(',')
                                  : []
                              }
                              selectCB={(e) =>
                                updateFilterDropdownCB(e, 'teacherIds', true)
                              }
                            />
                          </Col>
                        </>
                      )}
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="classGrade"
                          label="Class Grade"
                          onChange={(e) => {
                            const selected = staticDropDownData.grades.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(selected, 'grades', true)
                          }}
                          value={
                            filters.grades && filters.grades !== 'All'
                              ? filters.grades.split(',')
                              : []
                          }
                          options={staticDropDownData.grades}
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="classSubject"
                          label="Class Subject"
                          onChange={(e) => {
                            const selected = staticDropDownData.subjects.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(selected, 'subjects', true)
                          }}
                          value={
                            filters.subjects && filters.subjects !== 'All'
                              ? filters.subjects.split(',')
                              : []
                          }
                          options={staticDropDownData.subjects}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="course">Course</FilterLabel>
                        <CourseAutoComplete
                          selectedCourseId={filters.courseId}
                          selectCB={(e) =>
                            updateFilterDropdownCB(e, 'courseId')
                          }
                        />
                      </Col>
                      <Col span={6}>
                        <ClassAutoComplete
                          dataCy="classes"
                          termId={filters.termId}
                          schoolIds={filters.schoolIds}
                          teacherIds={filters.teacherIds}
                          grades={filters.grades}
                          subjects={filters.subjects}
                          courseId={
                            filters.courseId !== 'All' && filters.courseId
                          }
                          selectedClassIds={
                            filters.classIds ? filters.classIds.split(',') : []
                          }
                          selectCB={(e) =>
                            updateFilterDropdownCB(e, 'classIds', true)
                          }
                        />
                      </Col>
                      <Col span={6}>
                        <GroupsAutoComplete
                          dataCy="groups"
                          termId={filters.termId}
                          schoolIds={filters.schoolIds}
                          teacherIds={filters.teacherIds}
                          grades={filters.grades}
                          subjects={filters.subjects}
                          courseId={
                            filters.courseId !== 'All' && filters.courseId
                          }
                          selectedGroupIds={
                            filters.groupIds ? filters.groupIds.split(',') : []
                          }
                          selectCB={(e) =>
                            updateFilterDropdownCB(e, 'groupIds', true)
                          }
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>

                  {isTabRequired(
                    staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS.key
                  ) && (
                    <Tabs.TabPane
                      key={
                        staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS
                          .key
                      }
                      tab={
                        staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS
                          .title
                      }
                    >
                      <Row type="flex" gutter={[5, 10]}>
                        {extraFilters}
                      </Row>
                    </Tabs.TabPane>
                  )}
                </Tabs>
              </Col>
              <Col span={24} style={{ display: 'flex', paddingTop: '20px' }}>
                <StyledEduButton
                  width="25%"
                  height="40px"
                  style={{ maxWidth: '200px' }}
                  isGhost
                  key="cancelButton"
                  data-cy="cancelFilter"
                  onClick={(e) => toggleFilter(e, false)}
                >
                  Cancel
                </StyledEduButton>
                <StyledEduButton
                  width="25%"
                  height="40px"
                  style={{ maxWidth: '200px' }}
                  key="applyButton"
                  data-cy="applyFilter"
                  disabled={!showApply}
                  onClick={() => onGoClick()}
                >
                  Apply
                </StyledEduButton>
              </Col>
            </Row>
          </ReportFiltersWrapper>
        </ReportFiltersContainer>
      </Col>
      <Col span={24}>
        <Row
          type="flex"
          gutter={[5, 10]}
          justify="end"
          align="middle"
          style={{
            paddingLeft: '10px',
            width: '75%',
            float: 'right',
            paddingTop: '5px',
            display: reportId ? 'none' : 'flex',
          }}
        >
          {loc === 'performance-by-rubric-criteria' ? (
            <StyledDropDownContainer
              xs={24}
              sm={12}
              lg={6}
              autoFlex
              data-cy="rubric-criteria"
              style={{ maxWidth: '300px' }}
            >
              <MultipleSelect
                containerClassName="rubric-criteria"
                data={rubricsList || []}
                valueToDisplay={
                  selectedRubrics.length > 1
                    ? { key: '', title: 'Multiple Rubrics' }
                    : selectedRubrics
                }
                by={selectedRubrics}
                prefix="Rubric Criteria"
                onSelect={(selected) => {
                  onMultiOptionSelect(selected, 'rubricIds', rubricsList)
                }}
                onChange={(selected) => {
                  onMultiOptionChange(selected, 'rubricIds')
                }}
                placeholder="All Rubrics"
                style={{ height: 'auto' }}
              />
            </StyledDropDownContainer>
          ) : (
            <>
              <StyledDropDownContainer
                xs={24}
                sm={12}
                lg={6}
                autoFlex
                data-cy="standardSet"
              >
                <ControlDropDown
                  by={filters.curriculumId}
                  selectCB={(e, selected) =>
                    updateFilterDropdownCB(
                      selected,
                      'curriculumId',
                      false,
                      true
                    )
                  }
                  data={curriculumsList}
                  prefix="Standard Set"
                  showPrefixOnSelected={false}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer
                xs={24}
                sm={12}
                lg={6}
                autoFlex
                data-cy="standardGrade"
              >
                <ControlDropDown
                  by={filters.standardGrade}
                  selectCB={(e, selected) =>
                    updateFilterDropdownCB(
                      selected,
                      'standardGrade',
                      false,
                      true
                    )
                  }
                  data={staticDropDownData.allGrades}
                  prefix="Standard Grade"
                  showPrefixOnSelected={false}
                />
              </StyledDropDownContainer>
              {loc !== 'standards-progress' && standardProficiencyFilter}
              <StyledDropDownContainer
                xs={24}
                sm={12}
                lg={6}
                autoFlex
                data-cy="domain"
              >
                <MultipleSelect
                  containerClassName="standards-mastery-report-domain-autocomplete"
                  data={domainsList || []}
                  valueToDisplay={
                    selectedDomains.length > 1
                      ? { key: '', title: 'Multiple Domains' }
                      : selectedDomains
                  }
                  by={selectedDomains}
                  prefix="Domains"
                  onSelect={(selected) => {
                    onMultiOptionSelect(selected, 'domainIds', domainsList)
                  }}
                  onChange={(selected) => {
                    onMultiOptionChange(selected, 'domainIds')
                  }}
                  placeholder="All Domains"
                  style={{ minWidth: '80px', width: '100%', height: 'auto' }}
                />
              </StyledDropDownContainer>
              {loc === 'standards-progress' && (
                <StyledDropDownContainer
                  xs={24}
                  sm={12}
                  lg={6}
                  autoFlex
                  data-cy="standard"
                >
                  <AutocompleteDropDown
                    prefix="Standard"
                    by={
                      // filters.standardId is searched in standardsList
                      // to make sure standardId passed via url also sets the correct standard
                      standardsList.find(
                        (o) => `${o.key}` === `${filters.standardId}`
                      ) ||
                      standardsList[0] || { key: '', title: '' }
                    }
                    selectCB={(selected) => {
                      updateFilterDropdownCB(
                        selected,
                        'standardId',
                        false,
                        true
                      )
                    }}
                    data={standardsList}
                  />
                </StyledDropDownContainer>
              )}
              {loc === 'standards-progress' && standardProficiencyFilter}
            </>
          )}
          {filters.showApply && (
            <StyledEduButton
              btnType="primary"
              data-cy="applyRowFilter"
              onClick={() => onGoClick()}
              style={{ height: '32px' }}
            >
              APPLY
            </StyledEduButton>
          )}
        </Row>
      </Col>
    </Row>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsStandardsFiltersLoader(state),
      standardsFilters: getReportsStandardsFilters(state),
      filters: getFiltersSelector(state),
      user: getUser(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      prevStandardsFilters: getPrevStandardsFiltersSelector(state),
      standardsPerformanceSummary: getReportsStandardsPerformanceSummary(state),
      standardsGradebook: getReportsStandardsGradebook(state),
      standardsProgress: getReportsStandardsProgress(state),
      institutionIds: currentDistrictInstitutionIds(state),
      isPremium: isPremiumUserSelector(state),
    }),
    {
      getStandardsFiltersRequest: getStandardsFiltersRequestAction,
      setFilters: setFiltersAction,
      setPrevStandardsFilters: setPrevStandardsFiltersAction,
      fetchUpdateTagsData: (opts) =>
        fetchUpdateTagsDataAction({
          type: reportGroupType.STANDARDS_MASTERY_REPORT,
          ...opts,
        }),
    }
  )
)

export default enhance(StandardsMasteryReportFilters)
