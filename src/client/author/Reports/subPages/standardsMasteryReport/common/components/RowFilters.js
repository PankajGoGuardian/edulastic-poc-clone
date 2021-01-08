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

const StandardsMasteryRowFilters = ({
  pageTitle,
  showFilter,
  setShowFilter,
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
    const domainTagsData = domainsList.filter((d) => _domainIds.includes(d.key))
    setTagsData({ ...tagsData, domainIds: domainTagsData })
    setFilters({ ...filters, domainIds: _domainIds, showApply: true })
  }
  const onChangeDomains = (domains) => {
    if (!domains?.length) {
      setTagsData({ ...tagsData, domainIds: [] })
      setFilters({ ...filters, domainIds: [], showApply: true })
    }
  }

  const handleCloseTag = (type, { key }) => {
    const _filters = { ...filters, showApply: true }
    const _tagsData = { ...tagsData }
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
    setTagsData(_tagsData)
    setFilters(_filters)
    setShowFilter(true)
  }

  return (
    <>
      <FilterTags
        tagsData={tagsData}
        tagTypes={staticDropDownData.tagTypes}
        handleCloseTag={handleCloseTag}
      />
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
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, 'standardGrade')
                }
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
)(StandardsMasteryRowFilters)
