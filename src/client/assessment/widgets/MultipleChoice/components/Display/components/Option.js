import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty, flatten } from "lodash";
import produce from "immer";
import { PaddingDiv, FlexContainer, MathFormulaDisplay } from "@edulastic/common";

import { ALPHABET } from "../../../constants/alphabet";
import { CheckboxContainer } from "../styled/CheckboxContainer";
import { MultiChoiceContent, MultipleChoiceLabelContainer } from "../styled/MultiChoiceContent";
import { Label, OptionsLabel } from "../styled/Label";
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
    onRemove,
    smallSize,
    uiStyle,
    correct = [],
    checkAnswer,
    validation,
    styleType,
    multipleResponses,
    isReviewTab,
    testItem,
    maxWidth,
    setCrossAction,
    qId,
    crossAction,
    fontSize
  } = props;
  let className = "";
  let correctAnswers = [];
  if (!isEmpty(validation)) {
    const altResponses = validation.altResponses?.length > 0 ? validation.altResponses?.map(ar => ar.value) : [];
    correctAnswers = flatten([validation.validResponse?.value, ...altResponses]);
  }

  const [hovered, toggleHover] = useState(false);

  const isSelected = isReviewTab
    ? false
    : testItem
    ? correctAnswers.includes(item.value)
    : userSelections.includes(item.value);

  const isCorrect =
    isReviewTab || testItem ? correct[correctAnswers.indexOf(item.value)] : correct[userSelections.indexOf(item.value)];

  const isCrossAction = crossAction && crossAction[qId] && crossAction[qId].indexOf(item.value) !== -1;

  const showIcon = (isSelected && checkAnswer) || showAnswer;

  if (showAnswer) {
    let validAnswers = [];
    if (!isEmpty(validation)) {
      validAnswers = flatten([validation.validResponse, ...validation.altResponses].map(_item => _item.value));
    }

    if (validAnswers.includes(item.value)) {
      className = "right";
    }
    if (isSelected) {
      if (!validAnswers.includes(item.value)) {
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

  useEffect(() => {
    toggleHover(isCrossAction);
  }, [isCrossAction]);

  const onChangeHandler = () => {
    if (setCrossAction) {
      setCrossAction(
        produce(crossAction, draft => {
          if (!draft[qId]) {
            draft[qId] = [];
          }
          const i = draft[qId].indexOf(item.value);
          if (i !== -1) {
            draft[qId].splice(i, 1);
          } else {
            draft[qId].push(item.value);
          }
        })
      );
      if (!isCrossAction && isSelected) {
        onRemove();
      }
    } else if (!isCrossAction) {
      onChange();
    }
  };

  const getLabel = inx => {
    if (uiStyle.type === "block") {
      switch (uiStyle.choiceLabel) {
        case "number":
          return inx + 1;
        case "upper-alpha":
          return ALPHABET[inx].toUpperCase();
        case "lower-alpha":
          return ALPHABET[inx].toLowerCase();
        default:
          return null;
      }
    } else if (uiStyle.type === "standard") {
      switch (uiStyle.stemNumeration) {
        case "number":
          return `(${inx + 1})`;
        case "upper-alpha":
          return `(${ALPHABET[inx].toUpperCase()})`;
        case "lower-alpha":
          return `(${ALPHABET[inx].toLowerCase()})`;
        default:
          return null;
      }
    } else {
      return ALPHABET[inx].toUpperCase();
    }
  };

  const container = (
    <>
      {uiStyle.type === "block" && uiStyle.choiceLabel && <OptionsLabel>{getLabel(index)}</OptionsLabel>}
      <CheckboxContainer
        smallSize={smallSize}
        uiStyle={uiStyle}
        styleType={styleType}
        multipleResponses={multipleResponses}
      >
        <input type="checkbox" name="mcq_group" value={item.value} checked={isSelected} onChange={onChangeHandler} />
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
    </>
  );

  const renderCheckbox = () => {
    switch (uiStyle.type) {
      case "radioBelow":
        return (
          <FlexContainer flexDirection="column" justifyContent="center">
            <MultiChoiceContent
              fontSize={fontSize}
              smallSize={smallSize}
              style={{ marginBottom: 17 }}
              isCrossAction={isCrossAction || hovered}
            >
              <MathFormulaDisplay fontSize={fontSize} dangerouslySetInnerHTML={{ __html: item.label }} />
            </MultiChoiceContent>
            {container}
          </FlexContainer>
        );
      case "block":
        return (
          <FlexContainer alignItems="center">
            <MultipleChoiceLabelContainer>{container}</MultipleChoiceLabelContainer>
            <MultiChoiceContent fontSize={fontSize} smallSize={smallSize} isCrossAction={isCrossAction || hovered}>
              <MathFormulaDisplay fontSize={fontSize} dangerouslySetInnerHTML={{ __html: item.label }} />
            </MultiChoiceContent>
          </FlexContainer>
        );
      case "standard":
      default:
        return (
          <React.Fragment>
            {container}
            <MultiChoiceContent fontSize={fontSize} smallSize={smallSize} isCrossAction={isCrossAction || hovered}>
              <MathFormulaDisplay fontSize={fontSize} dangerouslySetInnerHTML={{ __html: item.label }} />
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
      maxWidth={maxWidth}
      smallSize={smallSize}
      className={className}
      showAnswer={showAnswer}
      uiStyle={uiStyle}
      showIcon={showIcon}
      styleType={styleType}
      selected={isSelected}
      checkAnswer={checkAnswer}
      userSelect={!!setCrossAction}
      onMouseEnter={() => {
        if (setCrossAction) {
          toggleHover(true);
        }
      }}
      onMouseLeave={() => {
        if (setCrossAction) {
          toggleHover(false);
        }
      }}
    >
      <PaddingDiv top={5} bottom={5} margin={uiStyle.type === "radioBelow" ? "auto" : null}>
        <FlexContainer justifyContent={uiStyle.type === "radioBelow" ? "center" : "space-between"}>
          {renderCheckbox()}
          <IconWrapper>
            {showIcon && className === "right" && <IconCheck />}
            {showIcon && className === "wrong" && <IconClose />}
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
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool.isRequired,
  validation: PropTypes.any.isRequired,
  uiStyle: PropTypes.object.isRequired,
  maxWidth: PropTypes.string.isRequired,
  correct: PropTypes.any.isRequired,
  qId: PropTypes.string.isRequired,
  styleType: PropTypes.string,
  testItem: PropTypes.bool,
  crossAction: PropTypes.object,
  multipleResponses: PropTypes.bool,
  isReviewTab: PropTypes.bool.isRequired,
  setCrossAction: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
};

Option.defaultProps = {
  showAnswer: false,
  multipleResponses: false,
  testItem: false,
  smallSize: false,
  userSelections: [],
  styleType: "default",
  setCrossAction: false,
  crossAction: {}
};

export default React.memo(Option);
