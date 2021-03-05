import React, { useEffect, useMemo, useRef } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty, pickBy } from 'lodash'
import qs from 'qs'

import { Row, Col } from 'antd'
import { EduButton } from '@edulastic/common'
import { IconFilter } from '@edulastic/icons'

import FilterTags from '../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../common/components/widgets/MultiSelectDropdown'
import SchoolAutoComplete from '../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../common/components/autocompletes/TeacherAutoComplete'
import {
  ReportFiltersContainer,
  ReportFiltersWrapper,
  FilterLabel,
} from '../../../../common/styled'

import {
  getFiltersSelector,
  setFiltersAction,
  getTagsDataSelector,
  setTagsDataAction,
} from '../filterDataDucks'
import { getUser } from '../../../../../src/selectors/user'

import { resetStudentFilters } from '../../../../common/util'
import { processSchoolYear } from '../../../multipleAssessmentReport/common/utils/transformers'

import staticDropDownData from '../static/staticDropDownData.json'

const EngagementReportFilters = ({
  loc,
  location,
  history,
  showApply,
  setShowApply,
  showFilter,
  toggleFilter,
  setFirstLoad,
  user,
  filters,
  setFilters,
  tagsData,
  setTagsData,
  onGoClick: _onGoClick,
}) => {
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
    const urlSubject =
      staticDropDownData.subjects.find((item) => item.key === search.subject) ||
      staticDropDownData.subjects[0]
    const urlGrade =
      staticDropDownData.grades.find((item) => item.key === search.grade) ||
      staticDropDownData.grades[0]

    const _filters = {
      reportId: search.reportId,
      termId: urlSchoolYear.key,
      schoolIds: search.schoolIds || '',
      teacherIds: search.teacherIds || '',
      grade: urlGrade.key,
      subject: urlSubject.key,
      assessmentTypes: search.assessmentTypes || '',
    }
    const assessmentTypesArr = (search.assessmentTypes || '').split(',')
    const _tagsData = {
      termId: urlSchoolYear,
      grade: urlGrade,
      subject: urlSubject,
      assessmentTypes: staticDropDownData.assessmentType.filter((a) =>
        assessmentTypesArr.includes(a.key)
      ),
    }
    setTagsData(_tagsData)
    setFilters(_filters)
    _onGoClick({ filters: { ..._filters } })
    setFirstLoad(false)
  }, [])

  const onGoClick = (_settings = {}) => {
    const settings = {
      filters: { ...filters },
      ..._settings,
    }
    setShowApply(false)
    _onGoClick(settings)
  }

  const updateFilterDropdownCB = (selected, keyName, multiple = false) => {
    console.log('\n\nthis', selected, keyName, multiple)
    // update tags data
    const _tagsData = { ...tagsData, [keyName]: selected }
    if (!multiple && (!selected.key || selected.key === 'All')) {
      delete _tagsData[keyName]
    }
    const _filters = { ...filters }
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    resetStudentFilters(_tagsData, _filters, keyName, _selected)
    setTagsData(_tagsData)
    // update filters
    _filters[keyName] = _selected
    history.push(`${location.pathname}?${qs.stringify(_filters)}`)
    setFilters(_filters)
    setShowApply(true)
  }

  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles tempDdFilters
    const _filters = { ...filters }
    resetStudentFilters(_tagsData, _filters, type, '')
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
    setTagsData(_tagsData)
    setShowApply(true)
    toggleFilter(null, true)
  }

  return (
    <>
      <FilterTags
        tagsData={tagsData}
        tagTypes={staticDropDownData.tagTypes}
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
        <ReportFiltersWrapper visible={showFilter}>
          <Row>
            <Col span={24} style={{ padding: '10px 5px 0 5px' }}>
              <Row type="flex" gutter={[5, 10]}>
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
                  <FilterLabel data-cy="classGrade">Class Grade</FilterLabel>
                  <ControlDropDown
                    prefix="Grade"
                    className="custom-1-scrollbar"
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
                  <MultiSelectDropdown
                    dataCy="testTypes"
                    label="Test Type"
                    el={assessmentTypesRef}
                    onChange={(e) => {
                      const selected = staticDropDownData.assessmentType.filter(
                        (a) => e.includes(a.key)
                      )
                      updateFilterDropdownCB(selected, 'assessmentTypes', true)
                    }}
                    value={
                      filters.assessmentTypes &&
                      filters.assessmentTypes !== 'All'
                        ? filters.assessmentTypes.split(',')
                        : []
                    }
                    options={staticDropDownData.assessmentType.filter(
                      (a) => a.key !== 'All'
                    )}
                  />
                </Col>
              </Row>
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
      tagsData: getTagsDataSelector(state),
    }),
    {
      setFilters: setFiltersAction,
      setTagsData: setTagsDataAction,
    }
  )
)

export default enhance(EngagementReportFilters)
