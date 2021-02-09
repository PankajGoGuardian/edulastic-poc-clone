import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { get, groupBy, capitalize } from 'lodash'
import { Row, Col } from 'antd'

import {
  StyledDropDownContainer,
  StyledFilterWrapper,
} from '../../../../common/styled'
import FilterTags from '../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { MultipleSelect } from '../../../../common/components/widgets/MultipleSelect'
import { resetStudentFilters, toggleItem } from '../../../../common/util'

import { getInterestedCurriculumsSelector } from '../../../../../src/selectors/user'
import {
  getFiltersSelector,
  setFiltersAction,
  getTestIdSelector,
  setTestIdAction,
  getTempDdFilterSelector,
  setTempDdFilterAction,
  getTagsDataSelector,
  setTagsDataAction,
  getReportsStandardsFilters,
  getReportsStandardsFiltersLoader,
} from '../filterDataDucks'
import { getReportsStandardsPerformanceSummary } from '../../standardsPerformance/ducks'
import { getReportsStandardsGradebook } from '../../standardsGradebook/ducks'
import { getReportsStandardsProgress } from '../../standardsProgress/ducks'

import staticDropDownData from '../static/json/staticDropDownData.json'

const ddFilterTypes = Object.keys(staticDropDownData.initialDdFilters)

