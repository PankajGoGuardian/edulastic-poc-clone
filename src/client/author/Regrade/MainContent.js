import React from "react";
import { Radio, Row } from "antd";
import { Container, InputsWrapper, OptionTitle } from "./styled";
import AssignmentsTable from "./Table";

const Group = Radio.Group;
const ACTIONS = {
  SKIP: "SKIP",
  SCORE: "SCORE",
  MANUAL: "MANUAL",
  DISCARD: "DISCARD"
};

const MainContent = ({ regradeSettings, onUpdateSettings }) => {
  const { editedQuestion, addedQuestion, testSettings } = regradeSettings.options;
  return (
    <Container>
      <h2>Following assignments will be updated and re-scored if applicable.</h2>
      <AssignmentsTable />
      <InputsWrapper>
        <Row>
          <OptionTitle>Added Items</OptionTitle>
        </Row>
        <Group
          style={{ marginLeft: "20px" }}
          defaultValue={addedQuestion}
          onChange={e => onUpdateSettings("addedQuestion", e.target.value)}
        >
          <Row key={"addedQuestion"}>
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
      <InputsWrapper>
        <Row>
          <OptionTitle>Edit Items</OptionTitle>
        </Row>
        <Group
          style={{ marginLeft: "20px" }}
          defaultValue={editedQuestion}
          onChange={e => onUpdateSettings("editedQuestion", e.target.value)}
        >
          <Row key={"editedQuestion"}>
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
      <InputsWrapper>
        <Row>
          <OptionTitle>Add, Apply updated settings options </OptionTitle>
        </Row>
        <Row>
          <Group
            style={{ marginLeft: "20px" }}
            defaultValue={testSettings}
            onChange={e => onUpdateSettings("testSettings", e.target.value)}
          >
            <Row>
              <Radio value={"ALL"}>Choose all assignments</Radio>
              <Radio value={"EXCLUDE"}>Exclude assignments where overridden</Radio>
            </Row>
          </Group>
        </Row>
      </InputsWrapper>
      <InputsWrapper>
        <Row>
          <OptionTitle>Removed items will be discard from assignment</OptionTitle>
        </Row>
      </InputsWrapper>
    </Container>
  );
};

export default MainContent;
