import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy, reject, omit } from 'lodash'
import qs from 'qs'

import { Tabs, Row, Col } from 'antd'

import { IconFilter } from '@edulastic/icons'

import { reportGroupType } from '@edulastic/constants/const/report'
import FilterTags from '../../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import CoursesAutoComplete from '../../../../../common/components/autocompletes/CoursesAutoComplete'
import ClassAutoComplete from './ClassAutoComplete'
import StudentAutoComplete from './StudentAutoComplete'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
  StyledEduButton,
  StyledDropDownContainer,
} from '../../../../../common/styled'

import {
  getUserRole,
  getOrgDataSelector,
  getCurrentTerm,
  getInterestedCurriculumsSelector,
} from '../../../../../../src/selectors/user'
import {
  getFiltersSelector,
  getStudentSelector,
  getTempTagsDataSelector,
  getReportsPrevSPRFilterData,
  setPrevSPRFilterDataAction,
  getReportsSPRFilterLoadingState,
  setFiltersAction,
  getSPRFilterDataRequestAction,
  getReportsSPRFilterData,
  setStudentAction,
  setTempTagsDataAction,
} from '../../filterDataDucks'
import { getReportsStudentProgressProfile } from '../../../StudentProgressProfile/ducks'

import {
  getTermOptions,
  getDomainOptions,
  getStandardOptions,
  getCurriculumsList,
} from '../../utils/transformers'
import { getFullNameFromAsString } from '../../../../../../../common/utils/helpers'
import { resetStudentFilters as resetFilters } from '../../../../../common/util'

import staticDropDownData from '../../static/staticDropDownData.json'
import { fetchUpdateTagsDataAction } from '../../../../../ducks'
import { StyledSelectInput } from '../styledComponents'

const filtersDefaultValues = [
  {
    key: 'termId',
    value: '',
  },
  {
    key: 'courseIds',
    value: '',
  },
  {
    key: '',
    nestedFilters: [
      {
        key: 'grades',
        value: '',
      },
      {
        key: 'subjects',
        value: '',
      },
    ],
  },
]

