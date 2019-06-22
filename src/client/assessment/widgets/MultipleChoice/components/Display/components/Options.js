import React from "react";
import PropTypes from "prop-types";

import { OptionsList } from "../styled/OptionsList";
import Option from "./Option";

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
  return (
    <OptionsList styleType={styleType}>
      {options.map((option, index) => (
        <Option
          key={option.value}
          index={index}
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
