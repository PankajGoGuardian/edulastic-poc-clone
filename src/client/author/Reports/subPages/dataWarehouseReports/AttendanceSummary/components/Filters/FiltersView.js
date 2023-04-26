import { Col, Row, Spin, Tabs } from 'antd'
import React from 'react'

import { IconFilter } from '@edulastic/icons'

import { EduIf, FlexContainer } from '@edulastic/common'
import FilterTags from '../../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import {
  FilterLabel,
  ReportFiltersContainer,
  ReportFiltersWrapper,
  StyledEduButton,
} from '../../../../../common/styled'

import { filterKeys, staticDropDownData } from '../../utils/constants'
import FilterPeriodFields from '../../../../../common/components/FilterPeriodFields'
import FilterActions from '../../../../../common/components/FilterActions'
import FilterClassFields from '../../../../../common/components/FilterClassFields'

function FiltersView({
  isPrinting,
  reportId,
  selectedFilterTagsData,
  tagTypes,
  handleCloseTag,
  handleTagClick,
  showFilter,
  toggleFilter,
  filtersTabKey,
  setFiltersTabKey,
  filters,
  setFilters,
  filterTagsData,
  setFilterTagsData,
  updateFilterDropdownCB,
  schoolYears,
  userRole,
  demographics,
  terms,
  showApply,
  loadingFiltersData,
  onGoClick,
  attendanceBandInfo,
  profileId,
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
          <FlexContainer style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EduIf condition={attendanceBandInfo.length}>
              <ControlDropDown
                style={{ margin: '0 10px' }}
                by={profileId}
                data={attendanceBandInfo}
                selectCB={(e, selected) =>
                  updateFilterDropdownCB(selected, filterKeys.ATTENDANCE_BAND)
                }
              />
            </EduIf>
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
          </FlexContainer>
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
                      key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                      tab={
                        staticDropDownData.filterSections.CLASS_FILTERS.title
                      }
                      forceRender
                    >
                      <Row type="flex" gutter={[5, 10]}>
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

                    <Tabs.TabPane
                      key={staticDropDownData.filterSections.PERIOD.key}
                      tab={staticDropDownData.filterSections.PERIOD.title}
                    >
                      <FilterPeriodFields
                        filters={filters}
                        updateFilterDropdownCB={updateFilterDropdownCB}
                        terms={terms}
                        allPeriodTypes={staticDropDownData.periodTypes}
                        setFilters={setFilters}
                        filterTagsData={filterTagsData}
                        setFilterTagsData={setFilterTagsData}
                      />
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
    </Row>
  )
}

export default FiltersView
