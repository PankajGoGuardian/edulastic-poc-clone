import React, { useState, useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { capitalize, get, isEmpty, pickBy, groupBy } from 'lodash'
import qs from 'qs'

import { Spin, Tabs, Row, Col } from 'antd'

import { roleuser } from '@edulastic/constants'
import { EduButton } from '@edulastic/common'
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
  firstLoad,
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

  useEffect(() => {
    if (standardIdFromPageData) {
      const standardFromPageData = standardsList.find(
        (o) => o.key === standardIdFromPageData
      )
      setFilters({
        ...filters,
        standardId: standardIdFromPageData,
      })
      setTagsData({
        ...tagsData,
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
        assessmentTypes: search.assessmentTypes || '',
        tags: [],
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

  const onSelectDomain = (domain) => {
    const _domainIds = toggleItem(filters.domainIds, domain.key).filter((o) =>
      allDomainIds.includes(o)
    )
    const domainTagsData = domainsList.filter((d) => _domainIds.includes(d.key))
    setTagsData({ ...tagsData, domainIds: domainTagsData })
    setFilters({ ...filters, domainIds: _domainIds })
    setShowApply(true)
  }

  const onChangeDomains = (domains) => {
    if (!domains?.length) {
      setTagsData({ ...tagsData, domainIds: [] })
      setFilters({ ...filters, domainIds: [] })
      setShowApply(true)
    }
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
    }
    // handles tempDdFilters
    else if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = staticDropDownData.initialDdFilters[type]
        delete _tagsData[type]
      }
      setTempDdFilter(_tempDdFilter)
    } else {
      const _filters = { ...filters }
      const filterKey = ['grade', 'subject'].includes(type)
        ? `student${capitalize(type)}`
        : type
      resetStudentFilters(_tagsData, _filters, filterKey, '')
      // handles single selection filters
      if (filters[type] === key) {
        _filters[type] = staticDropDownData.initialFilters[type]
        delete _tagsData[type]
      }
      // handles multiple selection filters
      else if (filters[type].includes(key)) {
        _filters[type] = Array.isArray(filters[type])
          ? filters[type].filter((f) => f !== key)
          : filters[type]
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

  // -----|-----|-----|-----| EVENT HANDLERS ENDED |-----|-----|-----|----- //

  const standardProficiencyFilter = (
    <Col span={6}>
      <FilterLabel data-cy="standardProficiency">
        Standard Proficiency
      </FilterLabel>
      <ControlDropDown
        by={filters.profileId || defaultStandardProficiency?.key || ''}
        selectCB={(e, selected) =>
          updateFilterDropdownCB(selected, 'profileId')
        }
        data={standardProficiencyList}
        prefix="Standard Proficiency"
        showPrefixOnSelected={false}
      />
    </Col>
  )

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
        <ReportFiltersWrapper data-cy="filters" visible={showFilter}>
          {loading ? (
            <Spin />
          ) : (
            <Row>
              <Col span={24} style={{ padding: '0 5px' }}>
                <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                    tab={staticDropDownData.filterSections.CLASS_FILTERS.title}
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
                          termId={filters.termId}
                          schoolIds={filters.schoolIds}
                          teacherIds={filters.teacherIds}
                          grade={filters.grade !== 'All' && filters.grade}
                          subject={filters.subject !== 'All' && filters.subject}
                          courseId={
                            filters.courseId !== 'All' && filters.courseId
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
                          grade={filters.grade !== 'All' && filters.grade}
                          subject={filters.subject !== 'All' && filters.subject}
                          courseId={
                            filters.courseId !== 'All' && filters.courseId
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
                      <Col span={6}>
                        <AssessmentsAutoComplete
                          dataCy="tests"
                          termId={filters.termId}
                          grade={
                            filters.testGrade !== 'All' && filters.testGrade
                          }
                          subject={
                            filters.testSubject !== 'All' && filters.testSubject
                          }
                          tags={filters.tags}
                          testTypes={filters.assessmentTypes}
                          selectedTestIds={testIds}
                          selectCB={onSelectTest}
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>

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
                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.STANDARD_FILTERS.key}
                    tab={
                      staticDropDownData.filterSections.STANDARD_FILTERS.title
                    }
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      <Col span={6}>
                        <FilterLabel data-cy="standardSet">
                          Curriculum
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.curriculumId}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'curriculumId')
                          }
                          data={curriculumsList}
                          prefix="Standard Set"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="standardGrade">
                          Standard Grade
                        </FilterLabel>
                        <ControlDropDown
                          by={filters.standardGrade}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'standardGrade')
                          }
                          data={staticDropDownData.allGrades}
                          prefix="Standard Grade"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      {loc !== 'standards-progress' &&
                        standardProficiencyFilter}
                      <Col span={6}>
                        <FilterLabel data-cy="domain">Domain</FilterLabel>
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
                      </Col>
                      {loc === 'standards-progress' && (
                        <Col span={6}>
                          <FilterLabel data-cy="standard">Standard</FilterLabel>
                          <ControlDropDown
                            by={filters.standardId || standardsList[0]}
                            selectCB={(e, selected) =>
                              updateFilterDropdownCB(selected, 'standardId')
                            }
                            data={standardsList}
                            prefix="Standard"
                            showPrefixOnSelected={false}
                          />
                        </Col>
                      )}
                      {loc === 'standards-progress' &&
                        standardProficiencyFilter}
                    </Row>
                  </Tabs.TabPane>
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
