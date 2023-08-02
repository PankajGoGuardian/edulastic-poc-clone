import {
  EduButton,
  EduIf,
  FlexContainer,
  NumberInputStyled,
  SelectInputStyled,
  TextAreaInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Row, Select } from 'antd'
import React from 'react'
import { selectsData } from '../../../TestPage/components/common'
import { StyledFilterLabel, StyledRequired } from './styled'
import { formFields } from './ducks/constants'

const {
  testName,
  itemTypes,
  numberOfItems,
  grades,
  subjects,
  difficulty,
  dok,
  description,
} = formFields

export const FormFields = ({
  handleFieldDataChange,
  handleAiFormSubmit,
  onCancel,
  createItems,
}) => {
  return (
    <Row>
      <Row gutter={30}>
        <EduIf condition={!createItems}>
          <Col xs={24}>
            <StyledFilterLabel>
              Test Name<StyledRequired>*</StyledRequired>
            </StyledFilterLabel>
            <TextInputStyled
              placeholder="Enter Test Name"
              maxLength={256}
              onChange={(e) => handleFieldDataChange(testName, e.target.value)}
            />
          </Col>
        </EduIf>
      </Row>
      <Row gutter={30}>
        <Col xs={12}>
          <StyledFilterLabel>
            Item Types<StyledRequired>*</StyledRequired>
          </StyledFilterLabel>
          <SelectInputStyled
            showArrow
            showSearch
            placeholder="Select Item Types"
            optionFilterProp="children"
            filterOption={() => {}}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            height="36px"
            onChange={(value) => handleFieldDataChange(itemTypes, value)}
          >
            {selectsData.allQuestionTypes.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
        <Col xs={12}>
          <StyledFilterLabel>
            Number Of Items<StyledRequired>*</StyledRequired>
          </StyledFilterLabel>
          <NumberInputStyled
            onChange={(value) => handleFieldDataChange(numberOfItems, value)}
            min={1}
            max={100}
            step={1}
            defaultValue={5}
            height="36px"
          />
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xs={12}>
          <StyledFilterLabel>
            Grades<StyledRequired>*</StyledRequired>
          </StyledFilterLabel>
          <SelectInputStyled
            height="36px"
            showArrow
            showSearch
            placeholder="Select Grades"
            optionFilterProp="children"
            mode="multiple"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleFieldDataChange(grades, value)}
          >
            {selectsData.allGrades.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
        <Col xs={12}>
          <StyledFilterLabel>
            Subjects<StyledRequired>*</StyledRequired>
          </StyledFilterLabel>

          <SelectInputStyled
            height="36px"
            showArrow
            showSearch
            placeholder="Select Subject"
            optionFilterProp="children"
            mode="multiple"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleFieldDataChange(subjects, value)}
          >
            {selectsData.allSubjects.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xs={12}>
          <StyledFilterLabel>DOK</StyledFilterLabel>
          <SelectInputStyled
            height="36px"
            showArrow
            showSearch
            placeholder="Select Dok"
            optionFilterProp="children"
            mode="multiple"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleFieldDataChange(dok, value)}
          >
            {selectsData.allDepthOfKnowledge.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
        <Col xs={12}>
          <StyledFilterLabel>Difficulty</StyledFilterLabel>
          <SelectInputStyled
            showArrow
            showSearch
            placeholder="Select Difficulty"
            optionFilterProp="children"
            mode="multiple"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleFieldDataChange(difficulty, value)}
          >
            {selectsData.allAuthorDifficulty.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xs={24}>
          <StyledFilterLabel>Description</StyledFilterLabel>
          <TextAreaInputStyled
            placeholder="Enter Description"
            maxLength={256}
            onChange={(e) => handleFieldDataChange(description, e.target.value)}
            height="120px"
          />
        </Col>
      </Row>
      <FlexContainer mt="2rem" justifyContent="center">
        <EduButton btnType="primary" isGhost onClick={onCancel}>
          Cancel
        </EduButton>
        <EduButton onClick={handleAiFormSubmit}>Submit</EduButton>
      </FlexContainer>
    </Row>
  )
}
