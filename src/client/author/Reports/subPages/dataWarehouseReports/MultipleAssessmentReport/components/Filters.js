import React, { useEffect, useMemo } from 'react'
import qs from 'qs'
import { get, pickBy, isEmpty, reject } from 'lodash'
import { Row, Col, Tabs, Tooltip } from 'antd'

import { EduIf, FieldLabel, notification } from '@edulastic/common'
import { IconFilter } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import {
  EMPTY_ARRAY,
  getDistrictTermIdsForDistrictGroup,
} from '@edulastic/constants/reportUtils/common'

import { withNamespaces } from 'react-i18next'
import {
  ReportFiltersContainer,
  StyledEduButton,
  ReportFiltersWrapper,
  StyledDropDownContainer,
  FilterLabel,
  SecondaryFilterRow,
  SubText,
  StyledTooltip,
} from '../../../../common/styled'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import FilterTags from '../../../../common/components/FilterTags'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import ClassAutoComplete from '../../../../common/components/autocompletes/ClassAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import TagFilter from '../../../../../src/components/common/TagFilter'
import SelectAssessmentsForMultiSchoolYear from '../../common/components/SelectAssessmentsForMultiSchoolYear'
import CourseAutoComplete from '../../../../common/components/autocompletes/CourseAutoComplete'
import GroupsAutoComplete from '../../../../common/components/autocompletes/GroupsAutoComplete'

import { resetStudentFilters as resetFilters } from '../../../../common/util'
import {
  getDistrictOptions,
  getTermOptions,
} from '../../../../../utils/reports'
import { staticDropDownData } from '../utils'

import { getArrayOfAllTestTypes } from '../../../../../../common/utils/testTypeUtils'
import { allFilterValue } from '../../../../common/constants'
import {
  EXTERNAL_SCORE_TYPES,
  getDemographicsFilterTagsData,
  getExternalScoreTypesListByTestTypes,
  getDefaultTestTypesForUser,
  getUrlTestTermIds,
  convertItemToArray,
  getIsMultiSchoolYearDataPresent,
  getUrlDistricts,
} from '../../common/utils'
import ExternalScoreTypeFilter from '../../common/components/ExternalScoreTypeFilter'
import { MandatorySymbol } from '../../common/components/styledComponents'

import { isPearOrEdulasticText } from '../../../../../../common/utils/helpers'

const DGA_DISABLE_FILTERS_MESSAGE =
  'Please select a single district to activate this filter'

