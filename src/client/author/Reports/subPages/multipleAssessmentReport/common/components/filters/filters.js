import React, { useState, useEffect, useMemo, Fragment, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy, reject } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col } from 'antd'

import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

import {
  reportGroupType,
  reportNavType,
} from '@edulastic/constants/const/report'
import { TEST_TYPES_VALUES_MAP } from '@edulastic/constants/const/testTypes'
import { FieldLabel } from '@edulastic/common'
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
  StyledDropDownContainer,
  SecondaryFilterRow,
} from '../../../../../common/styled'

import { processSchoolYear } from '../../utils/transformers'

import {
  getReportsMARFilterLoadingState,
  getMARFilterDataRequestAction,
  getReportsMARFilterData,
  getFiltersSelector,
  setFiltersAction,
  getReportsPrevMARFilterData,
  setPrevMARFilterDataAction,
} from '../../filterDataDucks'
import {
  getUserRole,
  getUser,
  currentDistrictInstitutionIds,
} from '../../../../../../src/selectors/user'
import { resetStudentFilters } from '../../../../../common/util'

import staticDropDownData from '../../static/staticDropDownData.json'
import { fetchUpdateTagsDataAction } from '../../../../../ducks'
import { getArrayOfAllTestTypes } from '../../../../../../../common/utils/testTypeUtils'
import AssessmentAutoComplete from '../../../../../common/components/autocompletes/AssessmentAutoComplete'

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)
const availableAssessmentType = getArrayOfAllTestTypes()

