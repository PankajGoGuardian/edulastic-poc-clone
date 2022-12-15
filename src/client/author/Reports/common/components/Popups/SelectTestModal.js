import React, { useState } from 'react'
import { compose } from 'redux'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { withRouter } from 'react-router'
import { CustomModalStyled, EduButton, FieldLabel } from '@edulastic/common'
import { largeDesktopWidth, tabletWidth } from '@edulastic/colors'
import TagFilter from '../../../../src/components/common/TagFilter'
import MultiSelectDropdown from '../widgets/MultiSelectDropdown'
import AssessmentAutoComplete from '../autocompletes/AssessmentAutoComplete'

import staticDropDownData from '../../../subPages/multipleAssessmentReport/common/static/staticDropDownData.json'

const SelectTestModal = ({ visible, onCancel, history }) => {
  const [filters, setFilters] = useState({
    testId: '',
  })

  const updateFilterDropdownCB = (selected, filterName, multiple = false) => {
    const _filters = { ...filters }
    const _selected = multiple
      ? selected.map((o) => o.key).join(',')
      : selected.key
    _filters[filterName] = _selected
    setFilters(_filters)
  }

  const handleOnAssignBtnClick = () => {
    console.log('testId', filters.testId)
    history.push(`/author/assignments/${filters.testId}`)
  }

  return (
    <StyledModal
      title="Select a test you'd like to assign"
      visible={visible}
      footer={[
        <StyledCol span={24}>
          <EduButton
            data-cy="cancelGroup"
            width="200px"
            isGhost
            onClick={onCancel}
          >
            Cancel
          </EduButton>
          <EduButton
            data-cy="assignTest"
            width="200px"
            isGhost
            onClick={handleOnAssignBtnClick}
            disabled={isEmpty(filters?.testId)}
          >
            Assign Test
          </EduButton>
        </StyledCol>,
      ]}
      onCancel={onCancel}
      centered
    >
      <StyledDiv>
        <Row type="flex" gutter={[5, 10]}>
          <Col span={8}>
            <MultiSelectDropdown
              dataCy="testGrade"
              label="Grade"
              onChange={(e) => {
                const selected = staticDropDownData.grades.filter((a) =>
                  e.includes(a.key)
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
          <Col span={8}>
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
                filters.testSubjects && filters.testSubjects !== 'All'
                  ? filters.testSubjects.split(',')
                  : []
              }
              options={staticDropDownData.subjects}
            />
          </Col>
          <Col span={8}>
            <FilterLabel data-cy="tags-select">Tags</FilterLabel>
            <TagFilter
              onChangeField={(type, selected) => {
                const _selected = selected.map(
                  ({ _id: key, tagName: title }) => ({ key, title })
                )
                updateFilterDropdownCB(_selected, 'tagIds', true)
              }}
              selectedTagIds={filters.tagIds ? filters.tagIds.split(',') : []}
            />
          </Col>
          <Col span={24}>
            <FilterLabel data-cy="test">Test</FilterLabel>
            <AssessmentAutoComplete
              autoCompleteStyles={{ width: '100%' }}
              firstLoad
              termId={filters.termId}
              grades={filters.testGrades}
              tagIds={filters.tagIds}
              subjects={filters.testSubjects}
              testTypes={filters.assessmentTypes}
              selectedTestId={filters.testId}
              selectCB={(selected) =>
                updateFilterDropdownCB(selected, 'testId', false)
              }
              showApply={() => {}}
            />
          </Col>
        </Row>
      </StyledDiv>
    </StyledModal>
  )
}

const StyledModal = styled(CustomModalStyled)`
  min-width: 960px;
  padding-bottom: 0px;
  .ant-modal-content {
    width: 960px;

    @media (max-width: ${largeDesktopWidth}) {
      width: 707px;
    }
    @media (max-width: ${tabletWidth}) {
      width: 600px;
    }
  }
  @media (max-width: ${largeDesktopWidth}) {
    min-width: 707px;
  }
  @media (max-width: ${tabletWidth}) {
    min-width: 600px;
  }
`

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify || 'center'};
  margin-bottom: ${(props) => props.marginBottom};
  svg {
    cursor: pointer;
  }
`

const StyledDiv = styled.div`
  padding: 10px;
`
export const FilterLabel = styled(FieldLabel)`
  font-size: 10px;
`

export default compose(withRouter)(SelectTestModal)
