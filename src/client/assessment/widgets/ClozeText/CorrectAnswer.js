import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import { CorrectAnswerHeader } from "../../styled/CorrectAnswerHeader";
import { CorrectAnswerPointField } from "../../styled/CorrectAnswerPointField";
import Display from "./Display";
import ItemLevelContext from "../../../author/QuestionEditor/components/Container/QuestionContext";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdatePoints: PropTypes.func.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    hasGroupResponses: PropTypes.bool.isRequired,
    template: PropTypes.string.isRequired,
    configureOptions: PropTypes.object.isRequired,
    responseIds: PropTypes.object.isRequired,
    uiStyle: PropTypes.object.isRequired
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
    const { onUpdatePoints } = this.props;
    if (e.target.value < 0) e.target.value = 0;
    this.setState({ responseScore: e.target.value });
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
      template,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIds,
      view,
      previewTab
    } = this.props;
    const { responseScore } = this.state;
    return (
      <div>
        {this.context || (
          <CorrectAnswerHeader>
            <CorrectAnswerPointField
              type="number"
              value={responseScore}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              step={0.5}
            />
            <span>{t("component.correctanswers.points")}</span>
          </CorrectAnswerHeader>
        )}
        <Display
          preview={false}
          setAnswers
          dragHandler
          options={options}
          uiStyle={uiStyle}
          question={stimulus}
          template={template}
          userSelections={response.value}
          configureOptions={configureOptions}
          onChange={this.handleMultiSelect}
          hasGroupResponses={hasGroupResponses}
          responseIds={responseIds}
          showIndex
          view={view}
          previewTab={previewTab}
        />
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
