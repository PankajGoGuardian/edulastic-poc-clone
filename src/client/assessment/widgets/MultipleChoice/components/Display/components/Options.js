import React from "react";
import PropTypes from "prop-types";

import { OptionsList } from "../styled/OptionsList";
import Option from "./Option";
import { FlexContainer } from "@edulastic/common";

const Options = ({
  options,
  evaluation,
  uiStyle,
  onChange,
  validation,
  styleType,
  multipleResponses,
  ...restProps
}) => {
  const noOfColumns = uiStyle.columns || 1;
  const noOfRows = Math.ceil(options.length / noOfColumns);
  const updateArrangement = arr => {
    let res = [];
    let colPtr = 1;
    let rowPtr = 0;
    let index = 0;
    const delta = noOfRows * noOfColumns - arr.length;
    let count = 0;
    while (count < arr.length) {
      res.push(arr[index]);
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

  let startIndex = 0;
  const renderOptionList = () => {
    const optionList = [];
    for (let row = 1; row <= noOfRows; row++) {
      const lastIndex = noOfColumns * row;
      optionList.push(getOption(startIndex, lastIndex));
      startIndex = lastIndex;
    }
    return optionList;
  };

  const getOption = (startIndex, lastIndex) => (
    <FlexContainer
      justifyContent="left"
      style={{ marginBottom: styleType === "primary" || uiStyle.type === "block" ? "17px" : "0" }}
    >
      {mcqOptions.slice(startIndex, lastIndex).map((option, index) => (
        <Option
          maxWidth={`${(1 / noOfColumns) * 100 - 1}%`}
          key={option.value}
          index={startIndex + index}
          uiStyle={uiStyle}
          item={option}
          validation={validation}
          onChange={() => onChange(option.value)}
          correct={evaluation}
          styleType={styleType}
          multipleResponses={multipleResponses}
          {...restProps}
        />
      ))}
    </FlexContainer>
  );

  return <OptionsList styleType={styleType}>{renderOptionList()}</OptionsList>;
};

Options.propTypes = {
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  validation: PropTypes.object,
  options: PropTypes.array,
  smallSize: PropTypes.bool,
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
  smallSize: false,
  styleType: "default"
};

export default React.memo(Options);
