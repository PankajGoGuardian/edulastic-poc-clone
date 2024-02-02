import React, { useState, useEffect, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pick, pickBy, reject } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col, Icon } from 'antd'

import { roleuser, testTypes as testTypesConstants } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'

import { reportGroupType } from '@edulastic/constants/const/report'
import FilterTags from '../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import AssessmentAutoComplete from '../../../../common/components/autocompletes/AssessmentAutoComplete'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import CourseAutoComplete from '../../../../common/components/autocompletes/CourseAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import ClassAutoComplete from '../../../../common/components/autocompletes/ClassAutoComplete'
import GroupsAutoComplete from '../../../../common/components/autocompletes/GroupsAutoComplete'
import TagFilter from '../../../../../src/components/common/TagFilter'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
  StyledEduButton,
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
  fetchUpdateTagsDataAction,
  getTestListSelector,
} from '../../../../ducks'
import {
  getUserRole,
  getUserOrgId,
  getUser,
} from '../../../../../src/selectors/user'
import { resetStudentFilters } from '../../../../common/util'
import staticDropDownData from '../static/staticDropDownData.json'
import { getArrayOfAllTestTypes } from '../../../../../../common/utils/testTypeUtils'

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)

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
  loc,
  isCliUser,
  isPrinting,
  loading,
  SARFilterData,
  user,
  role,
  getSARFilterDataRequest,
  filtersAndTestId: { filters, testId },
  setFiltersOrTestId,
  tempDdFilter,
  setTempDdFilter,
  tempTagsData,
  setTempTagsData,
  tagsData,
  setTagsData,
  onGoClick: _onGoClick,
  location,
  history,
  setPrevSARFilterData,
  prevSARFilterData,
  performanceBandRequired,
  standardProficiencyRequired,
  demographicsRequired,
  extraFilters,
  showApply,
  setShowApply,
  firstLoad,
  setFirstLoad,
  reportId,
  assessmentPerformanceBandProfile,
  assessmentStandardMasteryScale,
  showFilter,
  toggleFilter,
  testList,
  fetchUpdateTagsData,
  pickAddionalFilters,
  isGptBoxVisible,
  setIsGptBoxVisible,
}) => {
  const { DEFAULT_ADMIN_TEST_TYPE_MAP_FILTER } = testTypesConstants
  const availableAssessmentType = getArrayOfAllTestTypes()
  const [activeTabKey, setActiveTabKey] = useState(
    staticDropDownData.filterSections.TEST_FILTERS.key
  )

  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'performanceBandProfile') &&
      (standardProficiencyRequired ||
        t.key !== 'standardsProficiencyProfile') &&
      (demographicsRequired || !ddFilterTypes.includes(t.key))
  )

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

  const isTabRequired = (tabKey) => {
    switch (tabKey) {
      case staticDropDownData.filterSections.TEST_FILTERS.key:
        return true
      case staticDropDownData.filterSections.CLASS_FILTERS.key:
        return true
      case staticDropDownData.filterSections.PERFORMANCE_FILTERS.key:
        return standardProficiencyRequired || performanceBandRequired
      case staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS.key:
        return demographicsRequired && !isEmpty(extraFilters)
      default:
        return false
    }
  }

  useEffect(() => {
    if (showFilter && !isTabRequired(activeTabKey)) {
      setActiveTabKey(staticDropDownData.filterSections.TEST_FILTERS.key)
    }
  }, [loc, showFilter])

  /**
   * if performanceBandProfile / standardsProficiencyProfile is not selected
   * performance band / standards mastery is fetched from the assessment (page data api)
   * this behaviour is kept dynamic for any selected test (apply button is not shown)
   * until the user manually selects a performance band / standards proficiency
   * however, filter tags need to reflect these dynamic changes
   * hence, the useEffect only updates tempTagsData for now
   */
  useEffect(() => {
    const _tempTagsData = {
      ...tempTagsData,
      performanceBandProfile: selectedPerformanceBand,
      standardsProficiencyProfile: selectedStandardProficiency,
    }
    setTempTagsData(_tempTagsData)
    setTagsData({
      ...tagsData,
      performanceBandProfile:
        selectedPerformanceBand || tagsData.performanceBandProfile,
      standardsProficiencyProfile:
        selectedStandardProficiency || tagsData.standardsProficiencyProfile,
    })
  }, [assessmentPerformanceBandProfile, assessmentStandardMasteryScale])

  if (SARFilterData !== prevSARFilterData && !isEmpty(SARFilterData)) {
    const _testId = getTestIdFromURL(location.pathname) || ''
    if (reportId) {
      _onGoClick({
        filters: { ...filters, ...search },
        selectedTest: { key: _testId },
        tagsData: { ...tempTagsData },
      })
      setShowApply(false)
    } else {
      // select common assessment as default if assessment type is not set for admins
      if (
        location.state?.source === 'standard-reports' &&
        (user.role === roleuser.DISTRICT_ADMIN ||
          user.role === roleuser.SCHOOL_ADMIN)
      ) {
        search.assessmentTypes =
          search.assessmentTypes ||
          DEFAULT_ADMIN_TEST_TYPE_MAP_FILTER[user.role].join(',')
      }

      const urlSchoolYear =
        schoolYear.find((item) => item.key === search.termId) ||
        schoolYear.find((item) => item.key === defaultTermId) ||
        (schoolYear[0] ? schoolYear[0] : { key: '', title: '' })
      const urlTestSubjects = staticDropDownData.subjects.filter(
        (item) => search.testSubjects && search.testSubjects.includes(item.key)
      )
      const urlTestGrades = staticDropDownData.grades.filter(
        (item) => search.testGrades && search.testGrades.includes(item.key)
      )
      const urlSubjects = staticDropDownData.subjects.filter(
        (item) => search.subjects && search.subjects.includes(item.key)
      )
      const urlGrades = staticDropDownData.grades.filter(
        (item) => search.grades && search.grades.includes(item.key)
      )
      const urlStandardProficiency = standardProficiencyList.find(
        (item) => item.key === search.standardsProficiencyProfile
      )
      const urlPerformanceBand = performanceBandList.find(
        (item) => item.key === search.performanceBandProfile
      )
      const urlAssignedBy =
        staticDropDownData.assignedBy.find(
          (a) => a.key === search.assignedBy
        ) || staticDropDownData.assignedBy[0]

      const _filters = {
        termId: urlSchoolYear.key,
        testGrades: urlTestGrades.map((item) => item.key).join(',') || '',
        testSubjects: urlTestSubjects.map((item) => item.key).join(',') || '',
        tagIds: search.tagIds || '',
        assessmentTypes: search.assessmentTypes || '',
        networkIds: search.networkIds || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        grades: urlGrades.map((item) => item.key).join(',') || '',
        subjects: urlSubjects.map((item) => item.key).join(',') || '',
        courseId: search.courseId || 'All',
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',
        standardsProficiencyProfile: urlStandardProficiency?.key || '',
        performanceBandProfile: urlPerformanceBand?.key || '',
        assignedBy: urlAssignedBy.key,
      }
      if (role === 'teacher') {
        delete _filters.networkIds
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _tempTagsData = {
        termId: urlSchoolYear,
        testGrades: urlTestGrades,
        testSubjects: urlTestSubjects,
        assessmentTypes: availableAssessmentType.filter((a) =>
          assessmentTypesArr.includes(a.key)
        ),
        grades: urlGrades,
        subjects: urlSubjects,
        standardsProficiencyProfile: urlStandardProficiency,
        performanceBandProfile: urlPerformanceBand,
        assignedBy: urlAssignedBy,
      }
      // set tempTagsData, filters and testId
      setTempTagsData(_tempTagsData)
      setFiltersOrTestId({ filters: _filters, testId: _testId })
      fetchUpdateTagsData({
        networkIds: reject(_filters.networkIds?.split(','), isEmpty),
        schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
        teacherIds: reject(_filters.teacherIds?.split(','), isEmpty),
        courseIds: reject([search.courseId], isEmpty),
        classIds: reject(_filters.classIds?.split(','), isEmpty),
        groupIds: reject(_filters.groupIds?.split(','), isEmpty),
        tagIds: reject(_filters.tagIds?.split(','), isEmpty),
        options: {
          termId: _filters.termId,
          schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          testIds: reject([_testId], isEmpty),
        },
      })
    }
    // update prevSARFilterData
    setPrevSARFilterData(SARFilterData)
  }

  const onGoClick = () => {
    // testList cannot be empty when onGoClick is clicked
    const _testList = testList.map(({ _id, title }) => ({ key: _id, title }))
    const _selectedTest =
      _testList.find((t) => t.key === testId) || _testList[0]
    const _tempTagsData = { ...tempTagsData, testId: _selectedTest }

    // update selectedTest & tempTagsData if testId not present in testList
    if (_selectedTest.key !== testId) {
      setTempTagsData(_tempTagsData)
      setFiltersOrTestId({ testId: _selectedTest.key })
    }

    const settings = {
      filters: { ...filters },
      selectedTest: { ..._selectedTest },
      tagsData: { ..._tempTagsData },
    }
    setShowApply(false)
    _onGoClick(settings)
    toggleFilter(null, false)
  }

  const getNewPathname = () => {
    const splitted = location.pathname.split('/')
    splitted.splice(splitted.length - 1)
    return `${splitted.join('/')}/`
  }

  const updateTestId = (selected) => {
    const _tempTagsData = { ...tempTagsData, testId: selected }
    const _testId = selected.key || ''
    if (!_testId) {
      delete _tempTagsData.testId
    }
    const source = location.state?.source
    if (
      firstLoad &&
      (isCliUser || (!reportId && !isCliUser && source !== 'standard-reports'))
    ) {
      const additionalUrlParams = pick(search, pickAddionalFilters[loc])
      _onGoClick(
        {
          filters: { ...filters },
          selectedTest: { ...selected },
          tagsData: { ..._tempTagsData },
        },
        additionalUrlParams
      )
    } else if (!reportId && !isCliUser) {
      toggleFilter(null, true)
      setShowApply(true)
    }
    setFirstLoad(false)
    setTempTagsData(_tempTagsData)
    setFiltersOrTestId({ testId: _testId })
  }

  const updateFilterDropdownCB = (selected, keyName, multiple = false) => {
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
    setTempTagsData(_tempTagsData)
    // update filters
    _filters[keyName] = _selected
    let urlFilter = { ..._filters }

    if (pickAddionalFilters[loc]) {
      const additionalUrlParams = pick(search, pickAddionalFilters[loc])
      urlFilter = { ...urlFilter, ...additionalUrlParams }
    }
    history.push(`${getNewPathname()}?${qs.stringify(urlFilter)}`)
    const _testId = keyName === 'tagIds' ? '' : testId
    setFiltersOrTestId({ filters: _filters, testId: _testId })
    setShowApply(true)
  }

  const handleCloseTag = (type, { key }) => {
    const _tempTagsData = { ...tempTagsData }
    // handles tempDdFilters
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
      // handles single selection filters
      if (filters[type] === key) {
        _filters[type] = staticDropDownData.initialFilters[type]
        delete _tempTagsData[type]
      }
      // handles multiple selection filters
      else if (filters[type].includes(key)) {
        _filters[type] = filters[type]
          .split(',')
          .filter((d) => d !== key)
          .join(',')
        _tempTagsData[type] = tempTagsData[type].filter((d) => d.key !== key)
      }
      setFiltersOrTestId({ filters: _filters, testId })
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

  const networkOptions = useMemo(() => {
    const networks = get(SARFilterData, 'data.result.networks', [])
    return networks.map((n) => ({ key: n._id, title: n.name }))
  }, [SARFilterData])

  return (
    <>
      <FilterTags
        isPrinting={isPrinting}
        visible={!reportId && !isCliUser}
        tagsData={tagsData}
        tagTypes={tagTypes}
        handleCloseTag={handleCloseTag}
        handleTagClick={handleTagClick}
      />
      <ReportFiltersContainer visible={!reportId && !isCliUser}>
        <StyledEduButton
          data-cy="filters"
          isGhost={!showFilter}
          onClick={toggleFilter}
          style={{ height: '24px' }}
        >
          <IconFilter width={15} height={15} />
          FILTERS
        </StyledEduButton>
        <EduIf condition={loc == 'performance-by-standards'}>
          <StyledEduButton
            data-cy="gpt-box-toggle"
            isGhost={!isGptBoxVisible}
            onClick={() => setIsGptBoxVisible((v) => !v)}
            style={{ height: '24px' }}
          >
            <Icon type="aliwangwang" color="white" />
          </StyledEduButton>
        </EduIf>
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
                >
                  <Row type="flex" gutter={[5, 10]}>
                    <Col span={6}>
                      <FilterLabel data-cy="schoolYear">
                        School Year
                      </FilterLabel>
                      <ControlDropDown
                        by={filters.termId}
                        selectCB={(e, selected) =>
                          updateFilterDropdownCB(selected, 'termId')
                        }
                        data={schoolYear}
                        prefix="School Year"
                        showPrefixOnSelected={false}
                      />
                    </Col>
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
                          updateFilterDropdownCB(selected, 'testSubjects', true)
                        }}
                        value={
                          filters.testSubjects && filters.testSubjects !== 'All'
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
                        onChange={(e) => {
                          const selected = availableAssessmentType.filter((a) =>
                            e.includes(a.key)
                          )
                          updateFilterDropdownCB(
                            selected,
                            'assessmentTypes',
                            true
                          )
                        }}
                        value={
                          filters.assessmentTypes &&
                          filters.assessmentTypes !== 'All'
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
                            ({ _id: key, tagName: title }) => ({ key, title })
                          )
                          updateFilterDropdownCB(_selected, 'tagIds', true)
                        }}
                        selectedTagIds={
                          filters.tagIds ? filters.tagIds.split(',') : []
                        }
                      />
                    </Col>

                    {prevSARFilterData && (
                      <Col span={18}>
                        <FilterLabel data-cy="test">Test</FilterLabel>
                        <AssessmentAutoComplete
                          firstLoad={firstLoad}
                          termId={filters.termId}
                          grades={filters.testGrades}
                          tagIds={filters.tagIds}
                          subjects={filters.testSubjects}
                          testTypes={filters.assessmentTypes}
                          selectedTestId={
                            testId || getTestIdFromURL(location.pathname)
                          }
                          selectCB={updateTestId}
                          showApply={showApply}
                        />
                      </Col>
                    )}
                  </Row>
                </Tabs.TabPane>
                <Tabs.TabPane
                  key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                  tab={staticDropDownData.filterSections.CLASS_FILTERS.title}
                  forceRender
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
                    {role !== 'teacher' && (
                      <>
                        {!isEmpty(networkOptions) && (
                          <Col span={6}>
                            <MultiSelectDropdown
                              dataCy="networks"
                              label="Network"
                              onChange={(e) => {
                                const selected = networkOptions.filter((a) =>
                                  e.includes(a.key)
                                )
                                updateFilterDropdownCB(
                                  selected,
                                  'networkIds',
                                  true
                                )
                              }}
                              value={
                                filters.networkIds &&
                                filters.networkIds !== 'All'
                                  ? filters.networkIds.split(',')
                                  : []
                              }
                              options={networkOptions}
                            />
                          </Col>
                        )}
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
                            networkIds={filters.networkIds}
                          />
                        </Col>
                        <Col span={6}>
                          <TeacherAutoComplete
                            dataCy="teachers"
                            termId={filters.termId}
                            school={filters.schoolIds}
                            networkIds={filters.networkIds}
                            testId={testId}
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
                        selectCB={(e) => updateFilterDropdownCB(e, 'courseId')}
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
                        networkIds={filters.networkIds}
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
                        networkIds={filters.networkIds}
                      />
                    </Col>
                  </Row>
                </Tabs.TabPane>
                {isTabRequired(
                  staticDropDownData.filterSections.PERFORMANCE_FILTERS.key
                ) && (
                  <Tabs.TabPane
                    key={
                      staticDropDownData.filterSections.PERFORMANCE_FILTERS.key
                    }
                    tab={
                      staticDropDownData.filterSections.PERFORMANCE_FILTERS
                        .title
                    }
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      {standardProficiencyRequired && (
                        <Col span={6}>
                          <FilterLabel data-cy="standardProficiency">
                            Standard Proficiency
                          </FilterLabel>
                          <ControlDropDown
                            by={selectedStandardProficiency?.key}
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
                        </Col>
                      )}
                      {performanceBandRequired && (
                        <Col span={6}>
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
                        </Col>
                      )}
                    </Row>
                  </Tabs.TabPane>
                )}
                {isTabRequired(
                  staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS.key
                ) && (
                  <Tabs.TabPane
                    key={
                      staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS.key
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
                disabled={!showApply || isEmpty(testList)}
                onClick={() => onGoClick()}
              >
                Apply
              </StyledEduButton>
            </Col>
          </Row>
        </ReportFiltersWrapper>
      </ReportFiltersContainer>
    </>
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
      assessmentPerformanceBandProfile: getPerformanceBandProfile(state),
      assessmentStandardMasteryScale: getStandardMasteryScale(state),
      testList: getTestListSelector(state),
    }),
    {
      getSARFilterDataRequest: getSARFilterDataRequestAction,
      setFiltersOrTestId: setFiltersOrTestIdAction,
      setPrevSARFilterData: setPrevSARFilterDataAction,
      fetchUpdateTagsData: (opts) =>
        fetchUpdateTagsDataAction({
          type: reportGroupType.SINGLE_ASSESSMENT_REPORT,
          ...opts,
        }),
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
