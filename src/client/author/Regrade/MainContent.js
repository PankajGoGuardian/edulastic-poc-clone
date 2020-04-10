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

const MainContent = ({
  assignments,
  RegradeTypes,
  RegradeKeys,
  handleSettingsChange,
  regradeSettings,
  onUpdateSettings,
  assigmentOptions,
  setAssignmentOptions,
  regradeSettingsChange
}) => {
  const onAssignmentSettingsChange = () => {
    const value = event.target.value;
    const newSettings = {
      ...regradeSettings,
      applyChangesChoice: value,
      assignmentList: value !== "SPECIFIC" ? [] : regradeSettings.assignmentList
    };
    regradeSettingsChange(newSettings);
    setAssignmentOptions(value);
  };
  const { editedQuestion, removedQuestion, addedQuestion } = regradeSettings.options;
  return (
    <Container>
      <h2>
        The test has been edited and since there are assignments that have been completed, would you like to apply the
        changes to:
      </h2>
      <Group defaultValue={RegradeKeys[0]} onChange={onAssignmentSettingsChange}>
        {RegradeKeys.map(item => (
          <Row key={item}>
            <Radio value={item}>{RegradeTypes[item]}</Radio>
          </Row>
        ))}
      </Group>
      <AssignmentsTable
        assignments={assignments}
        handleSettingsChange={handleSettingsChange}
        regradeType={assigmentOptions}
        regradeSettings={regradeSettings}
      />
      <InputsWrapper>
        <Row>
          <OptionTitle>Added Items</OptionTitle>
        </Row>
        <Group defaultValue={addedQuestion} onChange={e => onUpdateSettings("addedQuestion", e.target.value)}>
          <Row key={"addedQuestion"}>
            <Radio value={ACTIONS.SKIP}>Give 0 points</Radio>
            <Radio value={ACTIONS.SCORE}>Give full points</Radio>
            <Radio value={ACTIONS.MANUAL}>Manually grade</Radio>
          </Row>
        </Group>
      </InputsWrapper>
      <InputsWrapper>
        <Row>
          <OptionTitle>Edit Items</OptionTitle>
        </Row>
        <Group defaultValue={editedQuestion} onChange={e => onUpdateSettings("editedQuestion", e.target.value)}>
          <Row key={"editedQuestion"}>
            <Radio value={ACTIONS.SKIP}>Skip grading</Radio>
            <Radio value={ACTIONS.SCORE}>Rescore automatially</Radio>
            <Radio value={ACTIONS.MANUAL}>Mark for Manual grading</Radio>
          </Row>
        </Group>
      </InputsWrapper>
      <InputsWrapper>
        <Row>
          <OptionTitle>Remove Items</OptionTitle>
        </Row>
        <Group defaultValue={removedQuestion} onChange={e => onUpdateSettings("removedQuestion", e.target.value)}>
          <Row key={"removedQuestion"}>
            <Radio value={ACTIONS.DISCARD}>Discard from asssignment</Radio>
          </Row>
        </Group>
      </InputsWrapper>
      {removedQuestion == ACTIONS.DISCARD && <p style={{ textAlign: "center" }}>REMOVED QUESTIONS WILL BE DISCARDED</p>}
    </Container>
  );
};

export default MainContent;