const MultipleAssessmentReportFilters = ({
  loc,
  isPrinting,
  tagsData,
  loading,
  MARFilterData,
  filters,
  tempDdFilter,
  tempTagsData,
  user,
  role,
  getMARFilterDataRequest,
  setFilters,
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
  fetchUpdateTagsData,
  institutionIds,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(
    staticDropDownData.filterSections.TEST_FILTERS.key
  )
  const assessmentTypesRef = useRef()

  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      loc === reportNavType.PRE_VS_POST &&
      !['testIds'].includes(t.key) &&
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

  const search = useMemo(
    () =>
      pickBy(
        qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
        (f) => f !== 'All' && !isEmpty(f)
      ),
    [location.search]
  )

  useEffect(() => {
    if (reportId) {
      getMARFilterDataRequest({ reportId })
      setFilters({ ...filters, ...search })
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
        q.schoolIds = institutionIds.join(',')
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
  useEffect(() => {
    if (MARFilterData !== prevMARFilterData && !isEmpty(MARFilterData)) {
      if (reportId) {
        _onGoClick({
          filters: { ...filters, ...search },
          tagsData: {},
        })
      } else {
        // select common assessment as default if assessment type is not set for admins
        if (
          location.state?.source === 'standard-reports' &&
          (user.role === roleuser.DISTRICT_ADMIN ||
            user.role === roleuser.SCHOOL_ADMIN)
        ) {
          search.assessmentTypes =
            search.assessmentTypes || TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT
        }
        const urlSchoolYear =
          schoolYears.find((item) => item.key === search.termId) ||
          schoolYears.find((item) => item.key === defaultTermId) ||
          (schoolYears[0] ? schoolYears[0] : { key: '', title: '' })
        const urlTestSubjects = staticDropDownData.subjects.filter(
          (item) =>
            search.testSubjects && search.testSubjects.includes(item.key)
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
        const urlPerformanceBand =
          performanceBandList.find((item) => item.key === search.profileId) ||
          performanceBandList[0]
        const urlAssignedBy =
          staticDropDownData.assignedBy.find(
            (a) => a.key === search.assignedBy
          ) || staticDropDownData.assignedBy[0]

        const _filters = {
          termId: urlSchoolYear.key,
          testSubjects: urlTestSubjects.map((item) => item.key).join(',') || '',
          testGrades: urlTestGrades.map((item) => item.key).join(',') || '',
          tagIds: search.tagIds || '',
          assessmentTypes: search.assessmentTypes || '',
          testIds: search.testIds || '',
          preTestId: search.preTestId,
          postTestId: search.postTestId,
          schoolIds: search.schoolIds || '',
          teacherIds: search.teacherIds || '',
          subjects: urlSubjects.map((item) => item.key).join(',') || '',
          grades: urlGrades.map((item) => item.key).join(',') || '',
          courseId: search.courseId || 'All',
          classIds: search.classIds || '',
          groupIds: search.groupIds || '',
          profileId: urlPerformanceBand?.key || '',
          assignedBy: urlAssignedBy.key,
        }
        if (role === roleuser.TEACHER) {
          delete _filters.schoolIds
          delete _filters.teacherIds
        }
        const assessmentTypesArr = (search.assessmentTypes || '').split(',')
        const _tempTagsData = {
          termId: urlSchoolYear,
          testSubjects: urlTestSubjects,
          testGrades: urlTestGrades,
          assessmentTypes: availableAssessmentType.filter((a) =>
            assessmentTypesArr.includes(a.key)
          ),
          subjects: urlSubjects,
          grades: urlGrades,
          profileId: urlPerformanceBand,
          assignedBy: urlAssignedBy,
        }

        // set tempTagsData, filters and testId
        setTempTagsData(_tempTagsData)
        setFilters(_filters)
        if (location.state?.source === 'standard-reports') {
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
            preTestId: _filters.preTestId,
            postTestId: _filters.postTestId,
            options: {
              termId: _filters.termId,
              schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
            },
          })
        }
      }
      setFirstLoad(false)
      // update prevMARFilterData
      setPrevMARFilterData(MARFilterData)
    }
  }, [MARFilterData, prevMARFilterData])

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      tagsData: { ...tempTagsData },
      ..._settings,
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
    if (isRowFilter) {
      setFilters({ ..._filters, showApply: true })
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  const onAssessmentSelect = (selected, keyName) => {
    const _tempTagsData = { ...tempTagsData, [keyName]: selected }
    const _filters = { ...filters }
    resetStudentFilters(_tempTagsData, _filters, keyName, selected.key)
    setTempTagsData(_tempTagsData)
    // update filters
    _filters[keyName] = selected.key
    setFilters({ ..._filters, showApply: true })
  }

  const handleCloseTag = (type, { key }) => {
    const _tempTagsData = { ...tempTagsData }
    // handle tempDdFilters
    if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = ''
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

  const handleTagClick = (filterKey) => {
    const tabKey =
      staticDropDownData.tagTypes.find((filter) => filter.key === filterKey)
        ?.tabKey || -1
    if (tabKey !== -1) {
      toggleFilter(null, true)
      setActiveTabKey(tabKey)
    }
  }

  // only required for pre vs post report
  const waitForPreTestInitialLoad = !!search.preTestId
  const waitForPostTestInitialLoad = !!search.postTestId

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
                      {!(loc === reportNavType.PRE_VS_POST) && (
                        <Col span={18}>
                          <AssessmentsAutoComplete
                            dataCy="tests"
                            termId={filters.termId}
                            grades={filters.testGrades}
                            subjects={filters.testSubjects}
                            testTypes={filters.assessmentTypes}
                            tagIds={filters.tagIds}
                            selectedTestIds={
                              filters.testIds ? filters.testIds.split(',') : []
                            }
                            selectCB={(e) =>
                              updateFilterDropdownCB(e, 'testIds', true)
                            }
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
      {loc === reportNavType.PRE_VS_POST && (
        <Col span={24}>
          <SecondaryFilterRow
            hidden={!!reportId}
            width="100%"
            fieldHeight="40px"
          >
            <StyledDropDownContainer
              flex="0 0 300px"
              xs={24}
              sm={12}
              lg={6}
              data-cy="preAssessment"
            >
              <FieldLabel fs=".7rem" data-cy="preAssessment">
                PRE ASSESSMENT
              </FieldLabel>
              <AssessmentAutoComplete
                firstLoad={firstLoad}
                termId={filters.termId}
                grades={filters.testGrades}
                tagIds={filters.tagIds}
                subjects={filters.testSubjects}
                testTypes={filters.assessmentTypes}
                selectedTestId={filters.preTestId || ''}
                selectCB={(e) => onAssessmentSelect(e, 'preTestId')}
                showApply={filters.showApply}
                blackList={[filters.postTestId]}
                autoSelectFirstItem
                statePrefix="pre"
                waitForInitialLoad={waitForPreTestInitialLoad}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer
              flex="0 0 300px"
              xs={24}
              sm={12}
              lg={6}
              data-cy="postAssessment"
            >
              <FieldLabel fs=".7rem" data-cy="postAssessment">
                POST ASSESSMENT
              </FieldLabel>
              <AssessmentAutoComplete
                firstLoad={firstLoad}
                termId={filters.termId}
                grades={filters.testGrades}
                tagIds={filters.tagIds}
                subjects={filters.testSubjects}
                testTypes={filters.assessmentTypes}
                selectedTestId={filters.postTestId || ''}
                selectCB={(e) => onAssessmentSelect(e, 'postTestId')}
                showApply={filters.showApply}
                autoSelectFirstItem
                blackList={[filters.preTestId]}
                statePrefix="post"
                waitForInitialLoad={waitForPostTestInitialLoad}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer
              flex="0 0 300px"
              xs={24}
              sm={12}
              lg={6}
              data-cy="performanceBand"
            >
              <FilterLabel data-cy="performanceBand">
                Performance Band
              </FilterLabel>
              <ControlDropDown
                by={{ key: filters.profileId }}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'profileId', false, true)
                }
                data={performanceBandList}
                prefix="Performance Band"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
            {filters.showApply && (
              <StyledEduButton
                btnType="primary"
                data-testid="applyRowFilter"
                data-cy="applyRowFilter"
                onClick={() => onGoClick()}
              >
                APPLY
              </StyledEduButton>
            )}
          </SecondaryFilterRow>
        </Col>
      )}
    </Row>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsMARFilterLoadingState(state),
      MARFilterData: getReportsMARFilterData(state),
      filters: getFiltersSelector(state),
      role: getUserRole(state),
      user: getUser(state),
      prevMARFilterData: getReportsPrevMARFilterData(state),
      institutionIds: currentDistrictInstitutionIds(state),
    }),
    {
      getMARFilterDataRequest: getMARFilterDataRequestAction,
      setFilters: setFiltersAction,
      setPrevMARFilterData: setPrevMARFilterDataAction,
      fetchUpdateTagsData: (opts) =>
        fetchUpdateTagsDataAction({
          type: reportGroupType.MULTIPLE_ASSESSMENT_REPORT,
          ...opts,
        }),
    }
  )
)

export default enhance(MultipleAssessmentReportFilters)
