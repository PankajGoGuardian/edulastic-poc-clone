import React, { useEffect, useMemo, useCallback } from 'react'
import { connect } from 'react-redux'
import { get, find, isEmpty, pickBy } from 'lodash'
import qs from 'qs'

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
  getReportsPrevSPRFilterData,
  setPrevSPRFilterDataAction,
  getReportsSPRFilterLoadingState,
  setFiltersAction,
  getSPRFilterDataRequestAction,
  getReportsSPRFilterData,
  setSelectedClassAction,
  setStudentAction,
} from '../../filterDataDucks'
import { getTermOptions } from '../../utils/transformers'
import { getFullNameFromAsString } from '../../../../../../../common/utils/helpers'
import {
  StyledFilterWrapper,
  GoButtonWrapper,
  SearchField,
  ApplyFitlerLabel,
  FilterLabel,
} from '../../../../../common/styled'

import staticDropDownData from '../../../../singleAssessmentReport/common/static/staticDropDownData.json'
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

const StudentProfileReportsFilters = ({
  style,
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
  defaultTerm,
  history,
  reportId,
}) => {
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

  const profiles = get(SPRFilterData, 'data.result.bandInfo', [])
  const scales = get(SPRFilterData, 'data.result.scaleInfo', [])
  const standardProficiencyList = useMemo(
    () => scales.map((s) => ({ key: s._id, title: s.name })),
    [scales]
  )

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
    setFilters(_filters)
    // load page data
    _onGoClick({
      filters: pickBy(_filters, (f) => f !== 'All' && !isEmpty(f)),
      selectedStudent: _student,
    })
  }

  const onStudentSelect = (item) => {
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
      _onGoClick({
        filters,
        selectedStudent: item,
      })
    }
  }

  const resetSPRFilters = useCallback(
    (prevFilters, key, selected, multiple) => {
      const index = filtersDefaultValues.findIndex((s) => s.key === key)
      resetFilters(prevFilters, key, selected, multiple, filtersDefaultValues)
      if (
        prevFilters[key] !== (multiple ? selected : selected.key) &&
        (index !== -1 || ['grade', 'subject'].includes(key))
      ) {
        setStudent({ key: '', title: '' })
        setSelectedClassIds('')
      }
    }
  )

  const handleFilterChange = (field, value, multiple = false) => {
    const obj = { ...filters }
    resetSPRFilters(obj, field, value, multiple)
    obj[field] = multiple ? value : value.key
    setFilters(obj)
  }

  return (
    <StyledFilterWrapper style={style}>
      <GoButtonWrapper>
        <ApplyFitlerLabel>Filters</ApplyFitlerLabel>
      </GoButtonWrapper>
      <SearchField>
        <FilterLabel>School Year</FilterLabel>
        <ControlDropDown
          by={filters.termId}
          selectCB={(value) => handleFilterChange('termId', value)}
          data={termOptions}
          prefix="School Year"
          showPrefixOnSelected={false}
        />
      </SearchField>
      <SearchField>
        <CourseAutoComplete
          selectedCourseIds={
            filters.courseIds ? filters.courseIds.split(',') : []
          }
          selectCB={(value) =>
            handleFilterChange('courseIds', value.join(','), true)
          }
        />
      </SearchField>
      <SearchField>
        <FilterLabel>Grade</FilterLabel>
        <ControlDropDown
          by={filters.grade}
          selectCB={(value) => handleFilterChange('grade', value)}
          data={gradeOptions}
          prefix="Grade"
          showPrefixOnSelected={false}
        />
      </SearchField>
      <SearchField>
        <FilterLabel>Subject</FilterLabel>
        <ControlDropDown
          by={filters.subject}
          selectCB={(value) => handleFilterChange('subject', value)}
          data={subjectOptions}
          prefix="Subject"
          showPrefixOnSelected={false}
        />
      </SearchField>
      <SearchField>
        <ClassAutoComplete
          termId={filters.termId}
          selectedCourseIds={filters.courseIds}
          selectedGrade={filters.grade !== 'All' && filters.grade}
          selectedSubject={filters.subject !== 'All' && filters.subject}
          selectedClassIds={selectedClassIds ? selectedClassIds.split(',') : []}
          selectCB={(classIds) => setSelectedClassIds(classIds.join(','))}
        />
      </SearchField>
      <SearchField>
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
      </SearchField>
      {performanceBandRequired && (
        <SearchField>
          <FilterLabel>Performance Band</FilterLabel>
          <ControlDropDown
            by={filters.performanceBandProfileId}
            selectCB={(value) =>
              handleFilterChange('performanceBandProfileId', value)
            }
            data={profiles.map((p) => ({ key: p._id, title: p.name }))}
            prefix="Performance Band"
            showPrefixOnSelected={false}
          />
        </SearchField>
      )}
      {standardProficiencyRequired && (
        <SearchField>
          <FilterLabel>Standard Proficiency</FilterLabel>
          <ControlDropDown
            by={filters.standardsProficiencyProfileId}
            selectCB={(value) =>
              handleFilterChange('standardsProficiencyProfileId', value)
            }
            data={standardProficiencyList}
            prefix="Standard Proficiency"
            showPrefixOnSelected={false}
          />
        </SearchField>
      )}
    </StyledFilterWrapper>
  )
}

const enhance = connect(
  (state) => ({
    SPRFilterData: getReportsSPRFilterData(state),
    filters: getFiltersSelector(state),
    student: getStudentSelector(state),
    selectedClassIds: getSelectedClassSelector(state),
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
  }
)

export default enhance(StudentProfileReportsFilters)
