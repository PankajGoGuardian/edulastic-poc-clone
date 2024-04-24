import React from 'react'
import styled from 'styled-components'
import { Radio, Row } from 'antd'

const Group = Radio.Group

const ACTIONS = {
  SKIP: 'SKIP',
  SCORE: 'SCORE',
  MANUAL: 'MANUAL',
  DISCARD: 'DISCARD',
}

const AddedItems = ({ onUpdateSettings, settings, showLabel }) => {
  return (
    <InputsWrapper data-cy="added-items">
      <Row>
        {showLabel && <OptionTitle>Added Items</OptionTitle>}
        <Question>
          You have added new items or changed the items to a different question
          type into the test, how do you want to handle students who have
          already submitted?
        </Question>
      </Row>
      <Group
        value={settings.addedQuestion}
        onChange={(e) => onUpdateSettings('addedQuestion', e.target.value)}
      >
        <Row key="addedQuestion">
          <StyledRadio data-cy="no-points" value={ACTIONS.SKIP}>
            GIVE ZERO POINTS
          </StyledRadio>
          <StyledRadio data-cy="full-points" value={ACTIONS.SCORE}>
            GIVE FULL POINTS
          </StyledRadio>
          <StyledRadio data-cy="manual-points" value={ACTIONS.MANUAL}>
            MANUALLY GRADE
          </StyledRadio>
        </Row>
      </Group>
    </InputsWrapper>
  )
}

const EditedItems = ({ onUpdateSettings, settings, showLabel }) => {
  return (
    <InputsWrapper data-cy="edited-items">
      <Row>
        {showLabel && <OptionTitle>Edited Items</OptionTitle>}
        <Question>
          The changes made require previously submitted responses to be
          regraded. How would you like to proceed?
        </Question>
      </Row>
      <Group
        defaultValue={settings.editedQuestion}
        onChange={(e) => onUpdateSettings('editedQuestion', e.target.value)}
      >
        <Row key="editedQuestion">
          <StyledRadio data-cy="skip-grading" value={ACTIONS.SKIP}>
            SKIP RESCORING
          </StyledRadio>
          <StyledRadio data-cy="restore-grading" value={ACTIONS.SCORE}>
            RESCORE AUTOMATICALLY
          </StyledRadio>
          <StyledRadio data-cy="manual-grading" value={ACTIONS.MANUAL}>
            MARK FOR MANUAL GRADING
          </StyledRadio>
        </Row>
      </Group>
    </InputsWrapper>
  )
}

export default {
  AddedItems,
  EditedItems,
}

const InputsWrapper = styled.div`
  margin-top: ${({ mt }) => mt || '20px'};
  .ant-radio-wrapper {
    display: block;
  }
`

const Question = styled.p`
  font-weight: 500 !important;
`

const OptionTitle = styled.h3`
  font-weight: bold;
  font-size: 16px;
  color: #434b5d;
`

const StyledRadio = styled(Radio)`
  margin-top: 20px;
  font-size: 11px;
  span {
    color: #434b5d;
    letter-spacing: 0.19px;
  }
`
