import React, { Component } from "react";
import { Tabs, Tab, TabContainer, Button } from "@edulastic/common";
import { IconPlus } from "@edulastic/icons";
import { white } from "@edulastic/colors";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import { Subtitle } from "../common/styled_components";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import CorrectAnswer from "./CorrectAnswer";

class CorrectAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleTabChange = value => {
    this.setState({ value });
  };

  handleAltResponseClose = i => {
    const { onRemoveAltResponses } = this.props;
    const { value } = this.state;
    if (i <= value - 1) {
      this.handleTabChange(value - 1);
    }
    onRemoveAltResponses(i);
  };

  renderAltResponses = () => {
    const { graphData, t } = this.props;
    const { validation } = graphData;

    if (validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => (
        <Tab
          IconPosition="right"
          key={i}
          close
          type="primary"
          onClose={() => this.handleAltResponseClose(i)}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
        />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, graphData } = this.props;
    const { validation } = graphData;

    return (
      <Button
        style={{ minWidth: 20, minHeight: 20, width: 20, padding: 0, marginLeft: 20 }}
        icon={<IconPlus color={white} width={10} height={10} />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          onAddAltResponses();
        }}
        color="primary"
        variant="extendedFab"
      />
    );
  };

  handleUpdateCorrectScore = points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.valid_response.score = points;

    setQuestionData(newData);
  };

  updateValidationValue = value => {
    const { question, setQuestionData } = this.props;
    const { validation } = question;
    validation.valid_response.value = value;
    setQuestionData({ ...question, validation });
  };

  updateAltValidationValue = (value, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const { validation } = question;
    validation.alt_responses[tabIndex].value = value;
    setQuestionData({ ...question, validation });
  };

  handleUpdateAltValidationScore = i => points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.alt_responses[i].score = points;

    setQuestionData(newData);
  };

  render() {
    const { t, graphData, changePreviewTab, previewTab } = this.props;
    const { validation } = graphData;

    const { value } = this.state;

    return (
      <div>
        <Subtitle>{t("component.correctanswers.setcorrectanswers")}</Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab IconPosition="right" label={t("component.correctanswers.correct")} type="primary" />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                graphData={graphData}
                previewTab={previewTab}
                changePreviewTab={changePreviewTab}
                response={validation.valid_response}
                onUpdateValidationValue={this.updateValidationValue}
                onUpdatePoints={this.handleUpdateCorrectScore}
              />
            </TabContainer>
          )}
          {validation.alt_responses &&
            !!validation.alt_responses.length &&
            validation.alt_responses.map((alter, i) => {
              if (i + 1 === value) {
                return (
                  <TabContainer key={i}>
                    <CorrectAnswer
                      graphData={graphData}
                      response={alter}
                      previewTab={previewTab}
                      changePreviewTab={changePreviewTab}
                      onUpdateValidationValue={val => this.updateAltValidationValue(val, i)}
                      onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                    />
                  </TabContainer>
                );
              }
              return null;
            })}
        </div>
      </div>
    );
  }
}

CorrectAnswers.propTypes = {
  graphData: PropTypes.object.isRequired,
  onAddAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  onRemoveAltResponses: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      question: getQuestionDataSelector(state)
    }),
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(CorrectAnswers);
