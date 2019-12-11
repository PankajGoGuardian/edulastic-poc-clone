import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input } from "antd";
import { getCurrentRubricDataSelector, updateRubricDataAction } from "../../ducks";
import produce from "immer";
import styled from "styled-components";
import { white, backgroundGrey } from "@edulastic/colors";

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

  const handleChange = e => {
    let nextState = null;
    if (componentFor === "Criteria") {
      nextState = produce(currentRubricData, draftState => {
        draftState.criteria.find(c => c.id === id)[fieldMapping[textType]] = e.target.value;
      });
    } else if (componentFor === "Rating") {
      nextState = produce(currentRubricData, draftState => {
        draftState.criteria.find(c => c.id === parentId).ratings.find(r => r.id === id)[fieldMapping[textType]] =
          e.target.value;
      });
    }
    updateRubricData(nextState);
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

  if (textType === "textarea") {
    return (
      <TextArea
        onChange={handleChange}
        disabled={!isEditable}
        value={value}
        placeholder={isEditable ? "Enter Description" : ""}
      />
    );
  } else
    return (
      <StyledInput
        placeholder={placeholder}
        type={textType}
        disabled={!isEditable || false}
        value={value}
        onChange={handleChange}
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

const TextArea = styled(Input.TextArea)`
  height: 92px !important;
  background: ${backgroundGrey};
  border-radius: 2px;
  border: none;
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
