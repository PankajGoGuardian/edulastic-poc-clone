import { Col, Row, Spin, Tabs } from 'antd'
import React from 'react'

import { IconFilter } from '@edulastic/icons'

import FilterTags from '../../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import {
  FilterLabel,
  ReportFiltersContainer,
  ReportFiltersWrapper,
  StyledEduButton,
} from '../../../../../common/styled'

import { staticDropDownData } from '../../utils'
import FilterTestFields from '../../../../../common/components/FilterTestFields'
import FilterClassFields from '../../../../../common/components/FilterClassFields'
import FilterActions from '../../../../../common/components/FilterActions'
import PageLevelFilters from './PageLevelFilters'

function FiltersView({
  isPrinting,
  reportId,
  firstLoad,
  selectedFilterTagsData,
  tagTypes,
  handleCloseTag,
  handleTagClick,
  showFilter,
  toggleFilter,
  filtersTabKey,
  setFiltersTabKey,
  filters,
  updateFilterDropdownCB,
  onAssessmentSelect,
  schoolYears,
  performanceBandsList,
  assessmentTypesRef,
  availableAssessmentType,
  externalTests,
  externalBands,
  userRole,
  demographics,
  showPageLevelApply,
  showApply,
  loadingFiltersData,
  onGoClick,
}) {
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
            <Spin spinning={loadingFiltersData}>
              <Row>
                <Col span={24} style={{ padding: '0 5px' }}>
                  <Tabs
                    animated={false}
                    activeKey={filtersTabKey}
                    onChange={setFiltersTabKey}
                  >
                    <Tabs.TabPane
                      key={staticDropDownData.filterSections.TEST_FILTERS.key}
                      tab={staticDropDownData.filterSections.TEST_FILTERS.title}
                    >
                      <Row type="flex" gutter={[5, 10]}>
                        <FilterTestFields
                          filters={filters}
                          updateFilterDropdownCB={updateFilterDropdownCB}
                          schoolYears={schoolYears}
                          assessmentTypesRef={assessmentTypesRef}
                          availableAssessmentType={availableAssessmentType}
                          dropdownData={staticDropDownData}
                        />
                      </Row>
                    </Tabs.TabPane>

                    <Tabs.TabPane
                      key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                      tab={
                        staticDropDownData.filterSections.CLASS_FILTERS.title
                      }
                      forceRender
                    >
                      <Row type="flex" gutter={[5, 10]}>
                        <FilterClassFields
                          userRole={userRole}
                          filters={filters}
                          updateFilterDropdownCB={updateFilterDropdownCB}
                          dropDownData={staticDropDownData}
                        />
                      </Row>
                    </Tabs.TabPane>

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
                        {demographics.map?.((item) => (
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
                  </Tabs>
                </Col>
                <FilterActions
                  toggleFilter={toggleFilter}
                  showApply={showApply}
                  loadingFiltersData={loadingFiltersData}
                  onGoClick={onGoClick}
                />
              </Row>
            </Spin>
          </ReportFiltersWrapper>
        </ReportFiltersContainer>
      </Col>
      <Col span={24}>
        <PageLevelFilters
          reportId={reportId}
          firstLoad={firstLoad}
          filters={filters}
          showPageLevelApply={showPageLevelApply}
          loadingFiltersData={loadingFiltersData}
          updateFilterDropdownCB={updateFilterDropdownCB}
          onAssessmentSelect={onAssessmentSelect}
          performanceBandsList={performanceBandsList}
          externalTests={externalTests}
          externalBands={externalBands}
          onGoClick={onGoClick}
        />
      </Col>
    </Row>
  )
}

export default FiltersView