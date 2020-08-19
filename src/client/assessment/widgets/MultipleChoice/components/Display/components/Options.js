import React from "react";
import PropTypes from "prop-types";

import { FlexContainer } from "@edulastic/common";
import { OptionsList } from "../styled/OptionsList";
import Option from "./Option";

const Options = ({
  options,
  evaluation,
  uiStyle,
  onChange,
  onRemove,
  validation,
  styleType,
  multipleResponses,
  fontSize,
  item,
  fromSetAnswers,
  ...restProps
}) => {
  const noOfColumns = uiStyle.columns || 1;
  const noOfRows = Math.ceil(options.length / noOfColumns);
  const updateArrangement = arr => {
    const res = [];
    let colPtr = 1;
    let rowPtr = 0;
    let index = 0;
    const delta = noOfRows * noOfColumns - arr.length;
    let count = 0;
    while (count < arr.length) {
      res.push(arr[index]);
      // eslint-disable-next-line no-unused-expressions
      colPtr > noOfColumns - delta && noOfColumns - delta !== 0 ? (index += noOfRows - 1) : (index += noOfRows);
      ++colPtr;
      if (index >= arr.length) {
        index = ++rowPtr;
        colPtr = 1;
      }
      count++;
    }
    return res;
  };
  const mcqOptions = uiStyle.orientation !== "vertical" ? options : updateArrangement(options);

  let _startIndex = 0;
  const optionsIndexMap = {};
  if (uiStyle.orientation === "vertical") {
    options.forEach((data, i) => {
      optionsIndexMap[data.value] = i;
    });
  }

  const getOption = (startIndex, lastIndex) => (
    <FlexContainer
      justifyContent="left"
      className="__prevent-page-break __print-space-reduce-options"
      width={fromSetAnswers && "100%"}
    >
      {mcqOptions.slice(startIndex, lastIndex).map((option, index) => (
        <Option
          maxWidth={`${(1 / noOfColumns) * 100 - 1}%`}
          key={option.value}
          index={uiStyle.orientation !== "vertical" ? startIndex + index : optionsIndexMap[option.value]}
          uiStyle={uiStyle}
          item={option}
          validation={validation}
          onChange={() => onChange(option.value)}
          onRemove={() => onRemove(option.value)}
          correct={evaluation}
          styleType={styleType}
          multipleResponses={multipleResponses}
          fontSize={fontSize}
          fromSetAnswers={fromSetAnswers}
          {...restProps}
        />
      ))}
    </FlexContainer>
  );

  const renderOptionList = () => {
    const optionList = [];
    for (let row = 1; row <= noOfRows; row++) {
      const lastIndex = noOfColumns * row;
      optionList.push(getOption(_startIndex, lastIndex));
      _startIndex = lastIndex;
    }
    return optionList;
  };

  return (
    <OptionsList
      width={fromSetAnswers && "100%"}
      styleType={styleType}
      fontSize={fontSize}
      className="multiplechoice-optionlist"
    >
      {renderOptionList()}
    </OptionsList>
  );
};

Options.propTypes = {
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  validation: PropTypes.object,
  options: PropTypes.array,
  smallSize: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  evaluation: PropTypes.any.isRequired,
  styleType: PropTypes.string,
  multipleResponses: PropTypes.bool
};

Options.defaultProps = {
  showAnswer: false,
  checkAnswer: false,
  userSelections: [],
  validation: {},
  options: [],
  multipleResponses: false,
  smallSize: false,
  styleType: "default"
};

export default React.memo(Options);
