import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col } from 'antd'

import { roleuser } from '@edulastic/constants'
import { EduButton } from '@edulastic/common'
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
  loading,
  MARFilterData,
  filters,
  testIds,
  tempDdFilter,
  tagsData,
  user,
  role,
  getMARFilterDataRequest,
  setFilters,
  setTestIds,
  setTempDdFilter,
  setTagsData,
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
        classIds: search.classId || '',
        groupIds: search.groupId || '',
        profileId: urlPerformanceBand?.key || '',
        tags: [],
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

  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles testIds
    if (type === 'testIds') {
      if (testIds.includes(key)) {
        const _testIds = testIds.filter((d) => d !== key)
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
        setTestIds(_testIds)
      }
    } // handles tempDdFilters
    else if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = ''
        delete _tagsData[type]
      }
      setTempDdFilter(_tempDdFilter)
    } else {
      const _filters = { ...filters }
      resetStudentFilters(_tagsData, _filters, type, '')
      // handles single selection filters
      if (filters[type] === key) {
        _filters[type] = staticDropDownData.initialFilters[type]
        delete _tagsData[type]
      }
      // handles multiple selection filters
      else if (filters[type].includes(key)) {
        _filters[type] = filters[type]
          .split(',')
          .filter((d) => d !== key)
          .join(',')
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
      }
      setFilters(_filters)
    }
    setTagsData(_tagsData)
    setShowApply(true)
    toggleFilter(null, true)
  }

  return (
    <>
      <FilterTags
        tagsData={tagsData}
        tagTypes={tagTypes}
        handleCloseTag={handleCloseTag}
      />
      <ReportFiltersContainer>
        <EduButton
          isGhost={!showFilter}
          onClick={toggleFilter}
          style={{ height: '24px' }}
        >
          <IconFilter width={15} height={15} />
          FILTERS
        </EduButton>
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
                      </Col>
                      <Col span={6}>
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
                      </Col>
                      <Col span={6}>
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
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
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
                          onChangeField={(type, value) =>
                            updateFilterDropdownCB(
                              value.map(({ _id }) => _id),
                              type,
                              true
                            )
                          }
                          selectedTagIds={filters.tags}
                        />
                      </Col>
                      {prevMARFilterData && (
                        <Col span={6}>
                          <AssessmentsAutoComplete
                            firstLoad={firstLoad}
                            termId={filters.termId}
                            grade={filters.grade !== 'All' && filters.grade}
                            subject={
                              filters.subject !== 'All' && filters.subject
                            }
                            testTypes={filters.assessmentTypes}
                            tags={filters.tags}
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
                      </Col>
                      <Col span={6}>
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
                      </Col>
                      <Col span={6}>
                        <FilterLabel>Course</FilterLabel>
                        <CourseAutoComplete
                          selectedCourseId={filters.studentCourseId}
                          selectCB={(e) =>
                            updateFilterDropdownCB(e, 'studentCourseId')
                          }
                        />
                      </Col>
                      <Col span={6}>
                        <ClassAutoComplete
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
                          selectCB={(e) => {
                            updateFilterDropdownCB(
                              e.join(','),
                              'classIds',
                              true
                            )
                          }}
                          selectedClassId={filters.classId}
                        />
                      </Col>
                      <Col span={6}>
                        <GroupsAutoComplete
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
                          selectCB={(e) => {
                            updateFilterDropdownCB(
                              e.join(','),
                              'groupIds',
                              true
                            )
                          }}
                          selectedGroupId={filters.groupId}
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>

                  {performanceBandRequired && (
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
                        </Col>
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
                <EduButton
                  width="25%"
                  height="40px"
                  style={{ maxWidth: '200px' }}
                  isGhost
                  key="cancelButton"
                  onClick={(e) => toggleFilter(e, false)}
                >
                  No, Cancel
                </EduButton>
                <EduButton
                  width="25%"
                  height="40px"
                  style={{ maxWidth: '200px' }}
                  key="applyButton"
                  disabled={!showApply}
                  onClick={() => onGoClick()}
                >
                  Apply
                </EduButton>
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
