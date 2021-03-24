import React, { useState, useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy, groupBy, upperFirst } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col } from 'antd'

import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

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
import { getReportsStandardsPerformanceSummary } from '../../standardsPerformance/ducks'
import { getReportsStandardsGradebook } from '../../standardsGradebook/ducks'
import { getReportsStandardsProgress } from '../../standardsProgress/ducks'

import staticDropDownData from '../static/json/staticDropDownData.json'

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)

const StandardsMasteryReportFilters = ({
  isPrinting,
  tagsData,
  user,
  history,
  location,
  interestedGrades,
  interestedCurriculums,
  loading,
  filters,
  setFilters,
  testIds,
  setTestIds,
  tempDdFilter,
  setTempDdFilter,
  tempTagsData,
  setTempTagsData,
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
}) => {
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
    () => get(standardsProgress, 'data.result.standardId'),
    [standardsProgress]
  )

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

  useEffect(() => {
    if (showFilter && !isTabRequired(activeTabKey)) {
      setActiveTabKey(staticDropDownData.filterSections.CLASS_FILTERS.key)
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
    }
  }, [standardIdFromPageData])

  if (prevStandardsFilters !== standardsFilters && !isEmpty(standardsFilters)) {
    let search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
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
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',
        testGrade: urlTestGrade.key,
        testSubject: urlTestSubject.key,
        tagIds: search.tagIds || '',
        assessmentTypes: search.assessmentTypes || '',
        curriculumId: urlCurriculum.key || '',
        standardGrade: urlStandardGrade.key,
        profileId: urlStandardProficiency?.key || '',
        domainIds: [],
        standardId: search.standardId || '',
      }
      if (role === roleuser.TEACHER) {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _tempTagsData = {
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
    // update prevSMRFilterData
    setPrevStandardsFilters(standardsFilters)
  }

  // -----|-----|-----|-----| EVENT HANDLERS BEGIN |-----|-----|-----|----- //

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      selectedTests: testIds,
      tagsData: { ...tempTagsData },
      ..._settings,
    }
    if (role === roleuser.SCHOOL_ADMIN) {
      settings.filters.schoolIds =
        settings.filters.schoolIds || get(user, 'institutionIds', []).join(',')
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
    isStandardFilter = false
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
    const filterKey = ['grade', 'subject', 'courseId'].includes(keyName)
      ? `student${upperFirst(keyName)}`
      : keyName
    resetStudentFilters(_tempTagsData, _filters, filterKey, _selected)
    setTempTagsData(_tempTagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    if (isStandardFilter) {
      setFilters({ ..._filters, showApply: true })
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  const onSelectTest = (selected) => {
    setTempTagsData({ ...tempTagsData, testIds: selected })
    setTestIds(selected.map((o) => o.key))
    setShowApply(true)
  }

  const onSelectDomain = (domain) => {
    const _domainIds = toggleItem(filters.domainIds, domain.key).filter((o) =>
      allDomainIds.includes(o)
    )
    const domainTagsData = domainsList.filter((d) => _domainIds.includes(d.key))
    setTempTagsData({ ...tempTagsData, domainIds: domainTagsData })
    setFilters({ ...filters, domainIds: _domainIds, showApply: true })
  }

  const onChangeDomains = (domains) => {
    if (!domains?.length) {
      setTempTagsData({ ...tempTagsData, domainIds: [] })
      setFilters({ ...filters, domainIds: [], showApply: true })
    }
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
    }
    // handles tempDdFilters
    else if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = staticDropDownData.initialDdFilters[type]
        delete _tempTagsData[type]
      }
      setTempDdFilter(_tempDdFilter)
    } else {
      const _filters = { ...filters }
      const filterKey = ['grade', 'subject', 'courseId'].includes(type)
        ? `student${upperFirst(type)}`
        : type
      resetStudentFilters(_tempTagsData, _filters, filterKey, '')
      // handles single selection filters
      if (filters[type] === key) {
        _filters[type] = staticDropDownData.initialFilters[type]
        delete _tempTagsData[type]
      }
      // handles multiple selection filters
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

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //

  const standardProficiencyFilter = (
    <StyledDropDownContainer span={4} data-cy="standardProficiency">
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
                      key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                      tab={
                        staticDropDownData.filterSections.CLASS_FILTERS.title
                      }
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
                            by={filters.grade}
                            selectCB={(e, selected) =>
                              updateFilterDropdownCB(selected, 'grade')
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
                            grade={filters.grade !== 'All' && filters.grade}
                            subject={
                              filters.subject !== 'All' && filters.subject
                            }
                            courseId={
                              filters.courseId !== 'All' && filters.courseId
                            }
                            selectedClassIds={
                              filters.classIds
                                ? filters.classIds.split(',')
                                : []
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
                            grade={filters.grade !== 'All' && filters.grade}
                            subject={
                              filters.subject !== 'All' && filters.subject
                            }
                            courseId={
                              filters.courseId !== 'All' && filters.courseId
                            }
                            selectedGroupIds={
                              filters.groupIds
                                ? filters.groupIds.split(',')
                                : []
                            }
                            selectCB={(e) =>
                              updateFilterDropdownCB(e, 'groupIds', true)
                            }
                          />
                        </Col>
                      </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane
                      key={staticDropDownData.filterSections.TEST_FILTERS.key}
                      tab={staticDropDownData.filterSections.TEST_FILTERS.title}
                    >
                      <Row type="flex" gutter={[5, 10]}>
                        <Col span={6}>
                          <FilterLabel data-cy="testGrade">
                            Test Grade
                          </FilterLabel>
                          <ControlDropDown
                            prefix="Grade"
                            by={filters.testGrade}
                            selectCB={(e, selected) =>
                              updateFilterDropdownCB(selected, 'testGrade')
                            }
                            data={staticDropDownData.allGrades}
                            showPrefixOnSelected={false}
                          />
                        </Col>
                        <Col span={6}>
                          <FilterLabel data-cy="testSubject">
                            Test Subject
                          </FilterLabel>
                          <ControlDropDown
                            by={filters.testSubject}
                            selectCB={(e, selected) =>
                              updateFilterDropdownCB(selected, 'testSubject')
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
                            grade={
                              filters.testGrade !== 'All' && filters.testGrade
                            }
                            subject={
                              filters.testSubject !== 'All' &&
                              filters.testSubject
                            }
                            tagIds={filters.tagIds}
                            testTypes={filters.assessmentTypes}
                            selectedTestIds={testIds}
                            selectCB={onSelectTest}
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
      </Col>
      <Col span={24}>
        <Row
          type="flex"
          gutter={[5, 10]}
          justify="end"
          align="middle"
          style={{ paddingLeft: '10px' }}
        >
          <StyledDropDownContainer span={4} data-cy="standardSet">
            <ControlDropDown
              by={filters.curriculumId}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'curriculumId', false, true)
              }
              data={curriculumsList}
              prefix="Standard Set"
              showPrefixOnSelected={false}
            />
          </StyledDropDownContainer>
          <StyledDropDownContainer span={4} data-cy="standardGrade">
            <ControlDropDown
              by={filters.standardGrade}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'standardGrade', false, true)
              }
              data={staticDropDownData.allGrades}
              prefix="Standard Grade"
              showPrefixOnSelected={false}
            />
          </StyledDropDownContainer>
          {loc !== 'standards-progress' && standardProficiencyFilter}
          <StyledDropDownContainer span={4} data-cy="domain">
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
              onSelect={onSelectDomain}
              onChange={onChangeDomains}
              placeholder="All Domains"
              style={{ width: '100%', height: 'auto' }}
            />
          </StyledDropDownContainer>
          {loc === 'standards-progress' && (
            <StyledDropDownContainer span={4} data-cy="standard">
              <ControlDropDown
                by={filters.standardId || standardsList[0]}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'standardId', false, true)
                }
                data={standardsList}
                prefix="Standard"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
          )}
          {loc === 'standards-progress' && standardProficiencyFilter}
          {filters.showApply && (
            <StyledEduButton
              btnType="primary"
              onClick={onGoClick}
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
      testIds: getTestIdSelector(state) || [],
      user: getUser(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      prevStandardsFilters: getPrevStandardsFiltersSelector(state),
      standardsPerformanceSummary: getReportsStandardsPerformanceSummary(state),
      standardsGradebook: getReportsStandardsGradebook(state),
      standardsProgress: getReportsStandardsProgress(state),
    }),
    {
      getStandardsFiltersRequest: getStandardsFiltersRequestAction,
      setFilters: setFiltersAction,
      setTestIds: setTestIdAction,
      setPrevStandardsFilters: setPrevStandardsFiltersAction,
    }
  )
)

export default enhance(StandardsMasteryReportFilters)
