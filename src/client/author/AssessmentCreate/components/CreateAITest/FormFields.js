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
import { segmentApi } from '@edulastic/api'
import { selectsData } from '../../../TestPage/components/common'
import { StyledFilterLabel, StyledRequired } from './styled'
import { formFields } from './ducks/constants'

import StandardSet from '../../../AssessmentPage/components/QuestionEditModal/common/StandardSet/StandardSet'
import { standardsFields } from '../../../AssessmentPage/VideoQuiz/constants'

const {
  TEST_NAME,
  ITEM_TYPE,
  NUMBER_OF_ITEMS,
  DIFFICULTY,
  DOK,
  PREFERENCE,
} = formFields

const FormFields = ({
  handleFieldDataChange,
  handleAiFormSubmit,
  onCancel,
  addItems,
  aiFormContent,
  updateAlignment,
}) => {
  const {
    testName,
    itemType,
    numberOfItems,
    dok,
    difficulty,
    preference,
    alignment,
  } = aiFormContent

  const handleGenerate = (...args) => {
    handleAiFormSubmit(...args)
    segmentApi.genericEventTrack('GenerateAIItem', {
      source: addItems ? 'AI Quiz: AddItem' : 'AI Quiz: CreateQuiz',
    })
  }

  return (
    <Row>
      <Row gutter={30}>
        <EduIf condition={!addItems}>
          <Col xs={24}>
            <StyledFilterLabel>
              Test Name<StyledRequired>*</StyledRequired>
            </StyledFilterLabel>
            <TextInputStyled
              data-cy="aiTestName"
              placeholder="Enter Test Name"
              maxLength={256}
              value={testName}
              onChange={(e) => handleFieldDataChange(TEST_NAME, e.target.value)}
            />
          </Col>
        </EduIf>
      </Row>
      <Row gutter={30}>
        <Col xs={12}>
          <StyledFilterLabel>
            Item Type<StyledRequired>*</StyledRequired>
          </StyledFilterLabel>
          <SelectInputStyled
            showArrow
            showSearch
            data-cy="aiItemType"
            placeholder="Select Item Type"
            optionFilterProp="children"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            height="36px"
            onChange={(value) => handleFieldDataChange(ITEM_TYPE, value)}
            value={itemType}
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
            onChange={(value) => handleFieldDataChange(NUMBER_OF_ITEMS, value)}
            min={1}
            max={20}
            step={1}
            height="36px"
            value={numberOfItems}
            data-cy="numberOfItem"
          />
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xs={24}>
          <StyledFilterLabel>
            Standards <StyledRequired>*</StyledRequired>
          </StyledFilterLabel>
          <StandardSet
            alignment={alignment}
            onUpdate={(data) => updateAlignment(data.alignment)}
            showIconBrowserBtn
            hideLabel
            standardsRequiredFields={[
              standardsFields.SUBJECT,
              standardsFields.GRADES,
            ]}
            isDocBased
          />
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xs={12}>
          <StyledFilterLabel>DOK</StyledFilterLabel>
          <SelectInputStyled
            height="36px"
            showArrow
            showSearch
            data-cy="aiDok"
            placeholder="Select Dok"
            optionFilterProp="children"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleFieldDataChange(DOK, value)}
            value={dok}
          >
            {selectsData.allDepthOfKnowledgeAI
              .filter(({ value }) => value)
              .map(({ value, text }) => (
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
            data-cy="aiDifficulty"
            placeholder="Select Difficulty"
            optionFilterProp="children"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleFieldDataChange(DIFFICULTY, value)}
            value={difficulty}
          >
            {selectsData.allAuthorDifficulty
              .filter(({ value }) => value)
              .map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
          </SelectInputStyled>
        </Col>
      </Row>
      <Row gutter={30}>
        <Col xs={24}>
          <StyledFilterLabel>I Want To</StyledFilterLabel>
          <TextAreaInputStyled
            data-cy="aiDescription"
            placeholder="Eg: Generate items focused on rational numbers where students need to use rational root test and also generate hints."
            maxLength={256}
            onChange={(e) => handleFieldDataChange(PREFERENCE, e.target.value)}
            height="120px"
            value={preference}
          />
        </Col>
      </Row>

      <FlexContainer mt="2rem" justifyContent="center">
        <EduButton
          btnType="primary"
          data-cy="aiCancelButton"
          isGhost
          onClick={onCancel}
        >
          Cancel
        </EduButton>
        <EduButton data-cy="aiGenerateButton" onClick={handleGenerate}>
          Generate
        </EduButton>
      </FlexContainer>
    </Row>
  )
}

export default FormFields