const internalTestTypes = getArrayOfAllTestTypes()

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
  t,
}) => {
  const isDistrictGroupAdmin = userRole === roleuser.DISTRICT_GROUP_ADMIN
  const tagTypes = staticDropDownData.tagTypes
  const { terms = EMPTY_ARRAY, schools, districtGroup } = orgData
  const districtGroupDistricts = useMemo(
    () => getDistrictOptions(districtGroup?.districts),
    [districtGroup]
  )
  const schoolYears = useMemo(() => getTermOptions(terms), [terms])
  const institutionIds = useMemo(() => schools.map((s) => s._id), [schools])

  const {
    bandInfo = [],
    demographics = [],
    testTypes: availableAssessmentTypes = internalTestTypes,
    externalTests = [],
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
    const q = {
      districtGroupId: districtGroup?._id,
      externalTestTypesRequired: true,
      externalTestsRequired: true,
    }
    if (reportId) {
      Object.assign(q, { reportId })
      fetchFiltersDataRequest(q)
      setFilters({ ...filters, ...search })
    } else {
      if (firstLoad && isEmpty(search)) {
        q.firstLoad = true
      }
      if (userRole === roleuser.SCHOOL_ADMIN) {
        q.schoolIds = institutionIds.join(',')
      }
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
        const urlDistricts = getUrlDistricts(
          districtGroupDistricts,
          search.districtIds
        )
        const urlTestTermIds = getUrlTestTermIds(
          schoolYears,
          search.testTermIds
        )
        const urlPerformanceBand =
          performanceBandsList.find((item) => item.key === search.profileId) ||
          performanceBandsList[0]

        const testTypes = get(filtersData, 'data.result.testTypes')
        const defaultTestTypes = getDefaultTestTypesForUser(testTypes, userRole)

        const _filters = {
          // test filters
          testTermIds:
            urlTestTermIds.map((item) => item.key).join(',') ||
            urlSchoolYear.key,
          testSubjects: urlTestSubjects.map((item) => item.key).join(',') || '',
          testGrades: urlTestGrades.map((item) => item.key).join(',') || '',
          tagIds: search.tagIds || '',
          assessmentTypes: search.assessmentTypes || defaultTestTypes,
          testIds: search.testIds || '', // TODO: check if still required?
          testUniqIds: search.testUniqIds || '',
          // student set filters
          termId: urlSchoolYear.key,
          districtIds: search.districtIds || '',
          schoolIds: search.schoolIds || '',
          teacherIds: search.teacherIds || '',
          subjects: urlSubjects.map((item) => item.key).join(',') || '',
          grades: urlGrades.map((item) => item.key).join(',') || '',
          courseId: search.courseId || 'All',
          classIds: search.classIds || '',
          groupIds: search.groupIds || '',
          // performance filters
          profileId: urlPerformanceBand?.key || '',
          externalScoreType:
            search.externalScoreType || EXTERNAL_SCORE_TYPES.SCALED_SCORE,
          // demographic filters
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
          districtIds: urlDistricts,
          testSubjects: urlTestSubjects,
          testTermIds: urlTestTermIds.length ? urlTestTermIds : [urlSchoolYear],
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
          const districtIdsArr = _filters.districtIds.split(',')
          const updateTagsDataParams = {
            districtIds: reject(districtIdsArr, isEmpty),
          }
          if (!isDistrictGroupAdmin || districtIdsArr.length === 1) {
            const {
              termIds: termIdsArr,
              districtIds: filteredDistrictIdsArr,
            } = getDistrictTermIdsForDistrictGroup(orgData, {
              termId: _filters.termId,
              districtIds: districtIdsArr,
            })
            const termId = termIdsArr[0] || _filters.termId
            const districtId = filteredDistrictIdsArr[0]
            Object.assign(updateTagsDataParams, {
              schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
              courseId: reject([search.courseId], isEmpty),
              classIds: reject(_filters.classIds?.split(','), isEmpty),
              groupIds: reject(_filters.groupIds?.split(','), isEmpty),
              teacherIds: reject(_filters.teacherIds?.split(','), isEmpty),
              options: {
                termId,
                districtId,
                schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
              },
            })
          }
          if (!isDistrictGroupAdmin) {
            Object.assign(updateTagsDataParams, {
              tagIds: reject(_filters.tagIds?.split(','), isEmpty),
            })
          }
          fetchUpdateTagsData(updateTagsDataParams)
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
    if (!selected.length && keyName === 'testTermIds') {
      notification({
        type: 'warn',
        msg:
          'At least one school year is mandatory. Please select another school year to remove the current one.',
      })
      return
    }
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
    // When student termId is changed, add same termId for testTermIds
    if (keyName === 'termId') {
      _filters.testTermIds = _selected
      _filterTagsData.testTermIds = getUrlTestTermIds(schoolYears, _selected)
    }

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

  const testUniqIds = useMemo(() => convertItemToArray(filters.testUniqIds), [
    filters.testUniqIds,
  ])
  const isMultiSchoolYear = getIsMultiSchoolYearDataPresent(filters.testTermIds)

  // for districtGroupAdmin we need one district / term combination for autocompletes
  const [
    selectedDistrictTermId,
    selectedDistrictId,
    studentFiltersDisabled,
    studentFiltersDisabledMessage,
  ] = useMemo(() => {
    let termId = filters.termId
    let districtId
    const districtIdsArr = convertItemToArray(filters.districtIds)
    const filtersDisabled = isDistrictGroupAdmin && districtIdsArr.length !== 1
    if (isDistrictGroupAdmin) {
      const {
        termIds: termIdsArr,
        districtIds: filteredDistrictIdsArr,
      } = getDistrictTermIdsForDistrictGroup(orgData, {
        termId: filters.termId,
        districtIds: districtIdsArr,
      })
      termId = termIdsArr[0] || termId
      districtId = filteredDistrictIdsArr[0] || districtIdsArr[0]
    }
    const filtersDisabledMessage = filtersDisabled
      ? DGA_DISABLE_FILTERS_MESSAGE
      : ''
    return [termId, districtId, filtersDisabled, filtersDisabledMessage]
  }, [filters.termId, filters.districtIds, isDistrictGroupAdmin])

  const isApplyDisabledForSelectedTests =
    isMultiSchoolYear && !testUniqIds.length

  const applyButton = () => {
    const ApplyButton = ({ width = '25%' }) => (
      <StyledEduButton
        width={width}
        height="40px"
        style={{ maxWidth: '200px' }}
        key="applyButton"
        data-cy="applyFilter"
        data-testid="applyFilter"
        disabled={
          !showApply || loadingFiltersData || isApplyDisabledForSelectedTests
        }
        onClick={() => onGoClick()}
      >
        Apply
      </StyledEduButton>
    )
    if (isApplyDisabledForSelectedTests) {
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
                      <EduIf condition={isDistrictGroupAdmin}>
                        <Col span={6}>
                          <MultiSelectDropdown
                            dataCy="district"
                            label="District"
                            onChange={(e) => {
                              const selected = districtGroupDistricts?.filter(
                                (district) => e.includes(district.key)
                              )
                              updateFilterDropdownCB(
                                selected,
                                'districtIds',
                                true
                              )
                            }}
                            value={
                              filters.districtIds
                                ? filters.districtIds.split(',')
                                : []
                            }
                            options={districtGroupDistricts}
                          />
                        </Col>
                      </EduIf>
                      {roleuser.ADMINS_ROLE_ARRAY.includes(userRole) && (
                        <>
                          <Col span={6}>
                            <SchoolAutoComplete
                              dataCy="schools"
                              districtId={selectedDistrictId}
                              selectedSchoolIds={
                                filters.schoolIds
                                  ? filters.schoolIds.split(',')
                                  : []
                              }
                              selectCB={(e) =>
                                updateFilterDropdownCB(e, 'schoolIds', true)
                              }
                              disabled={studentFiltersDisabled}
                              disabledMessage={studentFiltersDisabledMessage}
                            />
                          </Col>
                          <Col span={6}>
                            <TeacherAutoComplete
                              dataCy="teachers"
                              districtId={selectedDistrictId}
                              termIds={selectedDistrictTermId}
                              school={filters.schoolIds}
                              selectedTeacherIds={
                                filters.teacherIds
                                  ? filters.teacherIds.split(',')
                                  : []
                              }
                              selectCB={(e) =>
                                updateFilterDropdownCB(e, 'teacherIds', true)
                              }
                              disabled={studentFiltersDisabled}
                              disabledMessage={studentFiltersDisabledMessage}
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
                        <Tooltip title={studentFiltersDisabledMessage}>
                          <FilterLabel data-cy="course">Course</FilterLabel>
                          <CourseAutoComplete
                            districtId={selectedDistrictId}
                            selectedCourseId={filters.courseId}
                            selectCB={(e) =>
                              updateFilterDropdownCB(e, 'courseId')
                            }
                            disabled={studentFiltersDisabled}
                            disabledMessage={studentFiltersDisabledMessage}
                          />
                        </Tooltip>
                      </Col>
                      <Col span={6}>
                        <ClassAutoComplete
                          dataCy="classes"
                          districtId={selectedDistrictId}
                          termIds={selectedDistrictTermId}
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
                          disabled={studentFiltersDisabled}
                          disabledMessage={studentFiltersDisabledMessage}
                        />
                      </Col>
                      <EduIf condition={!isDistrictGroupAdmin}>
                        <Col span={6}>
                          <GroupsAutoComplete
                            dataCy="groups"
                            districtId={selectedDistrictId}
                            termIds={selectedDistrictTermId}
                            schoolIds={filters.schoolIds}
                            teacherIds={filters.teacherIds}
                            grades={filters.grades}
                            subjects={filters.subjects}
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
                            disabled={studentFiltersDisabled}
                            disabledMessage={studentFiltersDisabledMessage}
                          />
                        </Col>
                      </EduIf>
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
                            const selected = schoolYears?.filter((schoolYear) =>
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
                          options={schoolYears}
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
                          placeholder="All Test Subject"
                          dataCy="testSubject"
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
                      <EduIf condition={!isDistrictGroupAdmin}>
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
                      </EduIf>
                      <Col span={18}>
                        <SelectAssessmentsForMultiSchoolYear
                          dataCy="multiSchoolYearTests"
                          termId={filters.termId}
                          grades={filters.testGrades}
                          subjects={filters.testSubjects}
                          testTypes={filters.assessmentTypes}
                          testTermIds={filters.testTermIds}
                          tagIds={filters.tagIds}
                          schoolYears={schoolYears}
                          externalTests={externalTests}
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

                  {!isDistrictGroupAdmin && (
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
                            data={performanceBandsList}
                            prefix="Performance Band"
                            showPrefixOnSelected={false}
                          />
                        </Col>
                      </Row>
                    </Tabs.TabPane>
                  )}

                  {!isDistrictGroupAdmin && (
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
                  data-testid="cancelFilter"
                  onClick={(e) => toggleFilter(e, false)}
                >
                  Cancel
                </StyledEduButton>
                {/* Apply button */}
                {applyButton()}
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
          <EduIf condition={!isDistrictGroupAdmin}>
            <StyledDropDownContainer
              flex="0 0 300px"
              xs={24}
              sm={12}
              lg={6}
              data-cy="performanceBand"
              data-testid="performanceBand"
            >
              <FieldLabel fs=".7rem">
                PERFORMANCE BAND ({isPearOrEdulasticText})
              </FieldLabel>
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
          </EduIf>
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

export default withNamespaces('reports')(MultipleAssessmentReportFilters)
