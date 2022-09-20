import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { get, pickBy, isEmpty, reject } from 'lodash'
import { Row, Col } from 'antd'

import { IconFilter } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { FieldLabel } from '@edulastic/common'
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
import CourseAutoComplete from '../../../../common/components/autocompletes/CourseAutoComplete'
import ClassAutoComplete from '../../../../common/components/autocompletes/ClassAutoComplete'
import StudentAutoComplete from './StudentAutoComplete'

import { resetStudentFilters as resetFilters } from '../../../../common/util'
import { getTermOptions } from '../../common/utils/transformers'
import { getStudentName, staticDropDownData } from '../utils'

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

const WholeChildReportFilters = ({
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
  student = {},
  filters = staticDropDownData.initialFilters,
  filterTagsData,
  selectedFilterTagsData = {},
  // action props
  toggleFilter,
  setShowApply,
  setFirstLoad,
  fetchFiltersDataRequest,
  setStudent,
  setFilters,
  setFilterTagsData,
  setPrevFiltersData,
  onGoClick: _onGoClick,
  fetchUpdateTagsData,
}) => {
  const tagTypes = staticDropDownData.tagTypes
  const splittedPath = location.pathname.split('/')
  const urlStudentId = splittedPath[splittedPath.length - 1]
  const { terms = [] } = orgData
  const termOptions = useMemo(() => getTermOptions(terms), [terms])

  const { studentClassData = [], bandInfo = [] } = get(
    filtersData,
    'data.result',
    {}
  )
  const performanceBandsList = useMemo(
    () => bandInfo.map((p) => ({ key: p._id, title: p.name })),
    [bandInfo]
  )
  const selectedPerformanceBand =
    performanceBandsList.find(
      (p) => p.key === filters.performanceBandProfileId
    ) || performanceBandsList[0]

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
    const _filters = {
      reportId: reportId || '',
      termId: urlSchoolYear.key,
      grades: urlGrades.map((item) => item.key).join(',') || '',
      subjects: urlSubjects.map((item) => item.key).join(',') || '',
      schoolIds: search.schoolIds || '',
      classIds: search.classIds || '',
      courseIds: search.courseIds || '',
      performanceBandProfileId: '',
    }
    if (!roleuser.DA_SA_ROLE_ARRAY.includes(userRole)) {
      delete _filters.schoolIds
    }
    const _filterTagsData = {
      ...filterTagsData,
      termId: urlSchoolYear,
      grades: urlGrades,
      subjects: urlSubjects,
    }
    setFilters(_filters)
    setFilterTagsData(_filterTagsData)
    if (reportId) {
      fetchFiltersDataRequest({ reportId })
    }
    if (urlStudentId) {
      setStudent({ key: urlStudentId })
    }
  }, [])

  if (filtersData !== prevFiltersData && !isEmpty(filtersData)) {
    const _student = { ...student }
    if (studentClassData.length) {
      // missing selected student name, extract it from the class data
      const classRecord = studentClassData[0]
      _student.title = getStudentName(classRecord)
      if (!student.title) {
        setStudent({ ..._student })
        setFilterTagsData({ ...filterTagsData, student: _student })
      }
    }
    if (firstLoad && reportId) {
      _onGoClick({
        filters: { ...filters },
        selectedStudent: _student,
        tagsData: { ...filterTagsData },
      })
      setShowApply(false)
      setFirstLoad(false)
    } else if (firstLoad && !reportId && filters.termId) {
      const _filters = {
        ...filters,
        performanceBandProfileId: selectedPerformanceBand?.key || '',
      }
      const _filterTagsData = {
        ...filterTagsData,
        performanceBandProfileId: selectedPerformanceBand,
        student: _student,
      }
      setFilters({ ..._filters })
      setFilterTagsData({ ..._filterTagsData })
      if (location.state?.source === 'data-warehouse-reports') {
        setShowApply(true)
        toggleFilter(null, true)
      } else {
        _onGoClick({
          filters: { ..._filters },
          selectedStudent: _student,
          selectedFilterTagsData: { ..._filterTagsData },
        })
        // TODO: add mapping and support to enable this feature
        fetchUpdateTagsData({
          schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          courseIds: reject([search.courseId], isEmpty),
          classIds: reject(_filters.classIds?.split(','), isEmpty),
          options: {
            termId: _filters.termId,
          },
        })
      }
      setFirstLoad(false)
    }
    setPrevFiltersData(filtersData)
  }

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      selectedStudent: student,
      selectedFilterTagsData: { ...filterTagsData },
      ..._settings,
    }
    setFilters({ ...filters, showApply: false })
    setShowApply(false)
    _onGoClick(settings)
    toggleFilter(null, false)
  }

  const onStudentSelect = (selected) => {
    const _filterTagsData = { ...filterTagsData, student: selected }
    if (selected && selected.key) {
      setStudent(selected)
      if (!firstLoad || location.state?.source === 'data-warehouse-reports') {
        setFilters({ ...filters, showApply: true })
      }
      // BUG updates the student details(student-profile) even before `Apply` is clicked.
      fetchFiltersDataRequest({
        termId: filters.termId,
        studentId: selected.key,
      })
    } else {
      delete _filterTagsData.student
    }
    setFilterTagsData(_filterTagsData)
  }

  const resetReportFilters = (nextTagsData, prevFilters, key, selected) => {
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
  }

  const handleCloseTag = (type, { key }) => {
    const _filterTagsData = { ...filterTagsData }
    const _filters = { ...filters }
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
  }

  const handleTagClick = () => {
    toggleFilter(null, true)
  }

  const updateFilterDropdownCB = (
    selected,
    keyName,
    multiple = false,
    isPageLevelFilter = false
  ) => {
    // update tags data
    const _filterTagsData = { ...filterTagsData, [keyName]: selected }
    if (!multiple && (!selected.key || selected.key === 'All')) {
      delete _filterTagsData[keyName]
    }
    const _filters = { ...filters }
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    resetReportFilters(_filterTagsData, _filters, keyName, _selected)
    setFilterTagsData(_filterTagsData)
    // update filters
    _filters[keyName] = _selected
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
                <Row type="flex" gutter={[5, 10]}>
                  <Col span={8}>
                    <FilterLabel data-cy="schoolYear">School Year</FilterLabel>
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
                  {roleuser.DA_SA_ROLE_ARRAY.includes(userRole) ? (
                    <Col span={8}>
                      <SchoolAutoComplete
                        dataCy="schools"
                        selectedSchoolIds={
                          filters.schoolIds ? filters.schoolIds.split(',') : []
                        }
                        selectCB={(e) =>
                          updateFilterDropdownCB(e, 'schoolIds', true)
                        }
                      />
                    </Col>
                  ) : null}
                  <Col span={8}>
                    <FilterLabel data-cy="course">Course</FilterLabel>
                    <CourseAutoComplete
                      selectedCourseId={filters.courseId}
                      selectCB={(e) => updateFilterDropdownCB(e, 'courseId')}
                    />
                  </Col>
                </Row>
                <Row type="flex" gutter={[5, 10]}>
                  <Col span={8}>
                    <MultiSelectDropdown
                      dataCy="classGrade"
                      data-testid="classGrade"
                      label="Class Grade"
                      onChange={(e) => {
                        const selected = staticDropDownData.grades.filter((a) =>
                          e.includes(a.key)
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
                  <Col span={8}>
                    <MultiSelectDropdown
                      dataCy="classSubject"
                      data-testid="classSubject"
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
                  <Col span={8}>
                    <ClassAutoComplete
                      dataCy="classes"
                      data-testid="classes"
                      termId={filters.termId}
                      schoolIds={filters.schoolIds}
                      courseIds={filters.courseIds}
                      grades={filters.grades}
                      subjects={filters.subjects}
                      selectedClassIds={
                        filters.classIds ? filters.classIds.split(',') : []
                      }
                      selectCB={(e) =>
                        updateFilterDropdownCB(e, 'classIds', true)
                      }
                    />
                  </Col>
                </Row>
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
          <StyledDropDownContainer
            flex="0 0 300px"
            xs={24}
            sm={12}
            lg={6}
            data-cy="student"
          >
            <FieldLabel fs=".7rem" data-cy="schoolYear">
              SEARCH FOR ANOTHER STUDENT
            </FieldLabel>
            <StudentAutoComplete
              firstLoad={firstLoad}
              termId={filters.termId}
              schoolIds={filters.schoolIds}
              grades={filters.grades}
              subjects={filters.subjects}
              courseIds={filters.courseIds}
              classIds={filters.classIds}
              selectedStudentId={student.key || urlStudentId}
              selectCB={onStudentSelect}
            />
          </StyledDropDownContainer>
          <StyledDropDownContainer
            flex="0 0 300px"
            xs={24}
            sm={12}
            lg={6}
            data-cy="performanceBand"
            data-testid="performanceBand"
          >
            <FieldLabel fs=".7rem" data-cy="schoolYear">
              PERFORMANCE BAND
            </FieldLabel>
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

export default WholeChildReportFilters
