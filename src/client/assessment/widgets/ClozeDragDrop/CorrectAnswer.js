import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Display from "./Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    hasGroupResponses: PropTypes.bool.isRequired,
    configureOptions: PropTypes.object.isRequired,
    responseIDs: PropTypes.array.isRequired,
    uiStyle: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
  };

  handleMultiSelect = answers => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(answers);
  };

  render() {
    const {
      t,
      options,
      stimulus,
      response,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIDs,
      item
    } = this.props;

    return (
      <Display
        preview
        setAnswers
        dragHandler
        options={options}
        uiStyle={uiStyle}
        stimulus={stimulus}
        userSelections={response.value}
        configureOptions={configureOptions}
        onChange={this.handleMultiSelect}
        hasGroupResponses={hasGroupResponses}
        responseIDs={responseIDs}
        t={t}
        item={item}
      />
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
