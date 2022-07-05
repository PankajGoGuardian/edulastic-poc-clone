import React, { useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy, reject } from 'lodash'
import qs from 'qs'

import { Row, Col } from 'antd'
import { IconFilter } from '@edulastic/icons'

import { reportGroupType } from '@edulastic/constants/const/report'
import FilterTags from '../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
  StyledEduButton,
} from '../../../../common/styled'

import {
  getFiltersSelector,
  setFiltersAction,
  getTempTagsDataSelector,
  setTempTagsDataAction,
} from '../filterDataDucks'
import { getUser } from '../../../../../src/selectors/user'

import { resetStudentFilters } from '../../../../common/util'
import { processSchoolYear } from '../../../multipleAssessmentReport/common/utils/transformers'

import staticDropDownData from '../static/staticDropDownData.json'
import { fetchUpdateTagsDataAction } from '../../../../ducks'
import { getArrayOfAllTestTypes } from '../../../../../../common/utils/testTypeUtils'

const EngagementReportFilters = ({
  isPrinting,
  reportId,
  loc,
  location,
  history,
  showApply,
  setShowApply,
  showFilter,
  toggleFilter,
  setFirstLoad,
  tagsData,
  user,
  filters,
  setFilters,
  tempTagsData,
  setTempTagsData,
  onGoClick: _onGoClick,
  fetchUpdateTagsData,
}) => {
  const availableAssessmentType = getArrayOfAllTestTypes()
  const assessmentTypesRef = useRef()
  const schoolYears = useMemo(() => processSchoolYear(user), [user])
  const defaultTermId = get(user, 'orgData.defaultTermId', '') || schoolYears[0]

  useEffect(() => {
    const search = pickBy(
      qs.parse(location.search, { ignoreQueryPrefix: true, indices: true }),
      (f) => f !== 'All' && !isEmpty(f)
    )
    const urlSchoolYear =
      schoolYears.find((item) => item.key === search.termId) ||
      schoolYears.find((item) => item.key === defaultTermId) ||
      (schoolYears[0] ? schoolYears[0] : { key: '', title: '' })
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
      reportId: search.reportId,
      termId: urlSchoolYear.key,
      schoolIds: search.schoolIds || '',
      teacherIds: search.teacherIds || '',
      grades: urlGrades.map((item) => item.key).join(',') || '',
      subjects: urlSubjects.map((item) => item.key).join(',') || '',
      assessmentTypes: search.assessmentTypes || '',
      assignedBy: urlAssignedBy.key,
    }
    const assessmentTypesArr = (search.assessmentTypes || '').split(',')
    const _tempTagsData = {
      termId: urlSchoolYear,
      grades: urlGrades,
      subjects: urlSubjects,
      assessmentTypes: availableAssessmentType.filter((a) =>
        assessmentTypesArr.includes(a.key)
      ),
      assignedBy: urlAssignedBy,
    }
    setTempTagsData(_tempTagsData)
    setFilters(_filters)
    if (location.state?.source === 'standard-reports') {
      setShowApply(true)
      toggleFilter(null, true)
    } else {
      _onGoClick({ filters: { ..._filters }, tagsData: { ..._tempTagsData } })
      fetchUpdateTagsData({
        schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
        teacherIds: reject(_filters.teacherIds?.split(','), isEmpty),
        options: {
          termId: _filters.termId,
          schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
        },
      })
    }
    setFirstLoad(false)
  }, [])

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      tagsData: { ...tempTagsData },
      ..._settings,
    }
    setShowApply(false)
    _onGoClick(settings)
    toggleFilter(null, false)
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
    resetStudentFilters(_tempTagsData, _filters, keyName, _selected)
    setTempTagsData(_tempTagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    setFilters(_filters)
    setShowApply(true)
  }

  const handleCloseTag = (type, { key }) => {
    const _tempTagsData = { ...tempTagsData }
    const _filters = { ...filters }
    resetStudentFilters(_tempTagsData, _filters, type, '')
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
    setShowApply(true)
    toggleFilter(null, true)
  }

  const handleTagClick = (filterKey) => {
    const tabKey =
      staticDropDownData.tagTypes.find((filter) => filter.key === filterKey)
        ?.tabKey || -1
    if (tabKey !== -1) {
      toggleFilter(null, true)
    }
  }

  return (
    <>
      <FilterTags
        isPrinting={isPrinting}
        visible={!reportId}
        tagsData={tagsData}
        tagTypes={staticDropDownData.tagTypes}
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
            <Col span={24} style={{ padding: '10px 5px 0 5px' }}>
              <Row type="flex" gutter={[5, 10]}>
                <Col span={6}>
                  <FilterLabel data-cy="assignedBy">Assigned By</FilterLabel>
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
                  <FilterLabel data-cy="schoolYear">School Year</FilterLabel>
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
                  <SchoolAutoComplete
                    dataCy="school"
                    selectedSchoolIds={
                      filters.schoolIds ? filters.schoolIds.split(',') : []
                    }
                    selectCB={(e) =>
                      updateFilterDropdownCB(e, 'schoolIds', true)
                    }
                  />
                </Col>
                {loc === 'activity-by-teacher' && (
                  <Col span={6}>
                    <TeacherAutoComplete
                      dataCy="teacher"
                      termId={filters.termId}
                      school={filters.schoolIds}
                      selectedTeacherIds={
                        filters.teacherIds ? filters.teacherIds.split(',') : []
                      }
                      selectCB={(e) =>
                        updateFilterDropdownCB(e, 'teacherIds', true)
                      }
                    />
                  </Col>
                )}
                <Col span={6}>
                  <MultiSelectDropdown
                    dataCy="classGrade"
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
                <Col span={6}>
                  <MultiSelectDropdown
                    dataCy="classSubject"
                    label="Class Subject"
                    onChange={(e) => {
                      const selected = staticDropDownData.subjects.filter((a) =>
                        e.includes(a.key)
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
                  <MultiSelectDropdown
                    dataCy="testTypes"
                    label="Test Type"
                    el={assessmentTypesRef}
                    onChange={(e) => {
                      const selected = availableAssessmentType.filter((a) =>
                        e.includes(a.key)
                      )
                      updateFilterDropdownCB(selected, 'assessmentTypes', true)
                    }}
                    value={
                      filters.assessmentTypes &&
                      filters.assessmentTypes !== 'All'
                        ? filters.assessmentTypes.split(',')
                        : []
                    }
                    options={availableAssessmentType}
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
        </ReportFiltersWrapper>
      </ReportFiltersContainer>
    </>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      user: getUser(state),
      filters: getFiltersSelector(state),
      tempTagsData: getTempTagsDataSelector(state),
    }),
    {
      setFilters: setFiltersAction,
      setTempTagsData: setTempTagsDataAction,
      fetchUpdateTagsData: (opts) =>
        fetchUpdateTagsDataAction({
          type: reportGroupType.ENGAGEMENT_REPORT,
          ...opts,
        }),
    }
  )
)

export default enhance(EngagementReportFilters)
