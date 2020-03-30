import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { getFormattedAttrId, ItemLevelContext } from "@edulastic/common";
import { EDIT } from "../../../../constants/constantsForQuestions";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { CorrectAnswerHeader, PointsInput } from "../../../../styled/CorrectAnswerHeader";
import Display from "../../Display";

class CorrectAnswer extends Component {
  static propTypes = {
    response: PropTypes.object.isRequired,
    onUpdatePoints: PropTypes.func.isRequired,
    onUpdateValidationValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    stimulus: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    hasGroupResponses: PropTypes.bool.isRequired,
    uiStyle: PropTypes.object.isRequired,
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
    const { t, options, stimulus, response, hasGroupResponses, item, uiStyle } = this.props;
    const { responseScore } = this.state;
    const itemLevelScoring = this.context;
    return (
      <div>
        {itemLevelScoring || (
          <CorrectAnswerHeader mb="15px">
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
          onChange={this.handleMultiSelect}
          hasGroupResponses={hasGroupResponses}
          view={EDIT}
        />
      </div>
    );
  }
}

export default withNamespaces("assessment")(CorrectAnswer);
