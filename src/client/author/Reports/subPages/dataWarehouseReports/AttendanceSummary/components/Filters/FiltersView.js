import { Col, DatePicker, Row, Spin, Tabs } from 'antd'
import React from 'react'

import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

import { EduIf } from '@edulastic/common'
import moment from 'moment'
import { PERIOD_TYPES } from '@edulastic/constants/reportUtils/common'
import ClassAutoComplete from '../../../../../common/components/autocompletes/ClassAutoComplete'
import CourseAutoComplete from '../../../../../common/components/autocompletes/CourseAutoComplete'
import GroupsAutoComplete from '../../../../../common/components/autocompletes/GroupsAutoComplete'
import SchoolAutoComplete from '../../../../../common/components/autocompletes/SchoolAutoComplete'
import TeacherAutoComplete from '../../../../../common/components/autocompletes/TeacherAutoComplete'
import FilterTags from '../../../../../common/components/FilterTags'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import {
  FilterLabel,
  ReportFiltersContainer,
  ReportFiltersWrapper,
  StyledEduButton,
} from '../../../../../common/styled'

import { staticDropDownData } from '../../utils/constants'

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
  updateFilterDropdownCB,
  schoolYears,
  userRole,
  demographics,
  terms,
  showApply,
  loadingFiltersData,
  onGoClick,
}) {
  const presentTerms = terms.filter(
    (term) => term.startDate <= Date.now() && term.endDate >= Date.now()
  )
  const isPresentTermSelected = presentTerms
    .map((t) => t._id)
    .includes(filters.termId)
  const availablePeriodTypes = !isPresentTermSelected
    ? staticDropDownData.periodTypes.filter(
        (period) => period.key === PERIOD_TYPES.CUSTOM
      )
    : staticDropDownData.periodTypes

  const isDateWithinTermTillPresent = (date) => {
    const { startDate, endDate } =
      terms.find((term) => term._id === filters.termId) || {}
    if (!startDate || !endDate) return true
    const fromDate = +moment(startDate).startOf('month')
    const toDate = +moment(Math.min(endDate, Date.now())).endOf('month')
    return date <= toDate && date >= fromDate
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
                        {roleuser.DA_SA_ROLE_ARRAY.includes(userRole) && (
                          <>
                            <Col span={6}>
                              <SchoolAutoComplete
                                dataCy="schools"
                                selectedSchoolIds={
                                  filters.schoolIds
                                    ? filters.schoolIds.split(',')
                                    : []
                                }
                                selectCB={(e) =>
                                  updateFilterDropdownCB(e, 'schoolIds', true)
                                }
                              />
                            </Col>
                            <Col span={6}>
                              <TeacherAutoComplete
                                dataCy="teachers"
                                termId={filters.termId}
                                school={filters.schoolIds}
                                selectedTeacherIds={
                                  filters.teacherIds
                                    ? filters.teacherIds.split(',')
                                    : []
                                }
                                selectCB={(e) =>
                                  updateFilterDropdownCB(e, 'teacherIds', true)
                                }
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
                          <FilterLabel data-cy="course">Course</FilterLabel>
                          <CourseAutoComplete
                            selectedCourseId={filters.courseId}
                            selectCB={(e) =>
                              updateFilterDropdownCB(e, 'courseId')
                            }
                          />
                        </Col>
                        <Col span={6}>
                          <ClassAutoComplete
                            dataCy="classes"
                            termId={filters.termId}
                            schoolIds={filters.schoolIds}
                            teacherIds={filters.teacherIds}
                            grades={filters.grades}
                            subjects={filters.subjects}
                            courseId={
                              filters.courseId !== 'All' && filters.courseId
                            }
                            selectedClassIds={
                              filters.classIds
                                ? filters.classIds.split(',')
                                : []
                            }
                            selectCB={(e) =>
                              updateFilterDropdownCB(e, 'classIds', true)
                            }
                          />
                        </Col>
                        <Col span={6}>
                          <GroupsAutoComplete
                            dataCy="groups"
                            termId={filters.termId}
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
                          />
                        </Col>
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
                      <Row type="flex" gutter={[5, 10]}>
                        <Col span={6}>
                          <FilterLabel data-cy="periodType">Period</FilterLabel>
                          <ControlDropDown
                            by={{ key: filters.periodType }}
                            selectCB={(e, selected) =>
                              updateFilterDropdownCB(selected, 'periodType')
                            }
                            data={availablePeriodTypes}
                            prefix="Period"
                            showPrefixOnSelected={false}
                          />
                        </Col>
                        <EduIf
                          condition={filters.periodType === PERIOD_TYPES.CUSTOM}
                        >
                          <Col span={6}>
                            <FilterLabel data-cy="customPeriodStart">
                              Start Date
                            </FilterLabel>
                            <DatePicker.MonthPicker
                              style={{ width: '100%' }}
                              disabledDate={(date) => {
                                if (!isDateWithinTermTillPresent(date))
                                  return true
                                const maxDate = filters.customPeriodEnd
                                if (maxDate && maxDate < date) return true
                                return false
                              }}
                              value={moment(filters.customPeriodStart)}
                              onChange={(date) => {
                                updateFilterDropdownCB(
                                  { key: +date },
                                  'customPeriodStart'
                                )
                              }}
                            />
                          </Col>
                          <Col span={6}>
                            <FilterLabel data-cy="customPeriodEnd">
                              End Date
                            </FilterLabel>
                            <DatePicker.MonthPicker
                              style={{ width: '100%' }}
                              disabledDate={(date) => {
                                if (!isDateWithinTermTillPresent(date))
                                  return true
                                const minDate = filters.customPeriodStart
                                if (minDate && minDate > date) return true
                                return false
                              }}
                              value={moment(filters.customPeriodEnd)}
                              onChange={(date) =>
                                updateFilterDropdownCB(
                                  { key: +date },
                                  'customPeriodEnd'
                                )
                              }
                            />
                          </Col>
                        </EduIf>
                      </Row>
                    </Tabs.TabPane>
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
                  <StyledEduButton
                    width="25%"
                    height="40px"
                    style={{ maxWidth: '200px' }}
                    key="applyButton"
                    data-cy="applyFilter"
                    data-testid="applyFilter"
                    disabled={!showApply || loadingFiltersData}
                    onClick={() => onGoClick()}
                  >
                    Apply
                  </StyledEduButton>
                </Col>
              </Row>
            </Spin>
          </ReportFiltersWrapper>
        </ReportFiltersContainer>
      </Col>
    </Row>
  )
}

export default FiltersView
