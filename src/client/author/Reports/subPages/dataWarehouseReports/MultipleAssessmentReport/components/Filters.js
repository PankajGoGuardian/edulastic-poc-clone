import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { get, pickBy, isEmpty, reject } from 'lodash'
import { Row, Col, Tabs } from 'antd'

import { EduIf, FieldLabel } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

import {
  ReportFiltersContainer,
  StyledEduButton,
  ReportFiltersWrapper,
  StyledDropDownContainer,
  FilterLabel,
  SecondaryFilterRow,
} from '../../../../common/styled'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import FilterTags from '../../../../common/components/FilterTags'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import ClassAutoComplete from '../../../../common/components/autocompletes/ClassAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import TagFilter from '../../../../../src/components/common/TagFilter'
// import AssessmentsAutoComplete from '../../../../common/components/autocompletes/AssessmentsAutoComplete'
import CourseAutoComplete from '../../../../common/components/autocompletes/CourseAutoComplete'
import GroupsAutoComplete from '../../../../common/components/autocompletes/GroupsAutoComplete'

import { resetStudentFilters as resetFilters } from '../../../../common/util'
import { getTermOptions } from '../../../../../utils/reports'
import { staticDropDownData } from '../utils'

import { getArrayOfAllTestTypes } from '../../../../../../common/utils/testTypeUtils'
import { allFilterValue } from '../../../../common/constants'
import {
  EXTERNAL_SCORE_TYPES,
  getDemographicsFilterTagsData,
  getExternalScoreTypesListByTestTypes,
  getDefaultTestTypesForUser,
} from '../../common/utils'
import ExternalScoreTypeFilter from '../../common/components/ExternalScoreTypeFilter'

const internalTestTypes = getArrayOfAllTestTypes()

