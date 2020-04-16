import React from "react";
import PropTypes from "prop-types";
import { find, get, maxBy } from "lodash";
import { measureText } from "@edulastic/common";

import Toggle from "./Toggle";
import TextDropdown from "./TextDropdown";
import TextEntry from "./TextEntry";
import DragDrop from "./DragDrop";
import { displayStyles } from "../../constants";

const getChoiceBoxComponents = type => {
  switch (type) {
    case displayStyles.DROP_DOWN:
      return TextDropdown;
    case displayStyles.TEXT_INPUT:
      return TextEntry;
    case displayStyles.DRAG_DROP:
      return DragDrop;
    default:
      return Toggle;
  }
};

const ChoicesBox = ({ resprops, id }) => {
  const {
    btnStyle,
    uiStyle,
    options,
    onChange: changeAnswers,
    item,
    disableResponse,
    isReviewTab,
    userSelections
  } = resprops;

  if (!id) return null;
  // get user's answer
  const cAnswers = get(item, "validation.validResponse.value", []);
  let userAnswer = find(userSelections, answer => (answer ? answer.id : "") === id);
  if (isReviewTab) {
    userAnswer = find(cAnswers, answer => (answer ? answer.id : "") === id);
  }

  const { responseIds, displayStyle } = item;
  const { placeholder, responsecontainerindividuals } = uiStyle;
  const { index } = find(responseIds, response => response.id === id);
  const { heightpx, widthpx, placeholder: iPlaceholder } = responsecontainerindividuals[index] || {};

  const optionsById = get(options, `[${id}]`, []);
  const maxW = maxBy(optionsById.map(op => measureText(op)), d => d.width) || {};

  const styles = {
    ...btnStyle,
    overflow: "hidden",
    width: widthpx,
    height: heightpx,
    minWidthpx: maxW.width + 25
  };

  const selectChange = val => {
    if (changeAnswers) {
      changeAnswers(val, index, id);
    }
  };

  // response box display style
  const BoxComponent = getChoiceBoxComponents(displayStyle?.type);
  return (
    <BoxComponent
      id={id}
      styles={styles}
      options={optionsById}
      placeholder={iPlaceholder || placeholder}
      userAnswer={userAnswer}
      disableResponse={disableResponse}
      onChange={selectChange}
      displayStyleOption={displayStyle?.option}
    />
  );
};

ChoicesBox.propTypes = {
  resprops: PropTypes.object,
  id: PropTypes.string.isRequired
};

ChoicesBox.defaultProps = {
  resprops: {}
};

export default ChoicesBox;
