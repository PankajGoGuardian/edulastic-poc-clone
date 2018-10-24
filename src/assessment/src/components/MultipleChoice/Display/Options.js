import React from 'react';
import PropTypes from 'prop-types';

import Option from './Option';

const Options = (props) => {
  const {
    options,
    checkAnswer,
    showAnswer,
    userSelections,
    smallSize,
    onChange,
    validation,
    uiStyle,
  } = props;

  return (
    <div>
      {options.map((option, index) => (
        <Option
          key={index}
          smallSize={smallSize}
          checkAnswer={checkAnswer}
          showAnswer={showAnswer}
          index={index}
          item={option}
          userSelections={userSelections}
          validation={validation}
          onChange={() => onChange(option.value)}
          uiStyle={uiStyle}
        />
      ))}
    </div>
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
};

Options.defaultProps = {
  showAnswer: false,
  checkAnswer: false,
  userSelections: [],
  validation: {},
  options: [],
  smallSize: false,
};

export default Options;
