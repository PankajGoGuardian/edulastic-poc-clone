import React from "react";
import { connect } from "react-redux";
import { Input } from "antd";
import { getCurrentRubricDataSelector, updateRubricDataAction } from "../../ducks";
import produce from "immer";
import styled from "styled-components";
import { white, backgroundGrey } from "@edulastic/colors";
import DescriptionTextArea from "../../../../assessment/components/QuestionTextArea";

const TextInput = ({
  id,
  parentId,
  isEditable,
  textType,
  componentFor,
  value,
  currentRubricData,
  updateRubricData
}) => {
  const fieldMapping = {
    textarea: "desc",
    text: "name",
    number: "points"
  };

  const handleChange = value => {
    let nextState = null;
    if (componentFor === "Criteria") {
      nextState = produce(currentRubricData, draftState => {
        draftState.criteria.find(c => c.id === id)[fieldMapping[textType]] = value;
      });
      updateRubricData(nextState);
    } else if (componentFor === "Rating") {
      if (
        (textType === "number" && !isNaN(parseFloat(value)) && value >= 0) ||
        ["text", "textarea"].includes(textType)
      ) {
        nextState = produce(currentRubricData, draftState => {
          draftState.criteria.find(c => c.id === parentId).ratings.find(r => r.id === id)[
            fieldMapping[textType]
          ] = value;
        });
        updateRubricData(nextState);
      }
    }
  };

  let placeholder = "";
  if (isEditable) {
    if (componentFor === "Criteria") {
      placeholder = "Enter a criteria name";
    } else {
      if (textType === "number") placeholder = "Points";
      else placeholder = "Label";
    }
  }

  let extraProps = {};
  if (textType === "number")
    extraProps = {
      min: "0"
    };

  if (textType === "textarea") {
    if (isEditable)
      return (
        <DescriptionTextArea
          value={value}
          placeholder={isEditable ? "Enter Description" : ""}
          toolbarId={`rubric-rating-description-${id}`}
          onChange={value => handleChange(value)}
          readOnly={false}
          toolbarSize="SM"
          buttons={["bold", "italic", "underline", "formatUL"]}
        />
      );
    else if (!isEditable) return <TextArea dangerouslySetInnerHTML={{ __html: value }} />;
  } else
    return (
      <StyledInput
        placeholder={placeholder}
        type={textType}
        {...extraProps}
        disabled={!isEditable || false}
        value={value}
        onChange={e => handleChange(e.target.value)}
      />
    );
};

export default connect(
  state => ({
    currentRubricData: getCurrentRubricDataSelector(state)
  }),
  { updateRubricData: updateRubricDataAction }
)(TextInput);

const StyledInput = styled(Input)`
  border: none;
  border-radius: 2px;
  background: ${backgroundGrey};
  height: 35px;
  text-overflow: ellipsis;
  font-weight: ${props => props.theme.bold};
  cursor: default;
  &:focus,
  &:active {
    cursor: text;
  }
  &:disabled {
    cursor: default;
    color: inherit;
    background: ${backgroundGrey};
    &:hover,
    &:focus {
      box-shadow: none;
    }
  }
`;

const TextArea = styled.div`
  height: 92px !important;
  background: ${backgroundGrey};
  border-radius: 2px;
  border: none;
  cursor: default;
  overflow-y: auto;
  white-space: normal;
  padding: 7px;
`;
