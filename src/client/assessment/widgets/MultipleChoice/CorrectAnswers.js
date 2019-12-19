import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep } from "lodash";

import { themeColor } from "@edulastic/colors";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { Button, Tab, TabContainer, Tabs } from "@edulastic/common";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";
import { CorrectAnswersContainer } from "./styled/CorrectAnswers";

import CorrectAnswer from "./CorrectAnswer";

class CorrectAnswers extends Component {
  state = {
    tabs: 1,
    value: 0
  };

  updateCountTabs = newCount => {
    const { tabs } = this.state;

    if (tabs !== newCount) {
      this.setState({
        tabs: newCount
      });
    }
  };

  handleTabChange = value => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const { validation, t, onRemoveAltResponses } = this.props;

    if (validation.altResponses && validation.altResponses.length) {
      this.updateCountTabs(validation.altResponses.length + 1);

      return validation.altResponses.map((res, i) => (
        <Tab
          IconPosition="right"
          key={i}
          close
          type="primary"
          onClose={event => {
            event.stopPropagation();
            onRemoveAltResponses(i);
            this.handleTabChange(i);
            this.updateCountTabs(validation.altResponses.length);
          }}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
        />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, validation, t } = this.props;

    return (
      <Button
        style={{
          background: "transparent",
          color: themeColor,
          borderRadius: 0,
          padding: 0,
          boxShadow: "none",
          marginLeft: "auto"
        }}
        onClick={() => {
          this.handleTabChange(validation.altResponses.length + 1);
          onAddAltResponses();
        }}
        color="primary"
        variant="extendedFab"
        data-cy="alternate"
      >
        {`+ ${t("component.correctanswers.alternativeAnswer")}`}
      </Button>
    );
  };

  updateCorrectValidationAnswers = answers => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);
    const updatedValidation = {
      ...question.data,
      validResponse: {
        score: question.validation.validResponse.score,
        value: answers
      }
    };
    newData.validation.validResponse = updatedValidation.validResponse;
    setQuestionData(newData);
  };

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    const updatedAltResponses = newData.validation.altResponses;
    updatedAltResponses[tabIndex] = {
      score: newData.validation.altResponses[tabIndex].score,
      value: answers
    };

    newData.validation.altResponses = updatedAltResponses;
    setQuestionData(newData);
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
      options,
      t,
      multipleResponses,
      uiStyle,
      styleType,
      correctTab,
      fontSize,
      item
    } = this.props;
    const { value, tabs } = this.state;
    return (
      <div>
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.setcorrectanswers")}`)}>
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <CorrectAnswersContainer>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            {tabs >= 1 && (
              <Tab
                type="primary"
                data_cy="correct"
                label={t("component.correctanswers.correct")}
                borderRadius={tabs === 1}
                active={correctTab === 0}
              />
            )}
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                uiStyle={uiStyle}
                response={validation.validResponse}
                stimulus={stimulus}
                multipleResponses={multipleResponses}
                options={options}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={this.handleUpdateCorrectScore}
                styleType={styleType}
                fontSize={fontSize}
              />
            </TabContainer>
          )}
          {validation.altResponses &&
            !!validation.altResponses.length &&
            validation.altResponses.map((alter, i) => {
              if (i + 1 === value) {
                return (
                  <TabContainer key={i}>
                    <CorrectAnswer
                      uiStyle={uiStyle}
                      response={alter}
                      multipleResponses={multipleResponses}
                      stimulus={stimulus}
                      options={options}
                      onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                      styleType={styleType}
                      onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                      fontSize={fontSize}
                    />
                  </TabContainer>
                );
              }
              return null;
            })}
        </CorrectAnswersContainer>
      </div>
    );
  }
}

CorrectAnswers.propTypes = {
  onAddAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  question: PropTypes.object.isRequired,
  multipleResponses: PropTypes.bool.isRequired,
  onRemoveAltResponses: PropTypes.func.isRequired,
  uiStyle: PropTypes.object.isRequired,
  styleType: PropTypes.string,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  correctTab: PropTypes.number.isRequired
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  validation: {},
  styleType: "default",
  fillSections: () => {},
  cleanSections: () => {}
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
