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
      {showRemove && (
        <InputsWrapper data-cy="removed-items">
          <Row>
            <OptionTitle>
              Please Note: Removed items will be discarded from the assignment.
              Below, please determine how you want the revisions to be scored
              and applied.
            </OptionTitle>
          </Row>
        </InputsWrapper>
      )}
      {showAdd && (
        <InputsWrapper data-cy="added-items">
          <Row>
            <OptionTitle>Added Items</OptionTitle>
            <p>
              For any newly added items, please indicate the point value to be
              assigned. This will adjust previously submitted tests and tests
              submitted in the future. Removed items will be automatically
              discarded and the points adjusted accordingly.
            </p>{' '}
            <br />
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
        <InputsWrapper data-cy="edited-items">
          <Row>
            <OptionTitle>Edit Items</OptionTitle>
            <p>
              Based on the revised test, please choose whether you want to skip
              rescoring tests, rescore automatically the newly added or removed
              items, or if you choose to manually grade the tests.
            </p>
            <br />
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
        <InputsWrapper data-cy="revised-settings">
          <Row>
            <OptionTitle>Add, Apply updated settings options </OptionTitle>
            <p>
              Please choose whether you want to apply the revised settings to
              all students who received this test, or exclude assignments that
              were modified versions of the test. For example, if a subset of
              students were given modified assignment settings, should the
              changes be applied to these assignments also.
            </p>{' '}
            <br />
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
    </Container>
  )
}
export default MainContent
