import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { get, pickBy, isEmpty, reject, mapValues } from 'lodash'
import { Row, Col, Tabs, Tooltip } from 'antd'

import { IconFilter } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { FieldLabel } from '@edulastic/common'
import { withNamespaces } from 'react-i18next'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reportNavType } from '@edulastic/constants/const/report'

import {
  ReportFiltersContainer,
  StyledEduButton,
  ReportFiltersWrapper,
  StyledDropDownContainer,
  FilterLabel,
  SecondaryFilterRow,
  SubText,
  StyledTooltip,
} from '../../../../../common/styled'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import FilterTags from '../../../../../common/components/FilterTags'
import SchoolAutoComplete from '../../../../../common/components/autocompletes/SchoolAutoComplete'
import CoursesAutoComplete from '../../../../../common/components/autocompletes/CoursesAutoComplete'
import ClassAutoComplete from '../ClassAutoComplete'
import StudentAutoComplete from '../../../../../common/components/autocompletes/StudentAutoComplete'

import { resetStudentFilters as resetFilters } from '../../../../../common/util'

import { actions, selectors } from '../../ducks'
import useFiltersFromUrl from './hooks/useFiltersFromUrl'
import {
  getCurrentTerm,
  getOrgDataSelector,
  getUserRole,
} from '../../../../../../src/selectors/user'
import { fetchUpdateTagsDataAction } from '../../../../../ducks'

import { getTermOptions } from '../../../../../../utils/reports'
import {
  getStudentName,
  getTestTypesFromUrl,
  staticDropDownData,
} from '../../utils'
import { getArrayOfAllTestTypes } from '../../../../../../../common/utils/testTypeUtils'
import {
  EXTERNAL_SCORE_TYPES,
  convertItemToArray,
  getDefaultTestTypesForUser,
  getIsMultiSchoolYearDataPresent,
} from '../../../common/utils'
import SelectAssessmentsForMultiSchoolYear from '../../../common/components/SelectAssessmentsForMultiSchoolYear'
import TagFilter from '../../../../../../src/components/common/TagFilter'
import { MandatorySymbol } from '../../../common/components/styledComponents'

import { isPearOrEdulasticText } from '../../../../../../../common/utils/helpers'

const filtersDefaultValues = [
  {
    key: 'termId',
    value: '',
  },
  {
    key: 'schoolIds',
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
      {
        key: 'classIds',
        value: '',
      },
    ],
  },
]