const MultipleAssessmentReportFilters = ({
  // value props
  showFilter,
  showApply,
  firstLoad = false,
  isPrinting = false,
  location,
  userRole,
  orgData,
  defaultTermId,
  reportId = '',
  loadingFiltersData,
  prevFiltersData,
  filtersData,
  filtersTabKey,
  filters,
  filterTagsData,
  selectedFilterTagsData = {},
  // action props
  toggleFilter,
  setShowApply,
  setFirstLoad,
  fetchFiltersDataRequest,
  setFiltersTabKey,
  setFilters,
  setFilterTagsData,
  setPrevFiltersData,
  onGoClick: _onGoClick,
  fetchUpdateTagsData,
  history,
}) => {
  const tagTypes = staticDropDownData.tagTypes
  const { terms = [], schools } = orgData
  const schoolYears = useMemo(() => getTermOptions(terms), [terms])
  const institutionIds = useMemo(() => schools.map((s) => s._id), [schools])

  const {
    bandInfo = [],
    demographics = [],
    testTypes: availableAssessmentTypes = internalTestTypes,
  } = get(filtersData, 'data.result', {})
  const performanceBandsList = useMemo(
    () => bandInfo.map((p) => ({ key: p._id, title: p.name })),
    [bandInfo]
  )
  const selectedPerformanceBand =
    performanceBandsList.find((p) => p.key === filters.profileId) ||
    performanceBandsList[0]

  const externalScoreTypesList = getExternalScoreTypesListByTestTypes(
    filters.assessmentTypes,
    availableAssessmentTypes
  )
  const selectedExternalScoreType =
    externalScoreTypesList.find(
      (item) => item.key === filters.externalScoreType
    ) ||
    externalScoreTypesList.find(
      (item) => item.key === EXTERNAL_SCORE_TYPES.SCALED_SCORE
    )

  const search = useMemo(
    () =>
      pickBy(
        qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
        (f) => !['All', 'all'].includes(f) && !isEmpty(f)
      ),
    [location.search]
  )

  useEffect(() => {
    if (reportId) {
      fetchFiltersDataRequest({
        reportId,
        externalTestTypesRequired: true,
        externalTestsRequired: true,
      })
      setFilters({ ...filters, ...search })
    } else {
      const termId =
        search.termId ||
        defaultTermId ||
        (schoolYears.length ? schoolYears[0].key : '')
      const q = { ...search, termId }
      if (firstLoad && isEmpty(search)) {
        q.firstLoad = true
      }
      if (userRole === roleuser.SCHOOL_ADMIN) {
        q.schoolIds = institutionIds.join(',')
      }
      q.externalTestTypesRequired = true
      q.externalTestsRequired = true
      fetchFiltersDataRequest(q)
    }
  }, [])

  useEffect(() => {
    if (filtersData !== prevFiltersData && !isEmpty(filtersData)) {
      if (reportId) {
        _onGoClick({
          requestFilters: { ...filters, ...search },
          selectedFilterTagsData: {},
        })
      } else {
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
          performanceBandsList.find((item) => item.key === search.profileId) ||
          performanceBandsList[0]

        const testTypes = get(filtersData, 'data.result.testTypes')
        const defaultTestTypes = getDefaultTestTypesForUser(testTypes, userRole)

        const _filters = {
          termId: urlSchoolYear.key,
          testSubjects: urlTestSubjects.map((item) => item.key).join(',') || '',
          testGrades: urlTestGrades.map((item) => item.key).join(',') || '',
          tagIds: search.tagIds || '',
          assessmentTypes: search.assessmentTypes || defaultTestTypes,
          testIds: search.testIds || '',
          schoolIds: search.schoolIds || '',
          teacherIds: search.teacherIds || '',
          subjects: urlSubjects.map((item) => item.key).join(',') || '',
          grades: urlGrades.map((item) => item.key).join(',') || '',
          courseId: search.courseId || 'All',
          classIds: search.classIds || '',
          groupIds: search.groupIds || '',
          profileId: urlPerformanceBand?.key || '',
          externalScoreType:
            search.externalScoreType || EXTERNAL_SCORE_TYPES.SCALED_SCORE,
          race: search.race || allFilterValue,
          gender: search.gender || allFilterValue,
          iepStatus: search.iepStatus || allFilterValue,
          frlStatus: search.frlStatus || allFilterValue,
          ellStatus: search.ellStatus || allFilterValue,
          hispanicEthnicity: search.hispanicEthnicity || allFilterValue,
        }
        if (userRole === roleuser.TEACHER) {
          delete _filters.schoolIds
          delete _filters.teacherIds
        }
        const assessmentTypesArr = (
          search.assessmentTypes || defaultTestTypes
        ).split(',')
        const demographicsData = get(filtersData, 'data.result.demographics')
        const demographicsFilterTagsData = getDemographicsFilterTagsData(
          search,
          demographicsData
        )
        const _filterTagsData = {
          termId: urlSchoolYear,
          testSubjects: urlTestSubjects,
          testGrades: urlTestGrades,
          assessmentTypes: availableAssessmentTypes.filter((a) =>
            assessmentTypesArr.includes(a.key)
          ),
          subjects: urlSubjects,
          grades: urlGrades,
          profileId: urlPerformanceBand,
          ...demographicsFilterTagsData,
        }

        // set filterTagsData, filters and testId
        setFilterTagsData(_filterTagsData)
        setFilters(_filters)
        if (location.state?.source === 'data-warehouse-reports') {
          setShowApply(true)
          toggleFilter(null, true)
        } else {
          _onGoClick({
            requestFilters: { ..._filters },
            selectedCompareBy: search.selectedCompareBy,
            selectedFilterTagsData: { ..._filterTagsData },
          })
          fetchUpdateTagsData({
            schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
            courseId: reject([search.courseId], isEmpty),
            classIds: reject(_filters.classIds?.split(','), isEmpty),
            groupIds: reject(_filters.groupIds?.split(','), isEmpty),
            teacherIds: reject(_filters.teacherIds?.split(','), isEmpty),
            tagIds: reject(_filters.tagIds?.split(','), isEmpty),
            options: {
              termId: _filters.termId,
              schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
            },
          })
        }
      }
      setFirstLoad(false)
      // update prevMARFilterData
      setPrevFiltersData(filtersData)
    }
  }, [filtersData, prevFiltersData])

  const onGoClick = (_settings = {}) => {
    const settings = {
      requestFilters: { ...filters },
      selectedFilterTagsData: { ...filterTagsData },
      ..._settings,
    }
    setFilters({ ...filters, showApply: false })
    setShowApply(false)
    _onGoClick(settings)
    toggleFilter(null, false)
  }

  const handleCloseTag = (type, { key }) => {
    const _filterTagsData = { ...filterTagsData }
    const _filters = { ...filters }
    resetFilters(_filterTagsData, _filters, type, '')
    // handles single selection filters
    if (filters[type] === key) {
      _filters[type] = staticDropDownData.initialFilters[type]
      delete _filterTagsData[type]
    }
    // handles multiple selection filters
    else if (filters[type].includes(key)) {
      _filters[type] = filters[type]
        .split(',')
        .filter((d) => d !== key)
        .join(',')
      _filterTagsData[type] = filterTagsData[type].filter((d) => d.key !== key)
    }
    setFilters(_filters)
    setFilterTagsData(_filterTagsData)
    setShowApply(true)
    toggleFilter(null, true)
  }

  const handleTagClick = (filterKey) => {
    const _filtersTabKey =
      staticDropDownData.tagTypes.find((filter) => filter.key === filterKey)
        ?.tabKey || -1
    if (_filtersTabKey !== -1) {
      toggleFilter(null, true)
      setFiltersTabKey(_filtersTabKey)
    }
  }

  const updateFilterDropdownCB = (
    selected,
    keyName,
    multiple = false,
    isPageLevelFilter = false
  ) => {
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    const _filterTagsData = { ...filterTagsData, [keyName]: selected }
    if (
      !multiple &&
      (!selected.key || selected.key === 'All' || selected.key === 'all')
    ) {
      delete _filterTagsData[keyName]
    }
    const _filters = { ...filters }
    // reset filters and update tags data
    resetFilters(_filterTagsData, _filters, keyName, _selected)
    setFilterTagsData(_filterTagsData)
    // update filters and filters tab
    _filters[keyName] = _selected
    // reset externalScoreType when assessmentTypes are updated
    if (keyName === 'assessmentTypes') {
      _filters.externalScoreType = EXTERNAL_SCORE_TYPES.SCALED_SCORE
    }
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    if (keyName === 'profileId') {
      setFiltersTabKey(
        staticDropDownData.filterSections.PERFORMANCE_FILTERS.key
      )
      setFilters({ ..._filters, showApply: true })
      setShowApply(true)
    }
    if (isPageLevelFilter) {
      setFilters({ ..._filters, showApply: true })
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  return (
    <Row type="flex" gutter={[0, 5]} style={{ width: '100%' }}>
      <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
        <FilterTags
          isPrinting={isPrinting}
          visible={!reportId}
          tagsData={selectedFilterTagsData}
          tagTypes={tagTypes}
          handleCloseTag={handleCloseTag}
          handleTagClick={handleTagClick}
        />
        <ReportFiltersContainer visible={!reportId}>
          <StyledEduButton
            data-cy="filters"
            data-testid="filters"
            isGhost={!showFilter}
            onClick={toggleFilter}
            style={{ height: '24px' }}
          >
            <IconFilter width={15} height={15} />
            FILTERS
          </StyledEduButton>
          <ReportFiltersWrapper
            visible={showFilter}
            style={{ paddingTop: '25px' }}
          >
            <Row>
              <Col span={24} style={{ padding: '0 5px' }}>
                <Tabs
                  animated={false}
                  activeKey={filtersTabKey}
                  onChange={setFiltersTabKey}
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
                          onChange={(e) => {
                            const selected = availableAssessmentTypes.filter(
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
                          options={availableAssessmentTypes}
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
                      {/* <Col span={18}>
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
                      </Col> */}
                    </Row>
                  </Tabs.TabPane>

                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                    tab={staticDropDownData.filterSections.CLASS_FILTERS.title}
                    forceRender
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      {/* <Col span={6}>
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
                      </Col> */}
                      {roleuser.DA_SA_ROLE_ARRAY.includes(userRole) && (
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
                      <Col span={6}>
                        <FilterLabel data-cy="performanceBand">
                          Performance Band
                        </FilterLabel>
                        <ControlDropDown
                          by={{ key: filters.profileId }}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'profileId')
                          }
                          data={performanceBandsList}
                          prefix="Performance Band"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>

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
                      {demographics.map((item) => (
                        <Col span={6}>
                          <FilterLabel data-cy={item.key}>
                            {item.title}
                          </FilterLabel>
                          <ControlDropDown
                            by={filters[item.key] || item.data[0]}
                            selectCB={(e, selected) =>
                              updateFilterDropdownCB(selected, item.key)
                            }
                            data={item.data}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Tabs.TabPane>
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
                  data-testid="cancelFilter"
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
                  data-testid="applyFilter"
                  disabled={!showApply || loadingFiltersData}
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
        <SecondaryFilterRow hidden={!!reportId} width="100%" fieldHeight="40px">
          <EduIf condition={externalScoreTypesList.length}>
            <ExternalScoreTypeFilter
              selectedExternalScoreType={selectedExternalScoreType}
              externalScoreTypesList={externalScoreTypesList}
              updateFilterDropdownCB={(selected, key) =>
                updateFilterDropdownCB(selected, key, false, true)
              }
            />
          </EduIf>
          <StyledDropDownContainer
            flex="0 0 300px"
            xs={24}
            sm={12}
            lg={6}
            data-cy="performanceBand"
            data-testid="performanceBand"
          >
            <FieldLabel fs=".7rem">EDULASTIC PERFORMANCE BAND</FieldLabel>
            <ControlDropDown
              by={selectedPerformanceBand}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'profileId', false, true)
              }
              data={performanceBandsList}
              prefix="Performance Band"
              showPrefixOnSelected={false}
            />
          </StyledDropDownContainer>
          {filters.showApply && (
            <StyledEduButton
              btnType="primary"
              data-testid="applyRowFilter"
              data-cy="applyRowFilter"
              disabled={loadingFiltersData}
              onClick={() => onGoClick()}
            >
              APPLY
            </StyledEduButton>
          )}
        </SecondaryFilterRow>
      </Col>
    </Row>
  )
}

export default MultipleAssessmentReportFilters
