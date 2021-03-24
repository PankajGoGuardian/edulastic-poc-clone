import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col } from 'antd'

import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

import FilterTags from '../../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import AssessmentsAutoComplete from '../../../../../common/components/autocompletes/AssessmentsAutoComplete'
import CourseAutoComplete from '../../../../../common/components/autocompletes/CourseAutoComplete'
import ClassAutoComplete from '../../../../../common/components/autocompletes/ClassAutoComplete'
import GroupsAutoComplete from '../../../../../common/components/autocompletes/GroupsAutoComplete'
import SchoolAutoComplete from '../../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../../common/components/autocompletes/TeacherAutoComplete'
import TagFilter from '../../../../../../src/components/common/TagFilter'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
  StyledEduButton,
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

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)

const MultipleAssessmentReportFilters = ({
  loc,
  isPrinting,
  tagsData,
  loading,
  MARFilterData,
  filters,
  testIds,
  tempDdFilter,
  tempTagsData,
  user,
  role,
  getMARFilterDataRequest,
  setFilters,
  setTestIds,
  setTempDdFilter,
  setTempTagsData,
  onGoClick: _onGoClick,
  location,
  history,
  setPrevMARFilterData,
  prevMARFilterData,
  performanceBandRequired,
  demographicsRequired,
  extraFilters,
  showApply,
  setShowApply,
  firstLoad,
  setFirstLoad,
  reportId,
  showFilter,
  toggleFilter,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(
    staticDropDownData.filterSections.TEST_FILTERS.key
  )
  const assessmentTypesRef = useRef()

  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'profileId') &&
      (demographicsRequired || !ddFilterTypes.includes(t.key))
  )

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

  const isTabRequired = (tabKey) => {
    switch (tabKey) {
      case staticDropDownData.filterSections.TEST_FILTERS.key:
        return true
      case staticDropDownData.filterSections.CLASS_FILTERS.key:
        return true
      case staticDropDownData.filterSections.PERFORMANCE_FILTERS.key:
        return performanceBandRequired
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

  if (MARFilterData !== prevMARFilterData && !isEmpty(MARFilterData)) {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    if (reportId) {
      _onGoClick({
        selectedTests: [],
        filters: { ...filters, ...search },
        tagsData: {},
      })
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
        tagIds: search.tagIds || '',
        assessmentTypes: search.assessmentTypes || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        studentSubject: urlStudentSubject.key,
        studentGrade: urlStudentGrade.key,
        studentCourseId: search.studentCourseId || 'All',
        classIds: search.classId || '',
        groupIds: search.groupId || '',
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
      const _tempTagsData = {
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

      // set tempTagsData, filters and testId
      setTempTagsData(_tempTagsData)
      setFilters(_filters)
      // TODO: enable selection of testIds from url and saved filters
      // const urlTestIds = search.testIds ? search.testIds.split(',') : []
      // setTestIds(urlTestIds)
      setTestIds([])
      _onGoClick({
        filters: { ..._filters },
        selectedTests: [],
        tagsData: { ..._tempTagsData },
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
      tagsData: { ...tempTagsData },
      ..._settings,
    }
    setShowApply(false)
    _onGoClick(settings)
    toggleFilter(null, false)
  }

  const updateFilterDropdownCB = (selected, keyName, multiple = false) => {
    // update filter tags data
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
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    setFilters(_filters)
    setShowApply(true)
  }

  const onSelectTest = (selected) => {
    setTempTagsData({ ...tempTagsData, testIds: selected })
    setTestIds(selected.map((o) => o.key))
    setShowApply(true)
  }

  const handleCloseTag = (type, { key }) => {
    const _tempTagsData = { ...tempTagsData }
    // handles testIds
    if (type === 'testIds') {
      if (testIds.includes(key)) {
        const _testIds = testIds.filter((d) => d !== key)
        _tempTagsData[type] = tempTagsData[type].filter((d) => d.key !== key)
        setTestIds(_testIds)
      }
    } // handles tempDdFilters
    else if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = ''
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
      setFilters(_filters)
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
                          data={schoolYears}
                          prefix="School Year"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="testGrade">
                          Test Grade
                        </FilterLabel>
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
                          prefix="Subject"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testTypes"
                          label="Test Type"
                          el={assessmentTypesRef}
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
                            filters.assessmentTypes
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
                      {prevMARFilterData && (
                        <Col span={18}>
                          <AssessmentsAutoComplete
                            dataCy="tests"
                            firstLoad={firstLoad}
                            termId={filters.termId}
                            grade={filters.grade !== 'All' && filters.grade}
                            subject={
                              filters.subject !== 'All' && filters.subject
                            }
                            testTypes={filters.assessmentTypes}
                            tagIds={filters.tagIds}
                            selectedTestIds={testIds}
                            selectCB={onSelectTest}
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
                        <FilterLabel data-cy="classGrade">
                          Class Grade
                        </FilterLabel>
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

                  {isTabRequired(
                    staticDropDownData.filterSections.PERFORMANCE_FILTERS.key
                  ) && (
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
                        <Col span={6}>
                          <FilterLabel data-cy="performanceBand">
                            Performance Band
                          </FilterLabel>
                          <ControlDropDown
                            by={{ key: filters.profileId }}
                            selectCB={(e, selected) =>
                              updateFilterDropdownCB(selected, 'profileId')
                            }
                            data={performanceBandList}
                            prefix="Performance Band"
                            showPrefixOnSelected={false}
                          />
                        </Col>
                      </Row>
                    </Tabs.TabPane>
                  )}
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
                  disabled={!showApply}
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

export default enhance(MultipleAssessmentReportFilters)
