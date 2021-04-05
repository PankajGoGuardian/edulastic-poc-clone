import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'

import { Tabs, Row, Col } from 'antd'

import { IconFilter } from '@edulastic/icons'

import FilterTags from '../../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import CoursesAutoComplete from '../../../../../common/components/autocompletes/CoursesAutoComplete'
import ClassAutoComplete from './ClassAutoComplete'
import StudentAutoComplete from './StudentAutoComplete'

import {
  getUserRole,
  getOrgDataSelector,
  getCurrentTerm,
} from '../../../../../../src/selectors/user'
import {
  receiveStudentsListAction,
  getStudentsListSelector,
} from '../../../../../../Student/ducks'
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
import { getTermOptions } from '../../utils/transformers'
import { getFullNameFromAsString } from '../../../../../../../common/utils/helpers'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
  StyledEduButton,
} from '../../../../../common/styled'

import staticDropDownData from '../../static/staticDropDownData.json'
import { resetStudentFilters as resetFilters } from '../../../../../common/util'

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
        key: 'grade',
        value: 'All',
      },
      {
        key: 'subject',
        value: 'All',
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
}) => {
  const [activeTabKey, setActiveTabKey] = useState(
    staticDropDownData.filterSections.STUDENT_FILTERS.key
  )
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'performanceBandProfileId') &&
      (standardProficiencyRequired || t.key !== 'standardsProficiencyProfileId')
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

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    const urlSchoolYear =
      termOptions.find((item) => item.key === search.termId) ||
      termOptions.find((item) => item.key === defaultTermId) ||
      (termOptions[0] ? termOptions[0] : { key: '', title: '' })
    const urlSubject =
      staticDropDownData.subjects.find((item) => item.key === search.subject) ||
      staticDropDownData.subjects[0]
    const urlGrade =
      staticDropDownData.grades.find((item) => item.key === search.grade) ||
      staticDropDownData.grades[0]
    const _filters = {
      reportId: reportId || '',
      termId: urlSchoolYear.key,
      grade: urlGrade.key,
      subject: urlSubject.key,
      classIds: '',
      performanceBandProfileId: '',
      standardsProficiencyProfileId: '',
    }
    const _tempTagsData = {
      ...tempTagsData,
      termId: urlSchoolYear,
      grade: urlGrade,
      subject: urlSubject,
    }
    setFilters(_filters)
    setTempTagsData(_tempTagsData)

    if (reportId) {
      getSPRFilterDataRequest({ reportId })
      setStudent({ key: urlStudentId })
    } else if (urlStudentId) {
      getSPRFilterDataRequest({
        termId: _filters.termId,
        studentId: urlStudentId,
      })
      setStudent({ key: urlStudentId })
    }
  }, [])

  const isTabRequired = (tabKey) => {
    switch (tabKey) {
      case staticDropDownData.filterSections.STUDENT_FILTERS.key:
        return true
      default:
        return false
    }
  }

  useEffect(() => {
    if (showFilter && !isTabRequired(activeTabKey)) {
      setActiveTabKey(staticDropDownData.filterSections.STUDENT_FILTERS.key)
    }
  }, [loc, showFilter])

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
      setShowApply(true)
      toggleFilter(null, true)
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
      getSPRFilterDataRequest({
        termId: filters.termId,
        studentId: selected.key,
      })
    } else {
      delete _tempTagsData.student
    }
    setTempTagsData(_tempTagsData)
    setShowApply(true)
  }

  const resetSPRFilters = (nextTagsData, prevFilters, key, selected) => {
    const index = filtersDefaultValues.findIndex((s) => s.key === key)
    resetFilters(nextTagsData, prevFilters, key, selected, filtersDefaultValues)
    if (
      prevFilters[key] !== selected &&
      (index !== -1 || ['grade', 'subject'].includes(key))
    ) {
      setStudent({ key: '', title: '' })
      prevFilters.classIds = ''
      delete nextTagsData.classIds
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
    resetSPRFilters(_tempTagsData, _filters, keyName, _selected)
    setTempTagsData(_tempTagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
    setFilters(_filters)
    setShowApply(true)
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
          <Row>
            <Col span={24} style={{ padding: '0 5px' }}>
              <Tabs
                animated={false}
                activeKey={activeTabKey}
                onChange={setActiveTabKey}
              >
                <Tabs.TabPane
                  key={staticDropDownData.filterSections.STUDENT_FILTERS.key}
                  tab={staticDropDownData.filterSections.STUDENT_FILTERS.title}
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
                        data={termOptions}
                        prefix="School Year"
                        showPrefixOnSelected={false}
                      />
                    </Col>
                    <Col span={6}>
                      <CoursesAutoComplete
                        dataCy="courses"
                        selectedCourseIds={
                          filters.courseIds ? filters.courseIds.split(',') : []
                        }
                        selectCB={(e) =>
                          updateFilterDropdownCB(e, 'courseIds', true)
                        }
                      />
                    </Col>
                    <Col span={6}>
                      <FilterLabel data-cy="classGrade">
                        Class Grade
                      </FilterLabel>
                      <ControlDropDown
                        by={filters.grade}
                        selectCB={(e, selected) =>
                          updateFilterDropdownCB(selected, 'grade')
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
                      <ClassAutoComplete
                        dataCy="classes"
                        termId={filters.termId}
                        courseIds={filters.courseIds}
                        grade={filters.grade !== 'All' && filters.grade}
                        subject={filters.subject !== 'All' && filters.subject}
                        selectedClassIds={
                          filters.classIds ? filters.classIds.split(',') : []
                        }
                        selectCB={(e) =>
                          updateFilterDropdownCB(e, 'classIds', true)
                        }
                      />
                    </Col>
                    <Col span={6}>
                      <FilterLabel data-cy="student">Student</FilterLabel>
                      <StudentAutoComplete
                        firstLoad={firstLoad}
                        termId={filters.termId}
                        grade={filters.grade !== 'All' && filters.grade}
                        subject={filters.subject !== 'All' && filters.subject}
                        courseIds={filters.courseIds}
                        classIds={filters.classIds}
                        selectedStudentId={student.key || urlStudentId}
                        selectCB={onStudentSelect}
                      />
                    </Col>
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
                              'performanceBandProfileId'
                            )
                          }
                          data={performanceBandsList}
                          prefix="Performance Band"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                    )}
                    {standardProficiencyRequired && (
                      <Col span={6}>
                        <FilterLabel data-cy="standardProficiency">
                          Standard Proficiency
                        </FilterLabel>
                        <ControlDropDown
                          by={selectedStandardProficiency}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(
                              selected,
                              'standardsProficiencyProfileId'
                            )
                          }
                          data={standardProficiencyList}
                          prefix="Standard Proficiency"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                    )}
                  </Row>
                </Tabs.TabPane>
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
                disabled={!showApply || loading}
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
    studentList: getStudentsListSelector(state),
    defaultTermId: getCurrentTerm(state),
  }),
  {
    getSPRFilterDataRequest: getSPRFilterDataRequestAction,
    setPrevSPRFilterData: setPrevSPRFilterDataAction,
    receiveStudentsListAction,
    setFilters: setFiltersAction,
    setStudent: setStudentAction,
    setTempTagsData: setTempTagsDataAction,
  }
)

export default enhance(StudentProfileReportFilters)
