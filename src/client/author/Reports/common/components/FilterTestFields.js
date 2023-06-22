import { Col } from 'antd'
import React from 'react'
import { EduIf } from '@edulastic/common'
import TagFilter from '../../../src/components/common/TagFilter'
import { ControlDropDown } from './widgets/controlDropDown'
import MultiSelectDropdown from './widgets/MultiSelectDropdown'
import { FilterLabel } from '../styled'

function FilterTestFields({
  filters,
  updateFilterDropdownCB,
  schoolYears,
  availableAssessmentType,
  // TODO dropDownData hardly changes. Better provide a default
  dropdownData,
  // TODO implement `exclude` for other Fields as well.
  exclude = [],
}) {
  return (
    <>
      <Col span={6}>
        <FilterLabel data-cy="schoolYear">School Year</FilterLabel>
        <ControlDropDown
          by={filters.termId}
          selectCB={(e, selected) => updateFilterDropdownCB(selected, 'termId')}
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
            const selected = dropdownData.grades.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'testGrades', true)
          }}
          value={
            filters.testGrades && filters.testGrades?.toLowerCase() !== 'all'
              ? filters.testGrades.split(',')
              : []
          }
          options={dropdownData.grades}
        />
      </Col>
      <Col span={6}>
        <MultiSelectDropdown
          dataCy="testSubject"
          label="Test Subject"
          onChange={(e) => {
            const selected = dropdownData.subjects.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'testSubjects', true)
          }}
          value={
            filters.testSubjects &&
            filters.testSubjects?.toLowerCase() !== 'all'
              ? filters.testSubjects.split(',')
              : []
          }
          options={dropdownData.subjects}
        />
      </Col>
      <Col span={6}>
        <MultiSelectDropdown
          dataCy="testTypes"
          label="Test Type"
          onChange={(e) => {
            const selected = availableAssessmentType.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'assessmentTypes', true)
          }}
          value={
            filters.assessmentTypes ? filters.assessmentTypes.split(',') : []
          }
          options={availableAssessmentType}
        />
      </Col>
      <EduIf condition={!exclude.includes('tagIds')}>
        <Col span={6}>
          <FilterLabel data-cy="tags-select">Tags</FilterLabel>
          <TagFilter
            onChangeField={(type, selected) => {
              const _selected = selected.map(
                ({ _id: key, tagName: title }) => ({
                  key,
                  title,
                })
              )
              updateFilterDropdownCB(_selected, 'tagIds', true)
            }}
            selectedTagIds={filters.tagIds ? filters.tagIds.split(',') : []}
          />
        </Col>
      </EduIf>
    </>
  )
}

export default FilterTestFields