const StudentProfileReportFilters = ({
  loc,
  isPrinting,
  onGoClick: _onGoClick,
  SPRFilterData,
  prevSPRFilterData,
  location,
  orgData,
  getSPRFilterDataRequest,
  setPrevSPRFilterData,
  filters,
  student,
  performanceBandRequired,
  standardProficiencyRequired,
  standardFiltersRequired,
  setFilters,
  setStudent,
  tempTagsData,
  setTempTagsData,
  tagsData,
  showApply,
  setShowApply,
  showFilter,
  toggleFilter,
  firstLoad,
  setFirstLoad,
  defaultTermId,
  history,
  reportId,
  loading,
  studentProgressProfile,
  fetchUpdateTagsData,
  interestedCurriculums,
}) => {
  const [activeTabKey, setActiveTabKey] = useState(
    staticDropDownData.filterSections.CLASS_FILTERS.key
  )
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'performanceBandProfileId') &&
      (standardProficiencyRequired ||
        t.key !== 'standardsProficiencyProfileId') &&
      (standardFiltersRequired ||
        !['domainId', 'standardId', 'testIds'].includes(t.key))
  )
  const splittedPath = location.pathname.split('/')
  const urlStudentId = splittedPath[splittedPath.length - 1]

  const { terms = [] } = orgData
  const termOptions = useMemo(() => getTermOptions(terms), [terms])

  const { studentClassData = [], bandInfo = [], scaleInfo = [] } = get(
    SPRFilterData,
    'data.result',
    {}
  )
  const performanceBandsList = useMemo(
    () => bandInfo.map((p) => ({ key: p._id, title: p.name })),
    [SPRFilterData]
  )
  const standardProficiencyList = useMemo(
    () => scaleInfo.map((s) => ({ key: s._id, title: s.name })),
    [SPRFilterData]
  )
  const selectedPerformanceBand =
    performanceBandsList.find(
      (p) => p.key === filters.performanceBandProfileId
    ) || performanceBandsList[0]
  const selectedStandardProficiency =
    standardProficiencyList.find(
      (p) => p.key === filters.standardsProficiencyProfileId
    ) || standardProficiencyList[0]

  const skillInfo = useMemo(
    () => get(studentProgressProfile, 'data.result.skillInfo', []),
    [studentProgressProfile]
  )

  const domainOptions = getDomainOptions(skillInfo, filters.curriculumId)
  const standardOptions = getStandardOptions(
    skillInfo,
    filters.domainId,
    filters.curriculumId
  )

  const curriculumsOptions = useMemo(() => {
    return getCurriculumsList(interestedCurriculums)
  }, [interestedCurriculums])

  const search = useMemo(
    () =>
      pickBy(
        qs.parse(location.search, { ignoreQueryPrefix: true }),
        (f) => f !== 'All' && !isEmpty(f)
      ),
    [location.search]
  )

  useEffect(() => {
    const urlSchoolYear =
      termOptions.find((item) => item.key === search.termId) ||
      termOptions.find((item) => item.key === defaultTermId) ||
      (termOptions[0] ? termOptions[0] : { key: '', title: '' })
    const urlSubjects = staticDropDownData.subjects.filter(
      (item) => search.subjects && search.subjects.includes(item.key)
    )
    const urlGrades = staticDropDownData.grades.filter(
      (item) => search.grades && search.grades.includes(item.key)
    )
    const urlAssignedBy =
      staticDropDownData.assignedBy.find((a) => a.key === search.assignedBy) ||
      staticDropDownData.assignedBy[0]

    const _filters = {
      reportId: reportId || '',
      termId: urlSchoolYear.key,
      grades: urlGrades.map((item) => item.key).join(',') || '',
      subjects: urlSubjects.map((item) => item.key).join(',') || '',
      classIds: search.classIds || '',
      courseIds: search.courseIds || '',
      performanceBandProfileId: '',
      standardsProficiencyProfileId: '',
      assignedBy: urlAssignedBy.key,
    }
    const _tempTagsData = {
      ...tempTagsData,
      termId: urlSchoolYear,
      grades: urlGrades,
      subjects: urlSubjects,
      assignedBy: urlAssignedBy,
    }
    setFilters(_filters)
    setTempTagsData(_tempTagsData)
    if (reportId) {
      getSPRFilterDataRequest({ reportId })
    }
    if (urlStudentId) {
      setStudent({ key: urlStudentId })
    }
  }, [])

  const isTabRequired = (tabKey) => {
    switch (tabKey) {
      case staticDropDownData.filterSections.CLASS_FILTERS.key:
        return true
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
    if (!standardFiltersRequired && !firstLoad) {
      setFilters({
        ...filters,
        domainId: 'All',
        standardId: 'All',
      })
      setTempTagsData(omit({ ...tempTagsData }, ['domainId', 'standardId']))
    }
  }, [loc])

  if (SPRFilterData !== prevSPRFilterData && !isEmpty(SPRFilterData)) {
    const _student = { ...student }
    if (studentClassData.length) {
      // missing selected student name, extract it from the class data
      const classRecord = studentClassData[0]
      _student.title = getFullNameFromAsString(classRecord)
      if (!student.title) {
        setStudent({ ..._student })
        setTempTagsData({ ...tempTagsData, student: _student })
      }
    }
    if (firstLoad && reportId) {
      _onGoClick({
        filters: { ...filters },
        selectedStudent: _student,
        tagsData: { ...tempTagsData },
      })
      setShowApply(false)
      setFirstLoad(false)
    } else if (firstLoad && !reportId && filters.termId) {
      const _filters = {
        ...filters,
        performanceBandProfileId: selectedPerformanceBand?.key || '',
        standardsProficiencyProfileId: selectedStandardProficiency?.key || '',
      }
      const _tempTagsData = {
        ...tempTagsData,
        performanceBandProfileId: selectedPerformanceBand,
        standardsProficiencyProfileId: selectedStandardProficiency,
        student: _student,
      }
      setFilters({ ..._filters })
      setTempTagsData({ ..._tempTagsData })
      if (location.state?.source === 'standard-reports') {
        setShowApply(true)
        toggleFilter(null, true)
      } else {
        _onGoClick({
          filters: { ..._filters },
          selectedStudent: _student,
          tagsData: { ..._tempTagsData },
        })
        fetchUpdateTagsData({
          classIds: reject(search.classIds?.split(','), isEmpty),
          courseIds: reject(search.courseIds?.split(','), isEmpty),
          options: {
            termId: _filters.termId,
          },
        })
      }
      setFirstLoad(false)
    }
    setPrevSPRFilterData(SPRFilterData)
  }

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      selectedStudent: student,
      tagsData: { ...tempTagsData },
      ..._settings,
    }
    setFilters({ ...filters, showApply: false })
    setShowApply(false)
    _onGoClick(settings)
    toggleFilter(null, false)
  }

  const getNewPathname = () => {
    const splitted = location.pathname.split('/')
    splitted.splice(splitted.length - 1)
    return `${splitted.join('/')}/`
  }

  const onStudentSelect = (selected) => {
    const _tempTagsData = { ...tempTagsData, student: selected }
    if (selected && selected.key) {
      setStudent(selected)
      if (!firstLoad || location.state?.source === 'standard-reports') {
        setFilters({ ...filters, showApply: true })
      }
      getSPRFilterDataRequest({
        termId: filters.termId,
        studentId: selected.key,
      })
    } else {
      delete _tempTagsData.student
    }
    setTempTagsData(_tempTagsData)
  }

  const resetSPRFilters = (nextTagsData, prevFilters, key, selected) => {
    const index = filtersDefaultValues.findIndex((s) => s.key === key)
    if (!['grades', 'subjects'].includes(key)) {
      resetFilters(
        nextTagsData,
        prevFilters,
        key,
        selected,
        filtersDefaultValues
      )
    }
    if (
      prevFilters[key] !== selected &&
      (index !== -1 || ['grades', 'subjects'].includes(key))
    ) {
      setStudent({ key: '', title: '' })
      delete nextTagsData.student
      prevFilters.classIds = ''
      delete nextTagsData.classIds
    }
    if (key === 'domainId' && prevFilters[key] !== selected) {
      prevFilters.standardId = 'All'
      nextTagsData.standardId = {}
    }
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
    resetSPRFilters(_tempTagsData, _filters, keyName, _selected)
    setTempTagsData(_tempTagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
    if (isRowFilter) {
      setFilters({ ..._filters, showApply: true })
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  const handleCloseTag = (type, { key }) => {
    const _tempTagsData = { ...tempTagsData }
    const _filters = { ...filters }
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
    setTempTagsData(_tempTagsData)
  }

  const topFilterColSpan = standardFiltersRequired && filters.showApply ? 3 : 4

  const handleTagClick = (filterKey) => {
    const tabKey =
      staticDropDownData.tagTypes.find((filter) => filter.key === filterKey)
        ?.tabKey || -1
    if (tabKey !== -1) {
      toggleFilter(null, true)
      setActiveTabKey(tabKey)
    }
  }

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
          <ReportFiltersWrapper visible={showFilter}>
            <Row>
              <Col span={24} style={{ padding: '0 5px' }}>
                <Tabs
                  animated={false}
                  activeKey={activeTabKey}
                  onChange={setActiveTabKey}
                >
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
                          data={termOptions}
                          prefix="School Year"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <CoursesAutoComplete
                          dataCy="courses"
                          selectedCourseIds={
                            filters.courseIds
                              ? filters.courseIds.split(',')
                              : []
                          }
                          selectCB={(values) =>
                            updateFilterDropdownCB(values, 'courseIds', true)
                          }
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="classGrade"
                          label="Class Grade"
                          onChange={(values) => {
                            const selected = staticDropDownData.grades.filter(
                              (a) => values.includes(a.key)
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
                          onChange={(values) => {
                            const selected = staticDropDownData.subjects.filter(
                              (a) => values.includes(a.key)
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
                        <ClassAutoComplete
                          dataCy="classes"
                          termId={filters.termId}
                          courseIds={filters.courseIds}
                          grades={filters.grades}
                          subjects={filters.subjects}
                          selectedClassIds={
                            filters.classIds ? filters.classIds.split(',') : []
                          }
                          selectCB={(values) =>
                            updateFilterDropdownCB(values, 'classIds', true)
                          }
                        />
                      </Col>
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
                  onClick={(values) => toggleFilter(values, false)}
                >
                  Cancel
                </StyledEduButton>
                <StyledEduButton
                  width="25%"
                  height="40px"
                  style={{ maxWidth: '200px' }}
                  key="applyButton"
                  data-cy="applyFilter"
                  disabled={!showApply || loading}
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
            width: 'calc(100% + 150px)',
            float: 'right',
            paddingTop: '5px',
            display: reportId ? 'none' : 'flex',
          }}
        >
          <StyledDropDownContainer
            xs={24}
            sm={12}
            lg={topFilterColSpan}
            data-cy="student"
          >
            <StudentAutoComplete
              firstLoad={firstLoad}
              termId={filters.termId}
              grades={filters.grades}
              subjects={filters.subjects}
              courseIds={filters.courseIds}
              classIds={filters.classIds}
              selectedStudentId={student.key || urlStudentId}
              selectCB={onStudentSelect}
            />
          </StyledDropDownContainer>
          {performanceBandRequired && (
            <StyledDropDownContainer
              xs={24}
              sm={12}
              lg={topFilterColSpan}
              data-cy="performanceBand"
            >
              <ControlDropDown
                by={selectedPerformanceBand}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(
                    selected,
                    'performanceBandProfileId',
                    false,
                    true
                  )
                }
                data={performanceBandsList}
                prefix="Performance Band"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
          )}
          {standardProficiencyRequired && (
            <StyledDropDownContainer
              xs={24}
              sm={12}
              lg={topFilterColSpan}
              data-cy="standardProficiency"
            >
              <ControlDropDown
                by={selectedStandardProficiency}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(
                    selected,
                    'standardsProficiencyProfileId',
                    false,
                    true
                  )
                }
                data={standardProficiencyList}
                prefix="Standard Proficiency"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
          )}
          {standardFiltersRequired && (
            <>
              <StyledDropDownContainer
                xs={24}
                sm={12}
                lg={topFilterColSpan}
                data-cy="selectCurriculumId"
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
                  data={curriculumsOptions}
                  prefix="Standard Set"
                  showPrefixOnSelected={false}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer
                flex="0 0 230px"
                xs={24}
                sm={12}
                lg={topFilterColSpan}
                data-cy="standardProficiency"
              >
                <MultiSelectDropdown
                  dataCy="standardProficiency"
                  label="Domain(s)"
                  onChange={(values) => {
                    const selected = domainOptions.filter((a) =>
                      values.includes(a.key)
                    )
                    updateFilterDropdownCB(selected, 'domainId', true, true)
                  }}
                  value={
                    filters.domainId && filters.domainId !== 'All'
                      ? filters.domainId.split(',')
                      : []
                  }
                  options={domainOptions}
                  displayLabel={false}
                  maxTagCount={2}
                  InputComponent={StyledSelectInput}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer
                flex="0 0 280px"
                xs={24}
                sm={12}
                lg={topFilterColSpan}
                data-cy="standardProficiency"
              >
                <MultiSelectDropdown
                  dataCy="standardProficiency"
                  label="Standard(s)"
                  onChange={(values) => {
                    const selected = standardOptions.filter((a) =>
                      values.includes(a.key)
                    )
                    updateFilterDropdownCB(selected, 'standardId', true, true)
                  }}
                  value={
                    filters.standardId && filters.standardId !== 'All'
                      ? filters.standardId.split(',')
                      : []
                  }
                  options={standardOptions}
                  displayLabel={false}
                  maxTagCount={2}
                  InputComponent={StyledSelectInput}
                />
              </StyledDropDownContainer>
            </>
          )}
          {filters.showApply && (
            <StyledEduButton
              btnType="primary"
              data-cy="applyRowFilter"
              disabled={loading}
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

const enhance = connect(
  (state) => ({
    SPRFilterData: getReportsSPRFilterData(state),
    filters: getFiltersSelector(state),
    student: getStudentSelector(state),
    tempTagsData: getTempTagsDataSelector(state),
    role: getUserRole(state),
    prevSPRFilterData: getReportsPrevSPRFilterData(state),
    loading: getReportsSPRFilterLoadingState(state),
    orgData: getOrgDataSelector(state),
    defaultTermId: getCurrentTerm(state),
    studentProgressProfile: getReportsStudentProgressProfile(state),
    interestedCurriculums: getInterestedCurriculumsSelector(state),
  }),
  {
    getSPRFilterDataRequest: getSPRFilterDataRequestAction,
    setPrevSPRFilterData: setPrevSPRFilterDataAction,
    setFilters: setFiltersAction,
    setStudent: setStudentAction,
    setTempTagsData: setTempTagsDataAction,
    fetchUpdateTagsData: (opts) =>
      fetchUpdateTagsDataAction({
        type: reportGroupType.STUDENT_PROFILE_REPORT,
        ...opts,
      }),
  }
)

export default enhance(StudentProfileReportFilters)
