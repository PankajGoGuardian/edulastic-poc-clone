import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { getFormattedAttrId, ItemLevelContext } from "@edulastic/common";
import { getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";
import { CorrectAnswerHeader, PointsInput } from "../../styled/CorrectAnswerHeader";
import { Label } from "../../styled/WidgetOptions/Label";
import Display from "./Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdatePoints: PropTypes.func.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
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

  constructor(props) {
    super(props);
    const userSelections = Array(props.options.length).fill(false);
    props.response.value.forEach(answer => {
      userSelections[answer] = true;
    });
    this.state = {
      responseScore: props.response.score
    };
  }

  updateScore = e => {
    const { onUpdatePoints } = this.props;
    if (!(e.target.value > 0)) {
      return;
    }
    this.setState({ responseScore: e.target.value });
    onUpdatePoints(parseFloat(e.target.value, 10));
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
      item
    } = this.props;
    const { responseScore } = this.state;
    return (
      <div>
        {this.context || (
          <CorrectAnswerHeader>
            <Label>{t("component.correctanswers.points")}</Label>
            <PointsInput
              id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.points")}`)}
              type="number"
              value={responseScore}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              step={0.5}
              data-cy="point-field"
            />
          </CorrectAnswerHeader>
        )}
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
      </div>
    );
  }
}

const enhance = compose(
  withNamespaces("assessment"),
  connect(state => ({
    item: getQuestionDataSelector(state)
  }))
);

export default enhance(CorrectAnswer);
