import React, { useEffect, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { get, find, isEmpty, pickBy } from 'lodash'
import qs from 'qs'

import { Row, Col } from 'antd'

import { EduButton } from '@edulastic/common'
import { IconFilter } from '@edulastic/icons'

import FilterTags from '../../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import StudentAutoComplete from './StudentAutoComplete'
import ClassAutoComplete from './ClassAutoComplete'
import CourseAutoComplete from './CourseAutoComplete'

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
  getSelectedClassSelector,
  getStudentSelector,
  getTagsDataSelector,
  getReportsPrevSPRFilterData,
  setPrevSPRFilterDataAction,
  getReportsSPRFilterLoadingState,
  setFiltersAction,
  getSPRFilterDataRequestAction,
  getReportsSPRFilterData,
  setSelectedClassAction,
  setStudentAction,
  setTagsDataAction,
} from '../../filterDataDucks'
import { getTermOptions } from '../../utils/transformers'
import { getFullNameFromAsString } from '../../../../../../../common/utils/helpers'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
} from '../../../../../common/styled'

import staticDropDownData from '../../static/staticDropDownData.json'
import { resetStudentFilters as resetFilters } from '../../../../../common/util'

const { subjects: subjectOptions, grades: gradeOptions } = staticDropDownData
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

const IndependentFilterIds = [
  'standardsProficiencyProfileId',
  'performanceBandProfileId',
]

