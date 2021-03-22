import React, { useState, useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col } from 'antd'

import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

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
import { getTestListSelector } from '../../../../ducks'
import {
  getUserRole,
  getUserOrgId,
  getUser,
} from '../../../../../src/selectors/user'
import { resetStudentFilters } from '../../../../common/util'
import staticDropDownData from '../static/staticDropDownData.json'

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
  isPrinting,
  tagsData,
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
}) => {
  const [activeTabKey, setActiveTabKey] = useState(
    staticDropDownData.filterSections.TEST_FILTERS.key
  )
  const assessmentTypeRef = useRef()

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
   * hence, the useEffect only updates tempTagsData for now
   */
  useEffect(() => {
    const _tempTagsData = {
      ...tempTagsData,
      performanceBandProfile: selectedPerformanceBand,
      standardsProficiencyProfile: selectedStandardProficiency,
    }
    setTempTagsData(_tempTagsData)
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
        tagsData: { ...tempTagsData },
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
        tagIds: search.tagIds || '',
        assessmentTypes: search.assessmentTypes || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        studentGrade: urlStudentGrade.key,
        studentSubject: urlStudentSubject.key,
        studentCourseId: search.studentCourseId || 'All',
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',
        standardsProficiencyProfile: urlStandardProficiency?.key || '',
        performanceBandProfile: urlPerformanceBand?.key || '',
      }
      if (role === 'teacher') {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _tempTagsData = {
        termId: urlSchoolYear,
        grade: urlGrade,
        subject: urlSubject,
        assessmentTypes: staticDropDownData.assessmentType.filter((a) =>
          assessmentTypesArr.includes(a.key)
        ),
        studentGrade: urlStudentGrade,
        studentSubject: urlStudentSubject,
        standardsProficiencyProfile: urlStandardProficiency,
        performanceBandProfile: urlPerformanceBand,
      }
      // set tempTagsData, filters and testId
      setTempTagsData(_tempTagsData)
      setFiltersOrTestId({ filters: _filters, testId: _testId })
    }
    // update prevSARFilterData
    setPrevSARFilterData(SARFilterData)
  }

  const onGoClick = () => {
    const settings = {
      filters: { ...filters },
      selectedTest: { key: testId },
      tagsData: { ...tempTagsData },
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
    if (firstLoad && !selected.key) {
      delete _tempTagsData.testId
      toggleFilter(null, true)
      setFirstLoad(false)
      _onGoClick({
        filters: { ...filters },
        selectedTest: { key: '' },
        tagsData: { ..._tempTagsData },
      })
      return
    }
    setTempTagsData(_tempTagsData)
    const _testId = selected.key || ''
    setFiltersOrTestId({ testId: _testId })
    if (reportId) {
      setFirstLoad(false)
    } else if (firstLoad && selected.key) {
      setFirstLoad(false)
      _onGoClick({
        filters: { ...filters },
        selectedTest: { key: _testId },
        tagsData: { ..._tempTagsData },
      })
    } else if (selected.key) {
      setShowApply(true)
    } else if (firstLoad) {
      setFirstLoad(false)
    }
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
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
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

  return (
    <>
      <FilterTags
        isPrinting={isPrinting}
        visible={!reportId}
        tagsData={tagsData}
        tagTypes={tagTypes}
        handleCloseTag={handleCloseTag}
      />
      <ReportFiltersContainer visible={!reportId}>
        <StyledEduButton
          data-cy="filters"
          isGhost={!showFilter}
          onClick={toggleFilter}
          style={{ height: '24px' }}
        >
          <IconFilter width={15} height={15} />
          FILTERS
        </StyledEduButton>
        <ReportFiltersWrapper visible={showFilter}>
          {loading ? (
            <Spin />
          ) : (
            <Row>
              <Col span={24} style={{ padding: '0 5px' }}>
                <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
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
                        <FilterLabel data-cy="testGrade">
                          Test Grade
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.grade}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'grade')
                          }
                          data={staticDropDownData.grades}
                          prefix="Test Grade"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="testSubject">
                          Test Subject
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.subject}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'subject')
                          }
                          data={staticDropDownData.subjects}
                          prefix="Test Subject"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testTypes"
                          label="Test Type"
                          el={assessmentTypeRef}
                          onChange={(e) => {
                            const selected = staticDropDownData.assessmentType.filter(
                              (a) => e.includes(a.key)
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
                          options={staticDropDownData.assessmentType.filter(
                            (a) => a.key !== 'All'
                          )}
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
                            grade={filters.grade !== 'All' && filters.grade}
                            tagIds={filters.tagIds}
                            subject={
                              filters.subject !== 'All' && filters.subject
                            }
                            testTypes={filters.assessmentTypes}
                            selectedTestId={
                              testId || getTestIdFromURL(location.pathname)
                            }
                            selectCB={updateTestId}
                          />
                        </Col>
                      )}
                    </Row>
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                    tab={staticDropDownData.filterSections.CLASS_FILTERS.title}
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      {role !== 'teacher' && (
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
                        <FilterLabel data-cy="classGrade">
                          Class Grade
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.studentGrade}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'studentGrade')
                          }
                          data={staticDropDownData.grades}
                          prefix="Grade"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="classSubject">
                          Class Subject
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.studentSubject}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'studentSubject')
                          }
                          data={staticDropDownData.subjects}
                          prefix="Subject"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="course">Course</FilterLabel>
                        <CourseAutoComplete
                          selectedCourseId={filters.studentCourseId}
                          selectCB={(e) =>
                            updateFilterDropdownCB(e, 'studentCourseId')
                          }
                        />
                      </Col>
                      <Col span={6}>
                        <ClassAutoComplete
                          dataCy="classes"
                          termId={filters.termId}
                          schoolIds={filters.schoolIds}
                          teacherIds={filters.teacherIds}
                          grade={
                            filters.studentGrade !== 'All' &&
                            filters.studentGrade
                          }
                          subject={
                            filters.studentSubject !== 'All' &&
                            filters.studentSubject
                          }
                          courseId={
                            filters.studentCourseId !== 'All' &&
                            filters.studentCourseId
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
                          grade={
                            filters.studentGrade !== 'All' &&
                            filters.studentGrade
                          }
                          subject={
                            filters.studentSubject !== 'All' &&
                            filters.studentSubject
                          }
                          courseId={
                            filters.studentCourseId !== 'All' &&
                            filters.studentCourseId
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
                  {(standardProficiencyRequired || performanceBandRequired) && (
                    <Tabs.TabPane
                      key={
                        staticDropDownData.filterSections.PERFORMANCE_FILTERS
                          .key
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
                  {demographicsRequired && !isEmpty(extraFilters) && (
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
              <Col span={24} style={{ display: 'flex', paddingTop: '50px' }}>
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
          )}
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
    }
  )
)

export default enhance(SingleAssessmentReportFilters)
