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
  const scaleInfo = get(standardsFilters, 'scaleInfo', [])
  const defaultProficiencyId = scaleInfo.find((s) => s.default)?._id || ''
  const proficiencyList = useMemo(
    () => scaleInfo.map((s) => ({ key: s._id, title: s.name })),
    [scaleInfo]
  )

  // curate domainsData from page data
  const skillInfoOptions = {
    'Standards Performance Summary': standardsPerformanceSummary,
    'Standards Gradebook': standardsGradebook,
  }
  const skillInfo = get(
    skillInfoOptions[pageTitle],
    'data.result.skillInfo',
    []
  ).filter((o) => `${o.curriculumId}` === `${filters.curriculumId}`)
  const domainGroup = groupBy(skillInfo, (o) => `${o.domainId}`)
  const allDomainIds = Object.keys(domainGroup)
  const domainsList = allDomainIds.map((domainId) => ({
    key: `${domainId}`,
    title: domainGroup[domainId][0].domain,
  }))
  const selectedDomains = (domainsList || []).filter((o) =>
    filters.domainIds?.includes(o.key)
  )

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

  return (
    <StyledFilterWrapper
      style={{ display: !showFilter || loading ? 'none' : 'flex' }}
      isRowFilter
    >
      <Col span={24}>
        <Row type="flex" justify="end">
          <StyledDropDownContainer xs={24} sm={24} md={7} lg={7} xl={7}>
            <ControlDropDown
              by={filters.curriculumId}
              selectCB={(e) => updateFilterDropdownCB(e, 'curriculumId')}
              data={curriculumsList}
              prefix="Standard Set"
              showPrefixOnSelected={false}
            />
          </StyledDropDownContainer>
          <StyledDropDownContainer xs={24} sm={24} md={7} lg={7} xl={7}>
            <ControlDropDown
              by={filters.profileId || defaultProficiencyId}
              selectCB={(e) => updateFilterDropdownCB(e, 'profileId')}
              data={proficiencyList}
              prefix="Standard Proficiency"
              showPrefixOnSelected={false}
            />
          </StyledDropDownContainer>
          <StyledDropDownContainer xs={22} sm={22} md={7} lg={7} xl={7}>
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
  }),
  {
    setFilters: setFiltersAction,
  }
)(StandardsFilters)
