import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ItemLevelContext from "../../../author/QuestionEditor/components/Container/QuestionContext";
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
    hasGroupResponses: PropTypes.bool.isRequired,
    view: PropTypes.string.isRequired,
    previewTab: PropTypes.bool.isRequired,
    configureOptions: PropTypes.object.isRequired,
    responseIds: PropTypes.object.isRequired,
    uiStyle: PropTypes.object.isRequired,
    max: PropTypes.number.isRequired,
    isV1Migrated: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired
  };

  static contextType = ItemLevelContext;

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
    const { onUpdatePoints, max } = this.props;
    if (!(e.target.value > 0)) {
      return;
    }
    this.setState({ responseScore: e.target.value > max ? max : e.target.value });
    onUpdatePoints(parseFloat(e.target.value, 10));
  };

  handleMultiSelect = (answers, id, widthpx) => {
    const { onUpdateValidationValue } = this.props;
    onUpdateValidationValue(answers, id, widthpx);
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
      responseIds,
      view,
      isV1Migrated,
      previewTab,
      max,
      item
    } = this.props;
    const { responseScore } = this.state;
    return (
      <div>
        {this.context || (
          <CorrectAnswerHeader mb="15px">
            <Label>{t("component.correctanswers.points")}</Label>
            <PointsInput
              type="number"
              value={responseScore}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              max={max}
              step={0.5}
            />
          </CorrectAnswerHeader>
        )}
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
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
