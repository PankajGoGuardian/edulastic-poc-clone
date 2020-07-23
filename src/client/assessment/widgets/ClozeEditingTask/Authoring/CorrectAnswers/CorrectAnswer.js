import PropTypes from "prop-types";
import React, { Component } from "react";
import { EDIT } from "../../../../constants/constantsForQuestions";
import Display from "../../Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    hasGroupResponses: PropTypes.bool.isRequired,
    uiStyle: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
  };

  handleMultiSelect = answers => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(answers);
  };

  render() {
    const { options, stimulus, response, hasGroupResponses, item, uiStyle } = this.props;
    return (
      <Display
        preview
        setAnswers
        dragHandler
        options={options}
        uiStyle={uiStyle}
        stimulus={stimulus}
        item={item}
        userSelections={response.value}
        onChange={this.handleMultiSelect}
        hasGroupResponses={hasGroupResponses}
        view={EDIT}
      />
    );
  }
}

export default CorrectAnswer;
