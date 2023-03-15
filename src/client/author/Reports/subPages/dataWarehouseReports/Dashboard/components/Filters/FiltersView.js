import { Col, DatePicker, Row, Tabs } from 'antd'
import React from 'react'

import { FieldLabel } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { IconFilter } from '@edulastic/icons'

import TagFilter from '../../../../../../src/components/common/TagFilter'
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
  SecondaryFilterRow,
  StyledDropDownContainer,
  StyledEduButton,
} from '../../../../../common/styled'

import { staticDropDownData } from '../../utils'

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
  assessmentTypesRef,
  availableAssessmentType,
  userRole,
  demographics,
  terms,
  showApply,
  loadingFiltersData,
  onGoClick,
  selectedPerformanceBand,
  performanceBandsList,
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
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testGrade"
                          label="Test Grade"
                          onChange={(e) => {
                            const selected = staticDropDownData.grades.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(selected, 'testGrades', true)
                          }}
                          value={
                            filters.testGrades && filters.testGrades !== 'All'
                              ? filters.testGrades.split(',')
                              : []
                          }
                          options={staticDropDownData.grades}
                        />
                      </Col>
                      <Col span={6}>
                        <MultiSelectDropdown
                          dataCy="testSubject"
                          label="Test Subject"
                          onChange={(e) => {
                            const selected = staticDropDownData.subjects.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(
                              selected,
                              'testSubjects',
                              true
                            )
                          }}
                          value={
                            filters.testSubjects &&
                            filters.testSubjects !== 'All'
                              ? filters.testSubjects.split(',')
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
                            const selected = availableAssessmentType.filter(
                              (a) => e.includes(a.key)
                            )
                            updateFilterDropdownCB(
                              selected,
                              'assessmentTypes',
                              true
                            )
                          }}
                          value={
                            filters.assessmentTypes
                              ? filters.assessmentTypes.split(',')
                              : []
                          }
                          options={availableAssessmentType}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="tags-select">Tags</FilterLabel>
                        <TagFilter
                          onChangeField={(type, selected) => {
                            const _selected = selected.map(
                              ({ _id: key, tagName: title }) => ({ key, title })
                            )
                            updateFilterDropdownCB(_selected, 'tagIds', true)
                          }}
                          selectedTagIds={
                            filters.tagIds ? filters.tagIds.split(',') : []
                          }
                        />
                      </Col>
                    </Row>
                  </Tabs.TabPane>

                  <Tabs.TabPane
                    key={staticDropDownData.filterSections.CLASS_FILTERS.key}
                    tab={staticDropDownData.filterSections.CLASS_FILTERS.title}
                    forceRender
                  >
                    <Row type="flex" gutter={[5, 10]}>
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
                            filters.classIds ? filters.classIds.split(',') : []
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
                            filters.groupIds ? filters.groupIds.split(',') : []
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
                      staticDropDownData.filterSections.DEMOGRAPHIC_FILTERS.key
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
                        <FilterLabel data-cy="period">Period</FilterLabel>
                        <ControlDropDown
                          by={{ key: filters.period }}
                          selectCB={(e, selected) =>
                            updateFilterDropdownCB(selected, 'period')
                          }
                          data={staticDropDownData.periods}
                          prefix="Period"
                          showPrefixOnSelected={false}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="customPeriodStartTime">
                          Start Date
                        </FilterLabel>
                        <DatePicker.MonthPicker
                          style={{ width: '100%' }}
                          disabledDate={(date) => {
                            let isEnabled = true
                            const {
                              startDate: termStartDate,
                              endDate: termEndDate,
                            } =
                              terms.find(
                                (term) => term._id === filters.termId
                              ) || {}
                            if (!termStartDate || !termEndDate) return true
                            isEnabled =
                              date.valueOf() <= termEndDate &&
                              date.valueOf() >= termStartDate
                            const maxDate = filters.customPeriodEndTime
                            isEnabled = maxDate
                              ? +maxDate > date && isEnabled
                              : isEnabled
                            return !isEnabled
                          }}
                        />
                      </Col>
                      <Col span={6}>
                        <FilterLabel data-cy="customPeriodEndTime">
                          End Date
                        </FilterLabel>
                        <DatePicker.MonthPicker
                          style={{ width: '100%' }}
                          disabledDate={(date) => {
                            let isEnabled = true
                            const {
                              startDate: termStartDate,
                              endDate: termEndDate,
                            } =
                              terms.find(
                                (term) => term._id === filters.termId
                              ) || {}
                            if (!termStartDate || !termEndDate) return true
                            isEnabled =
                              date.valueOf() <= termEndDate &&
                              date.valueOf() >= termStartDate
                            const minDate = filters.customPeriodStartTime
                            isEnabled = minDate
                              ? +minDate < date && isEnabled
                              : isEnabled
                            return !isEnabled
                          }}
                        />
                      </Col>
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
          </ReportFiltersWrapper>
        </ReportFiltersContainer>
      </Col>
      <Col span={24}>
        <SecondaryFilterRow hidden={!!reportId} width="100%" fieldHeight="40px">
          <StyledDropDownContainer
            flex="0 0 300px"
            xs={24}
            sm={12}
            lg={6}
            data-cy="performanceBand"
            data-testid="performanceBand"
          >
            <FieldLabel fs=".7rem" data-cy="schoolYear">
              EDULASTIC PERFORMANCE BAND
            </FieldLabel>
            <ControlDropDown
              by={selectedPerformanceBand}
              selectCB={(e, selected) =>
                updateFilterDropdownCB(selected, 'profileId', false, true)
              }
              data={performanceBandsList}
              prefix="Performance Band"
              showPrefixOnSelected={false}
            />
          </StyledDropDownContainer>
          {filters.showApply && (
            <StyledEduButton
              btnType="primary"
              data-testid="applyRowFilter"
              data-cy="applyRowFilter"
              disabled={loadingFiltersData}
              onClick={() => onGoClick()}
            >
              APPLY
            </StyledEduButton>
          )}
        </SecondaryFilterRow>
      </Col>
    </Row>
  )
}

export default FiltersView
