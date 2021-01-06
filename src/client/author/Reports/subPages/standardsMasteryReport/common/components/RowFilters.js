import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { get, groupBy } from 'lodash'
import { Row, Col } from 'antd'

import {
  StyledDropDownContainer,
  StyledFilterWrapper,
} from '../../../../common/styled'
import FilterTags from '../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { MultipleSelect } from '../../../../common/components/widgets/MultipleSelect'
import { toggleItem } from '../../../../common/util'

import { getInterestedCurriculumsSelector } from '../../../../../src/selectors/user'
import {
  getFiltersSelector,
  setFiltersAction,
  getTagsDataSelector,
  setTagsDataAction,
  getReportsStandardsFilters,
  getReportsStandardsFiltersLoader,
} from '../filterDataDucks'
import { getReportsStandardsPerformanceSummary } from '../../standardsPerformance/ducks'
import { getReportsStandardsGradebook } from '../../standardsGradebook/ducks'

import staticDropDownData from '../static/json/staticDropDownData.json'

const StandardsFilters = ({
  pageTitle,
  showFilter,
  loading,
  standardsFilters,
  filters,
  setFilters,
  tagsData,
  setTagsData,
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
    // update tags data
    const _tagsData = { ...tagsData, [keyName]: selected }
    if (!selected.key || selected.key === 'All') {
      delete _tagsData[keyName]
    }
    setTagsData(_tagsData)
    // update filters
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
    // TODO: fix this
    // const domainsTagData = domainsList
    //   .filter((d) => _domainIds.includes(d.key))
    //   .map((d) => ({ ...d, onClose: () => onSelectDomain(d) }))
    // setTagsData({ ...tagsData, domainIds: [] })
    setFilters({ ...filters, domainIds: _domainIds, showApply: true })
  }
  const onChangeDomains = (domains) => {
    if (!domains?.length) {
      setTagsData({ ...tagsData, domainIds: [] })
      setFilters({ ...filters, domainIds: [], showApply: true })
    }
  }

  return (
    <>
      <FilterTags tagsData={tagsData} />
      <StyledFilterWrapper
        style={{ display: !showFilter || loading ? 'none' : 'flex' }}
        isRowFilter
      >
        <Col span={24}>
          <Row type="flex" justify="end">
            <StyledDropDownContainer xs={24} sm={12} md={12} lg={6} xl={6}>
              <ControlDropDown
                by={filters.curriculumId}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'curriculumId')
                }
                data={curriculumsList}
                prefix="Standard Set"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={12} md={12} lg={6} xl={6}>
              <ControlDropDown
                by={filters.standardGrade}
                selectCB={(e, selected) => {
                  selected.onClose = () =>
                    updateFilterDropdownCB(
                      staticDropDownData.allGrades[0],
                      'standardGrade'
                    )
                  updateFilterDropdownCB(selected, 'standardGrade')
                }}
                data={staticDropDownData.allGrades}
                prefix="Standard Grade"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={12} md={12} lg={6} xl={6}>
              <ControlDropDown
                by={filters.profileId || defaultProficiencyId}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'profileId')
                }
                data={proficiencyList}
                prefix="Standard Proficiency"
                showPrefixOnSelected={false}
              />
            </StyledDropDownContainer>
            <StyledDropDownContainer xs={24} sm={12} md={12} lg={6} xl={6}>
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
    </>
  )
}

export default connect(
  (state) => ({
    interestedCurriculums: getInterestedCurriculumsSelector(state),
    loading: getReportsStandardsFiltersLoader(state),
    standardsFilters: getReportsStandardsFilters(state),
    filters: getFiltersSelector(state),
    tagsData: getTagsDataSelector(state),
    standardsPerformanceSummary: getReportsStandardsPerformanceSummary(state),
    standardsGradebook: getReportsStandardsGradebook(state),
  }),
  {
    setFilters: setFiltersAction,
    setTagsData: setTagsDataAction,
  }
)(StandardsFilters)
