import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { questionTitle } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { Tab, TabContainer, Tabs, FlexContainer, ItemLevelContext, getFormattedAttrId } from "@edulastic/common";
import { PointsInput } from "../../styled/CorrectAnswerHeader";
import { Label } from "../../styled/WidgetOptions/Label";
import { Subtitle } from "../../styled/Subtitle";
import CorrectAnswer from "./CorrectAnswer";
import { AlternateAnswerLink } from "../../styled/ButtonStyles";

class CorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  static contextType = ItemLevelContext;

  handleAddAltResponses = () => {
    const { setQuestionData, question } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(question, draft => {
        const response = {
          score: 1,
          value: []
        };

        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses.push(response);
        } else {
          draft.validation.altResponses = [response];
        }
      })
    );

    this.setState({
      currentTab: currentTab + 1
    });
  };

  handleRemoveAltResponses = index => e => {
    e?.stopPropagation();
    const { setQuestionData, question } = this.props;
    setQuestionData(
      produce(question, draft => {
        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses = draft.validation.altResponses.filter((response, i) => i !== index);
        }
      })
    );
    this.setState({
      currentTab: 0
    });
  };

  updateAnswers = answers => {
    const { question, setQuestionData } = this.props;
    const { currentTab } = this.state;
    setQuestionData(
      produce(question, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.value = answers;
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].value = answers;
        }
      })
    );
  };

  updateScore = e => {
    if (!(e.target.value > 0)) {
      return;
    }
    const points = parseFloat(e.target.value, 10);
    const { question, setQuestionData } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(question, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.score = points;
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].score = points;
        }
      })
    );
  };

  renderAltResponsesTabs = () => {
    const { validation, t } = this.props;
    if (validation.altResponses && validation.altResponses.length) {
      return validation.altResponses.map((res, i) => (
        <Tab
          IconPosition="right"
          key={i}
          close
          type="primary"
          onClose={this.handleRemoveAltResponses(i)}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
        />
      ));
    }
    return null;
  };

  handleTabChange = value => {
    this.setState({ currentTab: value });
  };

  get tabs() {
    const { validation } = this.props;
    return validation?.altResponses?.length || 0;
  }

  get response() {
    const { validation } = this.props;
    const { currentTab } = this.state;
    if (currentTab === 0) {
      return validation.validResponse;
    }
    return validation.altResponses[currentTab - 1];
  }

  render() {
    const { stimulus, options, t, multipleResponses, uiStyle, styleType, fontSize, queTitle = "" } = this.props;
    const { currentTab } = this.state;
    const title = currentTab === 0 ? "correct" : "alternative";
    const { response } = this;
    const itemLevelScoring = this.context;

    return (
      <Fragment>
        <Subtitle id={getFormattedAttrId(`${title}-${t("component.correctanswers.setcorrectanswers")}`)}>
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <FlexContainer alignItems="flex-end" marginBottom="16px">
          {itemLevelScoring || (
            <FlexContainer flex={1} flexDirection="column" alignItems="flex-start">
              <Label>{t("component.correctanswers.points")}</Label>
              <PointsInput
                id={getFormattedAttrId(`${title}-${t("component.correctanswers.points")}`)}
                type="number"
                data-cy="points"
                value={response.score}
                onChange={this.updateScore}
                onBlur={this.updateScore}
                disabled={false}
                min={0}
                step={0.5}
              />
            </FlexContainer>
          )}
          <FlexContainer flex={1}>
            {queTitle !== questionTitle.MCQ_TRUE_OR_FALSE && (
              <AlternateAnswerLink onClick={this.handleAddAltResponses} variant="extendedFab" data-cy="alternate">
                {`+ ${t("component.correctanswers.alternativeAnswer")}`}
              </AlternateAnswerLink>
            )}
          </FlexContainer>
        </FlexContainer>

        {this.tabs >= 1 && (
          <Tabs value={currentTab} onChange={this.handleTabChange} style={{ marginBottom: 16 }}>
            <Tab type="primary" data_cy="correct" label={t("component.correctanswers.correct")} />
            {this.renderAltResponsesTabs()}
          </Tabs>
        )}

        <TabContainer padding="0px">
          <CorrectAnswer
            uiStyle={uiStyle}
            stimulus={stimulus}
            multipleResponses={multipleResponses}
            options={options}
            styleType={styleType}
            fontSize={fontSize}
            title={title}
            response={response}
            onUpdateValidationValue={this.updateAnswers}
          />
        </TabContainer>
      </Fragment>
    );
  }
}

CorrectAnswers.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  question: PropTypes.object.isRequired,
  multipleResponses: PropTypes.bool.isRequired,
  uiStyle: PropTypes.object.isRequired,
  styleType: PropTypes.string,
  fontSize: PropTypes.any.isRequired
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  validation: {},
  styleType: "default"
};

export default withNamespaces("assessment")(CorrectAnswers);