const WholeLearnerReportFilters = ({
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
  filtersTabKey,
  filters = staticDropDownData.initialFilters,
  filterTagsData,
  selectedFilterTagsData = {},
  // action props
  toggleFilter,
  setShowApply,
  setFirstLoad,
  fetchFiltersDataRequest,
  setStudent,
  setFiltersTabKey,
  setFilters,
  setFilterTagsData,
  setPrevFiltersData,
  onGoClick: _onGoClick,
  fetchUpdateTagsData,
  history,
  studentsList,
  studentsListQuery,
  loadingStudentsData,
  fetchStudentsDataRequest,
  t,
}) => {
  const tagTypes = staticDropDownData.tagTypes
  const splittedPath = location.pathname.split('/')
  const urlStudentId = splittedPath[splittedPath.length - 1]
  const { terms = [], districtGroup } = orgData
  const termOptions = useMemo(() => getTermOptions(terms), [terms])

  const {
    studentClassData = [],
    bandInfo = [],
    testTypes: availableTestTypes = getArrayOfAllTestTypes(),
    externalTests = [],
  } = get(filtersData, 'data.result', {})

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

  const testUniqIds = useMemo(() => convertItemToArray(filters.testUniqIds), [
    filters.testUniqIds,
  ])

  const isMultiSchoolYear = getIsMultiSchoolYearDataPresent(filters.testTermIds)
  const isDisable = useMemo(() => {
    if (isMultiSchoolYear) {
      return !testUniqIds.length
    }
  }, [isMultiSchoolYear, testUniqIds])

  useEffect(() => {
    const q = {
      districtGroupId: districtGroup?._id,
      externalTestTypesRequired: true,
      externalTestsRequired: true,
    }
    if (reportId) {
      Object.assign(q, { reportId })
    } else if (urlStudentId && (search.termId || search.subActiveKey)) {
      Object.assign(q, {
        termId: search.termId || defaultTermId,
        studentId: urlStudentId,
      })
    }
    fetchFiltersDataRequest(q)
  }, [])

  useFiltersFromUrl({
    location,
    termOptions,
    search,
    staticDropDownData,
    defaultTermId,
    reportId,
    userRole,
    setFilters,
    filterTagsData,
    setFilterTagsData,
    setShowApply,
    toggleFilter,
    setFirstLoad,
    setStudent,
    urlStudentId,
  })

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
        selectedFilterTagsData: { ...filterTagsData },
      })
      setShowApply(false)
      setFirstLoad(false)
    } else if (firstLoad && !reportId && filters.termId && urlStudentId) {
      const defaultTestTypes = getDefaultTestTypesForUser(
        availableTestTypes,
        userRole
      )
      const selectedTestTypes = search.testTypes || defaultTestTypes
      const _filters = {
        ...filters,
        testTypes: selectedTestTypes,
        performanceBandProfileId: selectedPerformanceBand?.key || '',
      }
      const testTypes = getTestTypesFromUrl(
        selectedTestTypes,
        availableTestTypes
      )
      const _filterTagsData = {
        ...filterTagsData,
        performanceBandProfileId: selectedPerformanceBand,
        student: _student,
        testTypes,
      }
      setFilters({ ..._filters })
      setFilterTagsData({ ..._filterTagsData })

      _onGoClick({
        filters: { ..._filters },
        selectedStudent: _student,
        selectedFilterTagsData: { ..._filterTagsData },
      })
      // TODO: add mapping and support to enable this feature
      fetchUpdateTagsData({
        schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
        courseIds: reject(_filters.courseIds?.split(','), isEmpty),
        classIds: reject(_filters.classIds?.split(','), isEmpty),
        options: {
          termId: _filters.termId,
        },
      })

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
      setFilters({ ...filters, showApply: true })

      // BUG updates the student details(student-profile) even before `Apply` is clicked.
      fetchFiltersDataRequest({
        districtGroupId: districtGroup?._id,
        termId: filters.termId,
        studentId: selected.key,
        externalTestTypesRequired: true,
        externalTestsRequired: true,
      })
    } else {
      delete _filterTagsData.student
    }
    setFilterTagsData(_filterTagsData)
  }

  const resetReportFilters = (nextTagsData, prevFilters, key, selected) => {
    let newFiltersDefaultValues = filtersDefaultValues
    if (key === 'schoolIds') {
      newFiltersDefaultValues = filtersDefaultValues.filter(
        (e) => e.key !== 'courseIds'
      )
    }
    const index = newFiltersDefaultValues.findIndex((s) => s.key === key)
    if (!['grades', 'subjects'].includes(key)) {
      resetFilters(
        nextTagsData,
        prevFilters,
        key,
        selected,
        newFiltersDefaultValues
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

  const getNewPathname = () => {
    const splitted = location.pathname.split('/')
    splitted.splice(splitted.length - 1)
    return `${splitted.join('/')}/`
  }

  const updateFilterDropdownCB = (
    selected,
    keyName,
    multiple = false,
    isPageLevelFilter = false
  ) => {
    if (!selected.length && keyName === 'testTermIds') {
      return
    }
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    const _filterTagsData = { ...filterTagsData, [keyName]: selected }
    if (!multiple && (!selected.key || selected.key === 'All')) {
      delete _filterTagsData[keyName]
    }
    const _filters = { ...filters }
    // reset filters and update tags data
    resetReportFilters(_filterTagsData, _filters, keyName, _selected)
    setFilterTagsData(_filterTagsData)
    // update filters
    _filters[keyName] = _selected
    // reset externalScoreType when assessmentTypes are updated
    if (keyName === 'assessmentTypes') {
      _filters.externalScoreType = EXTERNAL_SCORE_TYPES.SCALED_SCORE
    }
    history.push(`${getNewPathname()}?${qs.stringify(_filters)}`)
    // TODO combine setFilterTagsData and setFilters action into one
    if (isPageLevelFilter) {
      setFilters({ ..._filters, showApply: true })
    } else {
      setFilters(_filters)
      setShowApply(true)
    }
  }

  const getLabel = (text, isRequired) => {
    return isRequired ? (
      <>
        {text}
        <MandatorySymbol>*</MandatorySymbol>
      </>
    ) : (
      text
    )
  }

  const applyButton = () => {
    const ApplyButton = ({ width = '25%' }) => (
      <StyledEduButton
        width={width}
        height="40px"
        style={{ maxWidth: '200px' }}
        key="applyButton"
        data-cy="applyFilter"
        data-testid="applyFilter"
        disabled={!showApply || loadingFiltersData || isDisable}
        onClick={() => onGoClick()}
      >
        Apply
      </StyledEduButton>
    )
    if (isDisable) {
      return (
        <StyledTooltip
          placement="topRight"
          title="Please select a test to activate 'Apply' filter."
        >
          <span style={{ width: '25%', height: '40px', maxWidth: '200px' }}>
            <ApplyButton width="100%" />
          </span>
        </StyledTooltip>
      )
    }
    return <ApplyButton />
  }
  const testTermIds = convertItemToArray(filters.testTermIds)
  const testsNotSelectedForMultiTestTerms =
    testTermIds.length > 1 && !testUniqIds.length

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
          <ReportFiltersWrapper visible={showFilter}>
            <Row>
              <Col span={24} style={{ padding: '0 5px' }}>
                <Tabs
                  animated={false}
                  activeKey={filtersTabKey}
                  onChange={setFiltersTabKey}
                >
                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.STUDENT_FILTERS.key}
                    tab={
                      staticDropDownData.filterSections.STUDENT_FILTERS.title
                    }
                    forceRender
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      <Col span={24}>
                        <SubText>{t('common.studentFilterSubText')}</SubText>
                      </Col>
                      <Col span={8}>
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
                      {roleuser.DA_SA_ROLE_ARRAY.includes(userRole) ? (
                        <Col span={8}>
                          <SchoolAutoComplete
                            dataCy="schools"
                            selectedSchoolIds={
                              filters.schoolIds
                                ? filters.schoolIds.split(',')
                                : search.schoolIds
                                ? search.schoolIds.split(',')
                                : []
                            }
                            selectCB={(e) =>
                              updateFilterDropdownCB(e, 'schoolIds', true)
                            }
                          />
                        </Col>
                      ) : null}
                      <Col span={8}>
                        <CoursesAutoComplete
                          data-cy="courses"
                          selectedCourseIds={
                            filters.courseIds
                              ? filters.courseIds.split(',')
                              : []
                          }
                          selectCB={(e) =>
                            updateFilterDropdownCB(e, 'courseIds', true)
                          }
                        />
                      </Col>
                      <Col span={8}>
                        <MultiSelectDropdown
                          dataCy="classGrade"
                          data-testid="classGrade"
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
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.TEST_FILTERS.key}
                    tab={staticDropDownData.filterSections.TEST_FILTERS.title}
                  >
                    <Row type="flex" gutter={[5, 10]}>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="schoolYear"
                          label="School Year"
                          onChange={(e) => {
                            const selected = termOptions?.filter((schoolYear) =>
                              e.includes(schoolYear.key)
                            )
                            updateFilterDropdownCB(
                              selected,
                              'testTermIds',
                              true
                            )
                          }}
                          value={
                            (filters.testTermIds &&
                              filters.testTermIds.split(',')) ||
                            filters?.termId
                          }
                          options={termOptions}
                        />
                      </Col>

                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testGrade"
                          placeholder="All Test Grade"
                          label={getLabel('Test Grade', isMultiSchoolYear)}
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
                          placeholder="All Test Subject"
                          label={getLabel('Test Subject', isMultiSchoolYear)}
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
                              : (filters.subjects &&
                                  filters.subjects.split(',')) ||
                                []
                          }
                          options={staticDropDownData.subjects}
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testTypes"
                          label="Test Type"
                          onChange={(e) => {
                            const selected = availableTestTypes.filter((a) =>
                              e.includes(a.key)
                            )
                            updateFilterDropdownCB(selected, 'testTypes', true)
                          }}
                          value={
                            filters.testTypes
                              ? filters.testTypes.split(',')
                              : []
                          }
                          options={availableTestTypes}
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
                      <Col span={18}>
                        <SelectAssessmentsForMultiSchoolYear
                          dataCy="multiSchoolYearTests"
                          termId={filters.termId}
                          grades={filters.testGrades}
                          subjects={filters.testSubjects}
                          testTypes={filters.testTypes}
                          externalTests={externalTests}
                          testTermIds={filters.testTermIds}
                          tagIds={filters.tagIds}
                          schoolYears={termOptions}
                          selectedTestIds={
                            filters.testUniqIds
                              ? filters.testUniqIds.split(',')
                              : []
                          }
                          selectCB={(e) => {
                            updateFilterDropdownCB(e, 'testUniqIds', true)
                          }}
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
                  data-testid="cancelFilter"
                  onClick={(e) => toggleFilter(e, false)}
                >
                  Cancel
                </StyledEduButton>
                {applyButton()}
              </Col>
            </Row>
          </ReportFiltersWrapper>
        </ReportFiltersContainer>
      </Col>
      <Col span={24}>
        <SecondaryFilterRow width="100%" hidden={!!reportId}>
          <StyledDropDownContainer
            flex="0 0 300px"
            xs={24}
            sm={8}
            lg={4}
            data-cy="student"
          >
            <FieldLabel fs=".7rem" data-cy="schoolYear">
              SEARCH STUDENT
            </FieldLabel>
            <StudentAutoComplete
              height="40px"
              filters={filters}
              selectedStudent={student}
              selectCB={onStudentSelect}
              studentList={studentsList}
              activeQuery={studentsListQuery}
              loading={loadingStudentsData}
              loadStudentList={fetchStudentsDataRequest}
            />
          </StyledDropDownContainer>
          <StyledDropDownContainer
            flex="0 0 300px"
            xs={24}
            sm={8}
            lg={4}
            data-cy="performanceBand"
            data-testid="performanceBand"
          >
            <FieldLabel fs=".7rem" data-cy="schoolYear">
              PERFORMANCE BAND ({isPearOrEdulasticText})
            </FieldLabel>
            <ControlDropDown
              height="40px"
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
            <Tooltip
              placement="bottomRight"
              title={
                testsNotSelectedForMultiTestTerms
                  ? `Please select a test to activate 'Apply' filter.`
                  : ''
              }
            >
              <StyledEduButton
                btnType="primary"
                data-testid="applyRowFilter"
                data-cy="applyRowFilter"
                disabled={
                  loadingFiltersData || testsNotSelectedForMultiTestTerms
                }
                onClick={() => onGoClick()}
              >
                APPLY
              </StyledEduButton>
            </Tooltip>
          )}
        </SecondaryFilterRow>
      </Col>
    </Row>
  )
}

const enhance = compose(
  withNamespaces('reports'),
  connect(
    (state) => ({
      ...mapValues(selectors, (selector) => selector(state)),
      defaultTermId: getCurrentTerm(state),
      orgData: getOrgDataSelector(state),
      userRole: getUserRole(state),
    }),
    {
      ...actions,
      fetchUpdateTagsData: (opts) =>
        fetchUpdateTagsDataAction({
          type: reportNavType.WHOLE_LEARNER_REPORT,
          ...opts,
        }),
    }
  )
)

export default enhance(WholeLearnerReportFilters)