const StandardsMasteryRowFilters = ({
  pageTitle,
  showFilter,
  setShowFilter,
  setShowApply,
  demographicsRequired,
  loading,
  standardsFilters,
  filters,
  setFilters,
  testIds,
  setTestIds,
  tempDdFilter,
  setTempDdFilter,
  tagsData,
  setTagsData,
  interestedCurriculums,
  standardsPerformanceSummary,
  standardsGradebook,
  standardsProgress,
}) => {
  const tagTypes = staticDropDownData.tagTypes.filter(
    (t) => demographicsRequired || !ddFilterTypes.includes(t.key)
  )

  // memoize curriculumsList for interested curriculums
  const curriculumsList = useMemo(() => {
    let _curriculums = []
    if (interestedCurriculums.length) {
      _curriculums = interestedCurriculums.map((item) => ({
        key: `${item._id}`,
        title: item.name,
      }))
    }
    return _curriculums
  }, [interestedCurriculums])

  // memoize standardProficiencyList for standards filters data
  const scaleInfo = get(standardsFilters, 'data.result.scaleInfo', [])
  const standardProficiencyList = useMemo(
    () =>
      scaleInfo.map((s) => ({ key: s._id, title: s.name, default: s.default })),
    [scaleInfo]
  )
  const defaultStandardProficiency =
    standardProficiencyList.find((s) => s.default) || standardProficiencyList[0]

  // curate domainsData from page data
  const skillInfoOptions = {
    'Standards Performance Summary': standardsPerformanceSummary,
    'Standards Gradebook': standardsGradebook,
    'Standards Progress': standardsProgress,
  }
  const skillInfo = get(
    skillInfoOptions[pageTitle],
    'data.result.skillInfo',
    []
  )
    .filter((o) => `${o.curriculumId}` === `${filters.curriculumId}`)
    .filter((o) =>
      filters.standardGrade && filters.standardGrade !== 'All'
        ? o.grades.includes(filters.standardGrade)
        : true
    )

  const domainGroup = groupBy(skillInfo, (o) => `${o.domainId}`)
  const allDomainIds = Object.keys(domainGroup).sort((a, b) =>
    a.localeCompare(b)
  )
  const domainsList = allDomainIds.map((domainId) => ({
    key: `${domainId}`,
    title: domainGroup[domainId][0].domain,
  }))
  const selectedDomains = (domainsList || []).filter((o) =>
    filters.domainIds?.includes(o.key)
  )
  const standardsList = skillInfo
    .filter((o) =>
      selectedDomains.length
        ? filters.domainIds.includes(`${o.domainId}`)
        : true
    )
    .sort((a, b) => a.domainId - b.domainId || a.standardId - b.standardId)
    .map((o) => ({
      key: `${o.standardId}`,
      title: o.standard,
    }))

  const standardIdFromPageData = useMemo(
    () => get(standardsProgress, 'data.result.standardId'),
    [standardsProgress]
  )

  useEffect(() => {
    if (standardIdFromPageData) {
      const standardFromPageData = standardsList.find(
        (o) => o.key === standardIdFromPageData
      )
      setFilters({
        ...filters,
        standardId: standardIdFromPageData,
      })
      setTagsData({
        ...tagsData,
        standardId: standardFromPageData,
      })
    }
  }, [standardIdFromPageData])

  // update handlers
  const updateFilterDropdownCB = (selected, keyName) => {
    // update tags data
    const _tagsData = { ...tagsData, [keyName]: selected }
    if (!selected.key || selected.key === 'All') {
      delete _tagsData[keyName]
    }
    setTagsData(_tagsData)
    // update filters
    const _filters = { ...filters, [keyName]: selected.key }
    setFilters(_filters)
    setShowApply(true)
  }
  const onSelectDomain = (domain) => {
    const _domainIds = toggleItem(filters.domainIds, domain.key).filter((o) =>
      allDomainIds.includes(o)
    )
    const domainTagsData = domainsList.filter((d) => _domainIds.includes(d.key))
    setTagsData({ ...tagsData, domainIds: domainTagsData })
    setFilters({ ...filters, domainIds: _domainIds })
    setShowApply(true)
  }
  const onChangeDomains = (domains) => {
    if (!domains?.length) {
      setTagsData({ ...tagsData, domainIds: [] })
      setFilters({ ...filters, domainIds: [] })
      setShowApply(true)
    }
  }

  const handleCloseTag = (type, { key }) => {
    const _tagsData = { ...tagsData }
    // handles testIds
    if (type === 'testIds') {
      if (testIds.includes(key)) {
        const _testIds = testIds.filter((d) => d !== key)
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
        setTestIds(_testIds)
      }
    }
    // handles tempDdFilters
    else if (ddFilterTypes.includes(type)) {
      const _tempDdFilter = { ...tempDdFilter }
      if (tempDdFilter[type] === key) {
        _tempDdFilter[type] = staticDropDownData.initialDdFilters[type]
        delete _tagsData[type]
      }
      setTempDdFilter(_tempDdFilter)
    } else {
      const _filters = { ...filters }
      const filterKey = ['grade', 'subject'].includes(type)
        ? `student${capitalize(type)}`
        : type
      resetStudentFilters(_tagsData, _filters, filterKey, '')
      // handles single selection filters
      if (filters[type] === key) {
        _filters[type] = staticDropDownData.initialFilters[type]
        delete _tagsData[type]
      }
      // handles multiple selection filters
      else if (filters[type].includes(key)) {
        _filters[type] = Array.isArray(filters[type])
          ? filters[type].filter((f) => f !== key)
          : filters[type]
              .split(',')
              .filter((d) => d !== key)
              .join(',')
        _tagsData[type] = tagsData[type].filter((d) => d.key !== key)
      }
      setFilters(_filters)
    }
    setTagsData(_tagsData)
    setShowApply(true)
    setShowFilter(true)
  }

  const filterColSpan = pageTitle === 'Standards Progress' ? 4 : 6

  const standardProficiencyFilter = (
    <StyledDropDownContainer
      xs={24}
      sm={12}
      md={12}
      lg={filterColSpan}
      xl={filterColSpan}
    >
      <ControlDropDown
        by={filters.profileId || defaultStandardProficiency?.key || ''}
        selectCB={(e, selected) =>
          updateFilterDropdownCB(selected, 'profileId')
        }
        data={standardProficiencyList}
        prefix="Standard Proficiency"
        showPrefixOnSelected={false}
      />
    </StyledDropDownContainer>
  )

  return (
    <>
      <FilterTags
        tagsData={tagsData}
        tagTypes={tagTypes}
        handleCloseTag={handleCloseTag}
      />
      <StyledFilterWrapper
        style={{ display: !showFilter || loading ? 'none' : 'flex' }}
        isRowFilter
      >
        <Col span={24}>
          <Row type="flex" justify="end">
            <StyledDropDownContainer
              xs={24}
              sm={12}
              md={12}
              lg={filterColSpan}
              xl={filterColSpan}
            >
              <ControlDropDown
                by={filters.curriculumId}
                selectCB={(e) => updateFilterDropdownCB(e, 'curriculumId')}
                data={curriculumsList}
                prefix="Standard Set"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer
              xs={24}
              sm={12}
              md={12}
              lg={filterColSpan}
              xl={filterColSpan}
            >
              <ControlDropDown
                by={filters.standardGrade}
                selectCB={(e) => updateFilterDropdownCB(e, 'standardGrade')}
                data={staticDropDownData.allGrades}
                prefix="Standard Grade"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
            {pageTitle !== 'Standards Progress' && standardProficiencyFilter}
            <StyledDropDownContainer
              xs={24}
              sm={12}
              md={12}
              lg={filterColSpan}
              xl={filterColSpan}
            >
              <MultipleSelect
                containerClassName="standards-mastery-report-domain-autocomplete"
                data={domainsList || []}
                valueToDisplay={
                  selectedDomains.length > 1
                    ? { key: '', title: 'Multiple Domains' }
                    : selectedDomains
                }
                by={selectedDomains}
                prefix="Domains"
                onSelect={onSelectDomain}
                onChange={onChangeDomains}
                placeholder="All Domains"
                style={{ width: '100%', height: 'auto' }}
              />
            </StyledDropDownContainer>
            {pageTitle === 'Standards Progress' && (
              <StyledDropDownContainer
                xs={24}
                sm={12}
                md={12}
                lg={filterColSpan}
                xl={filterColSpan}
              >
                <ControlDropDown
                  by={filters.standardId || standardsList[0]}
                  selectCB={(e) => updateFilterDropdownCB(e, 'standardId')}
                  data={standardsList}
                  prefix="Standard"
                  showPrefixOnSelected={false}
                />
              </StyledDropDownContainer>
            )}
            {pageTitle === 'Standards Progress' && standardProficiencyFilter}
          </Row>
        </Col>
      </StyledFilterWrapper>
    </>
  )
}

export default connect(
  (state) => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    loading: getReportsStandardsFiltersLoader(state),
    standardsFilters: getReportsStandardsFilters(state),
    filters: getFiltersSelector(state),
    testIds: getTestIdSelector(state),
    tempDdFilter: getTempDdFilterSelector(state),
    tagsData: getTagsDataSelector(state),
    standardsPerformanceSummary: getReportsStandardsPerformanceSummary(state),
    standardsGradebook: getReportsStandardsGradebook(state),
    standardsProgress: getReportsStandardsProgress(state),
  }),
  {
    setFilters: setFiltersAction,
    setTestIds: setTestIdAction,
    setTempDdFilter: setTempDdFilterAction,
    setTagsData: setTagsDataAction,
  }
)(StandardsMasteryRowFilters)
