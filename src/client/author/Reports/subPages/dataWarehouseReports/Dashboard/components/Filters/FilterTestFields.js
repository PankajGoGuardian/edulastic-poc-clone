import { Col, Row } from 'antd'
import React from 'react'
import TagFilter from '../../../../../../src/components/common/TagFilter'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import MultiSelectDropdown from '../../../../../common/components/widgets/MultiSelectDropdown'
import { FilterLabel } from '../../../../../common/styled'
import { staticDropDownData } from '../../utils'

function FilterTestFields({
  filters,
  updateFilterDropdownCB,
  schoolYears,
  assessmentTypesRef,
  availableAssessmentType,
}) {
  return (
    <Row type="flex" gutter={[5, 10]}>
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
            const selected = staticDropDownData.grades.filter((a) =>
              e.includes(a.key)
            )
            updateFilterDropdownCB(selected, 'testGrades', true)
          }}
          value={
            filters.testGrades && filters.testGrades?.toLowerCase() !== 'all'
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
            const selected = staticDropDownData.subjects.filter((a) =>
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
          options={staticDropDownData.subjects}
        />
      </Col>
      <Col span={6}>
        <MultiSelectDropdown
          dataCy="testTypes"
          label="Test Type"
          el={assessmentTypesRef}
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
      <Col span={6}>
        <FilterLabel data-cy="tags-select">Tags</FilterLabel>
        <TagFilter
          onChangeField={(type, selected) => {
            const _selected = selected.map(({ _id: key, tagName: title }) => ({
              key,
              title,
            }))
            updateFilterDropdownCB(_selected, 'tagIds', true)
          }}
          selectedTagIds={filters.tagIds ? filters.tagIds.split(',') : []}
        />
      </Col>
    </Row>
  )
}

export default FilterTestFields