const StudentProfileReportFilters = ({
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
  selectedClassIds,
  setSelectedClassIds,
  tagsData,
  setTagsData,
  showFilter,
  toggleFilter,
  defaultTerm,
  history,
  reportId,
}) => {
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) =>
      (performanceBandRequired || t.key !== 'performanceBandProfileId') &&
      (standardProficiencyRequired || t.key !== 'standardsProficiencyProfileId')
  )
  const splittedPath = location.pathname.split('/')
  const urlStudentId = splittedPath[splittedPath.length - 1]
  const parsedQuery = qs.parse(location.search, { ignoreQueryPrefix: true })

  const {
    termId: urlTermId,
    grade: urlGrade,
    subject: urlSubject,
  } = parsedQuery

  const { studentClassData = [] } = get(SPRFilterData, 'data.result', {})
  const { terms = [] } = orgData
  const termOptions = useMemo(() => getTermOptions(terms), [terms])

  const defaultTermOption = useMemo(
    () => find(termOptions, (term) => term.key === defaultTerm),
    [termOptions, defaultTerm]
  )

  const selectedTerm = useMemo(
    () =>
      find(termOptions, (term) => term.key === urlTermId) ||
      defaultTermOption ||
      {},
    [urlTermId]
  )

  const selectedGrade = useMemo(
    () => find(gradeOptions, (g) => g.key === urlGrade) || gradeOptions[0],
    [urlGrade]
  )

  const selectedSubject = useMemo(
    () =>
      find(subjectOptions, (s) => s.key === urlSubject) || subjectOptions[0],
    [urlSubject]
  )

  const performanceBandProfiles = get(SPRFilterData, 'data.result.bandInfo', [])
  const performanceBandsList = useMemo(
    () => performanceBandProfiles.map((p) => ({ key: p._id, title: p.name })),
    [performanceBandProfiles]
  )
  const selectedPerformanceBand =
    performanceBandsList.find(
      (p) => p.key === filters.performanceBandProfileId
    ) || performanceBandsList[0]

  const scales = get(SPRFilterData, 'data.result.scaleInfo', [])
  const standardProficiencyList = useMemo(
    () => scales.map((s) => ({ key: s._id, title: s.name })),
    [scales]
  )
  const selectedStandardProficiency =
    standardProficiencyList.find(
      (p) => p.key === filters.standardsProficiencyProfileId
    ) || standardProficiencyList[0]

  useEffect(() => {
    if (SPRFilterData !== prevSPRFilterData) {
      if (urlStudentId && selectedTerm.key) {
        const q = {
          termId: urlTermId,
          studentId: urlStudentId,
        }
        getSPRFilterDataRequest(q)
        setStudent({ key: urlStudentId })
      }
    }
  }, [])

  if (SPRFilterData !== prevSPRFilterData && !isEmpty(SPRFilterData)) {
    setPrevSPRFilterData(SPRFilterData)

    if (studentClassData.length) {
      // if there is no student name for the selected name extract it from the class data
      if (!student.title) {
        const classRecord = studentClassData[0]
        setStudent({
          ...student,
          title: getFullNameFromAsString(classRecord),
        })
      }
    }

    const _filters = {
      ...filters,
      termId: filters.termId || selectedTerm.key,
      grade: filters.grade || selectedGrade.key,
      subject: filters.subject || selectedSubject.key,
      reportId,
      // uncomment after making changes to chart files
      // performanceBandProfileId: selectedProfile,
      // standardsProficiencyProfileId: selectedScale
    }
    const _student = { ...student }
    const _tagsData = {
      ...tagsData,
      termId: selectedTerm,
      grade: selectedGrade,
      subject: selectedSubject,
      performanceBandProfileId: selectedPerformanceBand,
      standardsProficiencyProfileId: selectedStandardProficiency,
      student: _student,
    }
    setFilters(_filters)
    setTagsData(_tagsData)
    // load page data
    _onGoClick({
      filters: pickBy(_filters, (f) => f !== 'All' && !isEmpty(f)),
      selectedStudent: _student,
    })
  }

  const onStudentSelect = (item) => {
    const _tagsData = { ...tagsData, student: item }
    if (item && item.key) {
      setStudent(item)
      const _reportPath = splittedPath
        .slice(0, splittedPath.length - 1)
        .join('/')
      const _filters = {
        ...filters,
        ...pickBy(parsedQuery, (f) => f !== 'All' && !isEmpty(f)),
      }
      history.push(`${_reportPath}/${item.key}?${qs.stringify(_filters)}`)
      getSPRFilterDataRequest({
        termId: filters.termId || selectedTerm.key,
        studentId: item.key,
      })
    } else {
      delete _tagsData.student
      _onGoClick({
        filters,
        selectedStudent: item,
      })
    }
    setTagsData(_tagsData)
  }

  const resetSPRFilters = useCallback(
    (nextTagsData, prevFilters, key, selected) => {
      const index = filtersDefaultValues.findIndex((s) => s.key === key)
      resetFilters(
        nextTagsData,
        prevFilters,
        key,
        selected,
        filtersDefaultValues
      )
      if (
        prevFilters[key] !== selected &&
        (index !== -1 || ['grade', 'subject'].includes(key))
      ) {
        setStudent({ key: '', title: '' })
        setSelectedClassIds('')
        delete nextTagsData.classIds
      }
    }
  )

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
    resetSPRFilters(_tagsData, _filters, keyName, _selected)
    setTagsData(_tagsData)
    // update filters
    _filters[keyName] = _selected
    setFilters(_filters)
    if (IndependentFilterIds.includes(keyName)) {
      _onGoClick({
        filters: pickBy(_filters, (v) => v && v.toLowerCase() !== 'all'),
        selectedStudent: student,
      })
    }
  }

  const updateSelectedClassIds = (selected) => {
    // update tags data
    const _tagsData = { ...tagsData, classIds: selected }
    setTagsData(_tagsData)
    setSelectedClassIds(selected.map((o) => o.key).join(','))
  }

  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles selectedClassIds
    if (type === 'classIds') {
      if (selectedClassIds.includes(key)) {
        const _selectedClassIds = selectedClassIds
          .split(',')
          .filter((d) => d !== key)
          .join(',')
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
        setSelectedClassIds(_selectedClassIds)
      }
    } else {
      const _filters = { ...filters }
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
  }

  return (
    <>
      <FilterTags
        visible={!reportId}
        tagsData={tagsData}
        tagTypes={tagTypes}
        handleCloseTag={handleCloseTag}
      />
      <ReportFiltersContainer visible={!reportId}>
        <EduButton
          isGhost={!showFilter}
          onClick={toggleFilter}
          style={{ height: '24px' }}
        >
          <IconFilter width={15} height={15} />
          FILTERS
        </EduButton>
        <ReportFiltersWrapper visible={showFilter}>
          <Row
            type="flex"
            gutter={[5, 10]}
            style={{ padding: '10px 5px 0 5px' }}
          >
            <Col span={6}>
              <FilterLabel>School Year</FilterLabel>
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
              <CourseAutoComplete
                selectedCourseIds={
                  filters.courseIds ? filters.courseIds.split(',') : []
                }
                selectCB={(e) => updateFilterDropdownCB(e, 'courseIds', true)}
              />
            </Col>
            <Col span={6}>
              <FilterLabel>Class Grade</FilterLabel>
              <ControlDropDown
                by={filters.grade}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'grade')
                }
                data={gradeOptions}
                prefix="Grade"
                showPrefixOnSelected={false}
              />
            </Col>
            <Col span={6}>
              <FilterLabel>Class Subject</FilterLabel>
              <ControlDropDown
                by={filters.subject}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'subject')
                }
                data={subjectOptions}
                prefix="Subject"
                showPrefixOnSelected={false}
              />
            </Col>
            <Col span={6}>
              <ClassAutoComplete
                termId={filters.termId}
                selectedCourseIds={filters.courseIds}
                selectedGrade={filters.grade !== 'All' && filters.grade}
                selectedSubject={filters.subject !== 'All' && filters.subject}
                selectedClassIds={
                  selectedClassIds ? selectedClassIds.split(',') : []
                }
                selectCB={updateSelectedClassIds}
              />
            </Col>
            <Col span={6}>
              <FilterLabel>Student</FilterLabel>
              <StudentAutoComplete
                termId={filters.termId || selectedTerm.key}
                selectedCourseIds={filters.courseIds}
                selectedGrade={filters.grade !== 'All' && filters.grade}
                selectedSubject={filters.subject !== 'All' && filters.subject}
                selectedClasses={selectedClassIds}
                selectedStudent={student}
                selectCB={onStudentSelect}
              />
            </Col>
            {performanceBandRequired && (
              <Col span={6}>
                <FilterLabel>Performance Band</FilterLabel>
                <ControlDropDown
                  by={selectedPerformanceBand}
                  selectCB={(e, selected) =>
                    updateFilterDropdownCB(selected, 'performanceBandProfileId')
                  }
                  data={performanceBandsList}
                  prefix="Performance Band"
                  showPrefixOnSelected={false}
                />
              </Col>
            )}
            {standardProficiencyRequired && (
              <Col span={6}>
                <FilterLabel>Standard Proficiency</FilterLabel>
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
    selectedClassIds: getSelectedClassSelector(state),
    tagsData: getTagsDataSelector(state),
    role: getUserRole(state),
    prevSPRFilterData: getReportsPrevSPRFilterData(state),
    loading: getReportsSPRFilterLoadingState(state),
    orgData: getOrgDataSelector(state),
    studentList: getStudentsListSelector(state),
    defaultTerm: getCurrentTerm(state),
  }),
  {
    getSPRFilterDataRequest: getSPRFilterDataRequestAction,
    setPrevSPRFilterData: setPrevSPRFilterDataAction,
    receiveStudentsListAction,
    setFilters: setFiltersAction,
    setStudent: setStudentAction,
    setSelectedClassIds: setSelectedClassAction,
    setTagsData: setTagsDataAction,
  }
)

export default enhance(StudentProfileReportFilters)
