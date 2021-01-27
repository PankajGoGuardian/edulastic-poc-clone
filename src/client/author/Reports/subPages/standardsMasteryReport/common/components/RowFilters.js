import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { get, groupBy } from 'lodash'
import { Row, Col } from 'antd'

import {
  StyledDropDownContainer,
  StyledFilterWrapper,
} from '../../../../common/styled'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { MultipleSelect } from '../../../../common/components/widgets/MultipleSelect'
import { toggleItem } from '../../../../common/util'

import { getInterestedCurriculumsSelector } from '../../../../../src/selectors/user'
import {
  getFiltersSelector,
  setFiltersAction,
  getReportsStandardsFilters,
  getReportsStandardsFiltersLoader,
} from '../filterDataDucks'
import { getReportsStandardsPerformanceSummary } from '../../standardsPerformance/ducks'
import { getReportsStandardsGradebook } from '../../standardsGradebook/ducks'
import { getReportsStandardsProgress } from '../../standardsProgress/ducks'

import staticDropDownData from '../static/json/staticDropDownData.json'

const StandardsFilters = ({
  pageTitle,
  showFilter,
  loading,
  standardsFilters,
  filters,
  setFilters,
  interestedCurriculums,
  standardsPerformanceSummary,
  standardsGradebook,
  standardsProgress,
}) => {
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

  // memoize proficiencyList for standards filters data
  const scaleInfo = get(standardsFilters, 'data.result.scaleInfo', [])
  const defaultProficiencyId = scaleInfo.find((s) => s.default)?._id || ''
  const proficiencyList = useMemo(
    () => scaleInfo.map((s) => ({ key: s._id, title: s.name })),
    [scaleInfo]
  )

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
  const standardIdFromPageData = get(
    skillInfoOptions[pageTitle],
    'data.result.standardId'
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
  const selectedStandard =
    standardsList.find((o) => o.key === `${standardIdFromPageData}`) ||
    standardsList.find((o) => o.key === `${filters.standardId}`) ||
    standardsList[0]

  // update handlers
  const updateFilterDropdownCB = (selected, keyName) => {
    const _filters = {
      ...filters,
      [keyName]: selected.key,
      showApply: true,
    }
    setFilters(_filters)
  }
  const onSelectDomain = (domain) => {
    const _domainIds = toggleItem(filters.domainIds, domain.key).filter((o) =>
      allDomainIds.includes(o)
    )
    setFilters({ ...filters, domainIds: _domainIds, showApply: true })
  }
  const onChangeDomains = (domains) => {
    if (!domains?.length) {
      setFilters({ ...filters, domainIds: [], showApply: true })
    }
  }

  const filterColSpan = pageTitle === 'Standards Progress' ? 5 : 6

  return (
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
          <StyledDropDownContainer
            xs={24}
            sm={12}
            md={12}
            lg={filterColSpan}
            xl={filterColSpan}
          >
            <ControlDropDown
              by={filters.profileId || defaultProficiencyId}
              selectCB={(e) => updateFilterDropdownCB(e, 'profileId')}
              data={proficiencyList}
              prefix="Standard Proficiency"
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
            <StyledDropDownContainer xs={24} sm={12} md={12} lg={4} xl={4}>
              <ControlDropDown
                by={selectedStandard}
                selectCB={(e) => updateFilterDropdownCB(e, 'standardId')}
                data={standardsList}
                prefix="Standard"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
          )}
        </Row>
      </Col>
    </StyledFilterWrapper>
  )
}

export default connect(
  (state) => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    loading: getReportsStandardsFiltersLoader(state),
    standardsFilters: getReportsStandardsFilters(state),
    filters: getFiltersSelector(state),
    standardsPerformanceSummary: getReportsStandardsPerformanceSummary(state),
    standardsGradebook: getReportsStandardsGradebook(state),
    standardsProgress: getReportsStandardsProgress(state),
  }),
  {
    setFilters: setFiltersAction,
  }
)(StandardsFilters)
