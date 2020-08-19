import PropTypes from "prop-types";
import React, { Component } from "react";
import Display from "./Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    hasGroupResponses: PropTypes.bool.isRequired,
    view: PropTypes.string.isRequired,
    previewTab: PropTypes.bool.isRequired,
    configureOptions: PropTypes.object.isRequired,
    responseIds: PropTypes.object.isRequired,
    uiStyle: PropTypes.object.isRequired,
    isV1Migrated: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired
  };

  handleMultiSelect = (answers, id, widthpx) => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(answers, id, widthpx);
  };

  render() {
    const {
      options,
      stimulus,
      response,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIds,
      view,
      isV1Migrated,
      previewTab,
      item
    } = this.props;

    return (
      <Display
        preview={false}
        isV1Migrated={isV1Migrated}
        setAnswers
        dragHandler
        options={options}
        uiStyle={uiStyle}
        stimulus={stimulus}
        userSelections={response.value}
        configureOptions={configureOptions}
        onChange={this.handleMultiSelect}
        hasGroupResponses={hasGroupResponses}
        responseIds={responseIds}
        showIndex
        view={view}
        previewTab={previewTab}
        item={item}
      />
    );
  }
}

export default CorrectAnswer;
