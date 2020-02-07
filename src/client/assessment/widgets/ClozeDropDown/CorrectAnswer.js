import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { selectColor } from "@edulastic/colors";

import { EDIT } from "../../constants/constantsForQuestions";
import { CorrectAnswerHeader } from "../../styled/CorrectAnswerHeader";
import { CorrectAnswerPointField } from "../../styled/CorrectAnswerPointField";
import { Label } from "../../styled/WidgetOptions/Label";
import ItemLevelContext from "../../../author/QuestionEditor/components/Container/QuestionContext";
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
    configureOptions: PropTypes.object.isRequired,
    uiStyle: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired
  };

  static contextType = ItemLevelContext;

  constructor(props) {
    super(props);
    // const userSelections = Array(props.options.length).fill(false);
    // props.response.value.forEach(answer => {
    //   userSelections[answer] = true;
    // });
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
    const { t, options, stimulus, response, hasGroupResponses, item, configureOptions, uiStyle } = this.props;
    const { responseScore } = this.state;
    const itemLevelScoring = this.context;
    return (
      <div>
        {itemLevelScoring || (
          <CorrectAnswerHeader mb="15px">
            <Label>{t("component.correctanswers.points")}</Label>
            <CorrectAnswerPointField
              type="number"
              value={responseScore}
              onChange={this.updateScore}
              onBlur={this.updateScore}
              disabled={false}
              min={0}
              step={0.5}
              height="40px"
              width="auto"
              style={{ "font-size": "12px", "font-weight": "600", color: selectColor }}
            />
          </CorrectAnswerHeader>
        )}
        <Display
          preview
          setAnswers
          dragHandler
          options={options}
          uiStyle={uiStyle}
          stimulus={stimulus}
          item={item}
          userSelections={response.value}
          configureOptions={configureOptions}
          onChange={this.handleMultiSelect}
          hasGroupResponses={hasGroupResponses}
          view={EDIT}
        />
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
