import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, keys } from "lodash";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { Tab, Tabs, TabContainer } from "@edulastic/common";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";

import CorrectAnswer from "./CorrectAnswer";
import AddAlternateAnswerButton from "../../components/AddAlternateAnswerButton";
import { AddAlternative } from "../../styled/ButtonStyles";

class CorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  handleTabChange = currentTab => {
    this.setState({ currentTab });
  };

  handleRemoveAltResponses = (event, deletedTabIndex) => {
    event?.stopPropagation();
    const { currentTab } = this.state;
    const { onRemoveAltResponses } = this.props;

    if (currentTab === deletedTabIndex + 1) {
      this.setState({
        currentTab: deletedTabIndex
      });
    }

    onRemoveAltResponses(deletedTabIndex);
  };

  renderAltResponses = () => {
    const { validation, t } = this.props;

    if (validation.altResponses && validation.altResponses.length) {
      return validation.altResponses.map((res, i) => (
        <Tab
          close
          key={i}
          onClose={event => this.handleRemoveAltResponses(event, i)}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
          type="primary"
          IconPosition="right"
        />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, validation, t } = this.props;

    return (
      <AddAlternateAnswerButton
        onClickHandler={() => {
          this.handleTabChange(validation.altResponses.length + 1);
          onAddAltResponses();
        }}
        text={`+${t("component.correctanswers.alternativeAnswer")}`}
      />
    );
  };

  updateResponseBoxWidth = newData => {
    let maxLength = 0;
    const { vlaue: correctAnswers } = newData.validation.validResponse;
    keys(correctAnswers).forEach(id => {
      maxLength = Math.max(maxLength, correctAnswers[id] ? correctAnswers[id].length : 0);
    });

    newData.validation.altResponses.forEach(arr => {
      const { value: altCorrectAnswers } = arr;
      keys(altCorrectAnswers).forEach(id => {
        maxLength = Math.max(maxLength, altCorrectAnswers[id] ? altCorrectAnswers[id].length : 0);
      });
    });
    const finalWidth = 40 + maxLength * 7;
    newData.uiStyle.width = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
    return newData;
  };

  updateCorrectValidationAnswers = answers => {
    const { question, setQuestionData, updateVariables } = this.props;
    const newData = cloneDeep(question);
    const updatedValidation = {
      ...question.data,
      validResponse: {
        score: question.validation.validResponse.score,
        value: answers
      }
    };
    newData.validation.validResponse = updatedValidation.validResponse;
    const updatedData = this.updateResponseBoxWidth(newData);
    updateVariables(updatedData);
    setQuestionData(updatedData);
  };

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { question, setQuestionData, updateVariables } = this.props;
    const newData = cloneDeep(question);

    const updatedAltResponses = newData.validation.altResponses;
    updatedAltResponses[tabIndex] = {
      score: newData.validation.altResponses[tabIndex].score,
      value: answers
    };

    newData.validation.altResponses = updatedAltResponses;
    const updatedData = this.updateResponseBoxWidth(newData);
    updateVariables(updatedData);
    setQuestionData(updatedData);
  };

  handleUpdateCorrectScore = points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.validResponse.score = points;

    setQuestionData(newData);
  };

  handleUpdateAltValidationScore = i => points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.altResponses[i].score = points;

    setQuestionData(newData);
  };

  render() {
    const {
      validation,
      stimulus,
      imageAlterText,
      imageWidth,
      options,
      t,
      imageUrl,
      templateMarkUp,
      backgroundColor,
      responses,
      configureOptions,
      uiStyle,
      maxRespCount,
      showDashedBorder,
      imageOptions,
      item
    } = this.props;
    const { currentTab } = this.state;
    return (
      <div>
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.setcorrectanswers")}`)}>
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <AddAlternative>
          {this.renderPlusButton()}
          <Tabs value={currentTab} onChange={this.handleTabChange} style={{ marginBottom: 10, marginTop: 20 }}>
            <Tab label={t("component.correctanswers.correct")} type="primary" IconPosition="right" />
            {this.renderAltResponses()}
          </Tabs>
        </AddAlternative>
        {currentTab === 0 && (
          <TabContainer>
            <CorrectAnswer
              key={options}
              response={validation.validResponse}
              stimulus={stimulus}
              options={options}
              uiStyle={uiStyle}
              responses={responses}
              imageUrl={imageUrl}
              showDashedBorder={showDashedBorder}
              configureOptions={configureOptions}
              imageAlterText={imageAlterText}
              imageWidth={imageWidth}
              maxRespCount={maxRespCount}
              onUpdateValidationValue={this.updateCorrectValidationAnswers}
              onUpdatePoints={this.handleUpdateCorrectScore}
              backgroundColor={backgroundColor}
              imageOptions={imageOptions}
              isCorrectAnsTab
            />
          </TabContainer>
        )}
        {validation.altResponses &&
          !!validation.altResponses.length &&
          validation.altResponses.map((alter, i) => {
            if (i + 1 === currentTab) {
              return (
                <TabContainer key={i}>
                  <CorrectAnswer
                    key={options}
                    response={alter}
                    stimulus={stimulus}
                    options={options}
                    configureOptions={configureOptions}
                    responses={responses}
                    imageUrl={imageUrl}
                    imageAlterText={imageAlterText}
                    imageWidth={imageWidth}
                    maxRespCount={maxRespCount}
                    templateMarkUp={templateMarkUp}
                    showDashedBorder={showDashedBorder}
                    uiStyle={uiStyle}
                    backgroundColor={backgroundColor}
                    onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                    onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                    imageOptions={imageOptions}
                  />
                </TabContainer>
              );
            }
            return null;
          })}
      </div>
    );
  }
}

CorrectAnswers.propTypes = {
  onAddAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  onRemoveAltResponses: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  responses: PropTypes.array,
  templateMarkUp: PropTypes.string,
  question: PropTypes.object.isRequired,
  showDashedBorder: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
  imageOptions: PropTypes.object,
  updateVariables: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responses: [],
  validation: {},
  showDashedBorder: false,
  templateMarkUp: "",
  backgroundColor: "#fff",
  imageUrl: "",
  imageAlterText: "",
  imageWidth: 600,
  maxRespCount: 1,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    width: 0,
    height: 0,
    wordwrap: false
  },
  imageOptions: {}
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
