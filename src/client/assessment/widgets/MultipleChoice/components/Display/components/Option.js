import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty, flatten } from "lodash";

import { PaddingDiv, FlexContainer, MathFormulaDisplay } from "@edulastic/common";

import { ALPHABET } from "../../../constants/alphabet";
import { CheckboxContainer } from "../styled/CheckboxContainer";
import { MultiChoiceContent } from "../styled/MultiChoiceContent";
import { Label } from "../styled/Label";
import { IconWrapper } from "../styled/IconWrapper";
import { IconCheck } from "../styled/IconCheck";
import { IconClose } from "../styled/IconClose";
import { getFontSize } from "../../../../../utils/helpers";

const Option = props => {
  const {
    index,
    item,
    showAnswer,
    userSelections,
    onChange,
    smallSize,
    uiStyle,
    correct = [],
    checkAnswer,
    validation,
    styleType,
    multipleResponses
  } = props;
  let className = "";
  const isSelected = userSelections.includes(item.value);
  const isCorrect = correct[userSelections.indexOf(item.value)];
  const fontSize = getFontSize(uiStyle.fontsize);

  if (showAnswer) {
    let validAnswers = [];

    if (!isEmpty(validation)) {
      validAnswers = [validation.valid_response, ...validation.alt_responses];
    }

    if (flatten(validAnswers.map(v => v.value)).includes(item.value)) {
      className = "right";
    } else if (isSelected) {
      if (validAnswers.some(ans => ans.value.includes(item.value))) {
        className = "right";
      } else {
        className = "wrong";
      }
    }
  } else if (checkAnswer) {
    if (correct.length && checkAnswer) {
      if (isCorrect && isSelected) {
        className = "right";
      } else if (isCorrect === false && isSelected) {
        className = "wrong";
      }
    } else {
      className = "";
    }
  }

  const getLabel = inx => {
    if (uiStyle.type === "block") {
      switch (uiStyle.choice_label) {
        case "number":
          return inx + 1;
        case "upper-alpha":
          return ALPHABET[inx].toUpperCase();
        case "lower-alpha":
          return ALPHABET[inx].toLowerCase();
        default:
          return inx + 1;
      }
    } else {
      return ALPHABET[inx].toUpperCase();
    }
  };

  const container = (
    <CheckboxContainer
      smallSize={smallSize}
      uiStyle={uiStyle}
      styleType={styleType}
      multipleResponses={multipleResponses}
    >
      <input type="checkbox" name="mcq_group" value={item.value} checked={isSelected} onChange={onChange} />
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: multipleResponses ? "0" : "50%"
        }}
      >
        {getLabel(index)}
      </span>
      <div />
    </CheckboxContainer>
  );

  const renderCheckbox = () => {
    switch (uiStyle.type) {
      case "radioBelow":
        return (
          <FlexContainer flexDirection="column" justifyContent="center">
            <MultiChoiceContent fontSize={fontSize} smallSize={smallSize} style={{ marginBottom: 17 }}>
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: item.label }} />
            </MultiChoiceContent>
            {container}
          </FlexContainer>
        );
      case "block":
        return (
          <FlexContainer alignItems="center">
            {container}
            <MultiChoiceContent fontSize={fontSize} smallSize={smallSize}>
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: item.label }} />
            </MultiChoiceContent>
          </FlexContainer>
        );
      case "standard":
      default:
        return (
          <React.Fragment>
            {container}
            <MultiChoiceContent fontSize={fontSize} smallSize={smallSize}>
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: item.label }} />
            </MultiChoiceContent>
          </React.Fragment>
        );
    }
  };

  // const width = uiStyle.columns ? `${100 / uiStyle.columns - 1}%` : "100%";
  return (
    // <Label width={width} smallSize={smallSize} className={className} showAnswer>
    // TODO setup label background color for each option
    <Label
      smallSize={smallSize}
      className={className}
      showAnswer={showAnswer}
      uiStyle={uiStyle}
      styleType={styleType}
      selected={isSelected}
      checkAnswer={checkAnswer}
    >
      <PaddingDiv top={0} bottom={0}>
        <FlexContainer justifyContent={uiStyle.type === "radioBelow" ? "center" : "space-between"}>
          {renderCheckbox()}
          <IconWrapper>
            {((isSelected && checkAnswer) || showAnswer) && className === "right" && <IconCheck />}
            {((isSelected && checkAnswer) || showAnswer) && className === "wrong" && <IconClose />}
          </IconWrapper>
        </FlexContainer>
      </PaddingDiv>
    </Label>
  );
};

Option.propTypes = {
  index: PropTypes.number.isRequired,
  showAnswer: PropTypes.bool,
  item: PropTypes.any.isRequired,
  userSelections: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool.isRequired,
  validation: PropTypes.any.isRequired,
  uiStyle: PropTypes.object.isRequired,
  correct: PropTypes.any.isRequired,
  styleType: PropTypes.string,
  multipleResponses: PropTypes.bool
};

Option.defaultProps = {
  showAnswer: false,
  smallSize: false,
  userSelections: [],
  styleType: "default"
};

export default React.memo(Option);
