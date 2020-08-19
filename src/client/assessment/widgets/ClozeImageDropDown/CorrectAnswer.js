import PropTypes from "prop-types";
import React, { Component } from "react";
import { ItemLevelContext } from "@edulastic/common";
import Display from "./Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    maxRespCount: PropTypes.number.isRequired,
    imagescale: PropTypes.bool,
    configureOptions: PropTypes.object.isRequired,
    uiStyle: PropTypes.object.isRequired,
    imageUrl: PropTypes.string.isRequired,
    responses: PropTypes.array.isRequired,
    showDashedBorder: PropTypes.bool.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    imageAlterText: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    imageHeight: PropTypes.number,
    imageOptions: PropTypes.object
  };

  static contextType = ItemLevelContext;

  static defaultProps = {
    imagescale: false,
    imageHeight: 0,
    imageOptions: {}
  };

  handleMultiSelect = answers => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(answers);
  };

  render() {
    const {
      options,
      stimulus,
      response,
      imageUrl,
      responses,
      configureOptions,
      imageAlterText,
      imageWidth,
      imagescale,
      uiStyle,
      showDashedBorder,
      backgroundColor,
      maxRespCount,
      imageHeight,
      imageOptions,
      item = {}
    } = this.props;
    return (
      <Display
        preview
        setAnswers
        dragHandler
        item={item}
        options={options}
        uiStyle={uiStyle}
        imagescale={imagescale}
        question={stimulus}
        showDashedBorder={showDashedBorder}
        responseContainers={responses}
        maxRespCount={maxRespCount}
        imageUrl={imageUrl}
        backgroundColor={backgroundColor}
        userSelections={response.value}
        imageAlterText={imageAlterText}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        configureOptions={configureOptions}
        onChange={this.handleMultiSelect}
        imageOptions={imageOptions}
      />
    );
  }
}

export default CorrectAnswer;
