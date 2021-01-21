import React from 'react'
import { Radio, Row, Spin } from 'antd'
import { Container, InputsWrapper, OptionTitle } from './styled'
import AssignmentsTable from './Table'

const Group = Radio.Group
const ACTIONS = {
  SKIP: 'SKIP',
  SCORE: 'SCORE',
  MANUAL: 'MANUAL',
  DISCARD: 'DISCARD',
}

const MainContent = ({
  regradeSettings,
  onUpdateSettings,
  isLoadRegradeSettings,
  availableRegradeSettings,
}) => {
  const {
    editedQuestion,
    addedQuestion,
    testSettings,
  } = regradeSettings.options
  if (isLoadRegradeSettings) {
    return <Spin />
  }
  const showAdd = availableRegradeSettings.includes('ADD')
  const showEdit = availableRegradeSettings.includes('EDIT')
  const showRemove = availableRegradeSettings.includes('REMOVE')
  const showSettings = availableRegradeSettings.includes('SETTINGS')
  return (
    <Container>
      <h2>
        Following assignments will be updated and re-scored if applicable.
      </h2>
      <AssignmentsTable />
      {showAdd && (
        <InputsWrapper>
          <Row>
            <OptionTitle>Added Items</OptionTitle>
          </Row>
          <Group
            style={{ marginLeft: '20px' }}
            defaultValue={addedQuestion}
            onChange={(e) => onUpdateSettings('addedQuestion', e.target.value)}
          >
            <Row key="addedQuestion">
              <Radio data-cy="no-points" value={ACTIONS.SKIP}>
                Give ZERO Points
              </Radio>
              <Radio data-cy="full-points" value={ACTIONS.SCORE}>
                Give FULL Points
              </Radio>
              <Radio data-cy="manual-points" value={ACTIONS.MANUAL}>
                Manually Grade
              </Radio>
            </Row>
          </Group>
        </InputsWrapper>
      )}

      {showEdit && (
        <InputsWrapper>
          <Row>
            <OptionTitle>Edit Items</OptionTitle>
          </Row>
          <Group
            style={{ marginLeft: '20px' }}
            defaultValue={editedQuestion}
            onChange={(e) => onUpdateSettings('editedQuestion', e.target.value)}
          >
            <Row key="editedQuestion">
              <Radio data-cy="skip-grading" value={ACTIONS.SKIP}>
                Skip rescoring
              </Radio>
              <Radio data-cy="restore-grading" value={ACTIONS.SCORE}>
                Rescore automatically
              </Radio>
              <Radio data-cy="manual-grading" value={ACTIONS.MANUAL}>
                Mark for manual grading
              </Radio>
            </Row>
          </Group>
        </InputsWrapper>
      )}
      {showSettings && (
        <InputsWrapper>
          <Row>
            <OptionTitle>Add, Apply updated settings options </OptionTitle>
          </Row>
          <Row>
            <Group
              style={{ marginLeft: '20px' }}
              defaultValue={testSettings}
              onChange={(e) => onUpdateSettings('testSettings', e.target.value)}
            >
              <Row>
                <Radio data-cy="choose-all" value="ALL">
                  Choose all assignments
                </Radio>
                <Radio data-cy="exclude-overidden" value="EXCLUDE">
                  Exclude assignments where overridden
                </Radio>
              </Row>
            </Group>
          </Row>
        </InputsWrapper>
      )}
      {showRemove && (
        <InputsWrapper>
          <Row>
            <OptionTitle>
              Removed items will be discard from assignment
            </OptionTitle>
          </Row>
        </InputsWrapper>
      )}
    </Container>
  )
}

export default MainContent
