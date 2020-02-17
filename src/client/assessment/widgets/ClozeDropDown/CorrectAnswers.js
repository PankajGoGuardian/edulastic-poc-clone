import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep } from "lodash";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";
import { Tab, Tabs, TabContainer } from "@edulastic/common";
import { Subtitle } from "../../styled/Subtitle";
import {
  getQuestionDataSelector,
  setQuestionDataAction
} from "../../../author/QuestionEditor/ducks";

import CorrectAnswer from "./CorrectAnswer";
import AddAlternateAnswerButton from "../../components/AddAlternateAnswerButton";
import { AddAlternative } from "../../styled/ButtonStyles";

class CorrectAnswers extends Component {
  state = {
    value: 0
  };

  handleTabChange = value => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const { validation, t, onRemoveAltResponses } = this.props;

    if (validation.altResponses && validation.altResponses.length) {
      return validation.altResponses.map((res, i) => (
        <Tab
          close
          key={i}
          onClose={() => onRemoveAltResponses(i)}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
          IconPosition="right"
          type="primary"
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
      item,
      hasGroupResponses,
      configureOptions,
      uiStyle
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t("component.correctanswers.setcorrectanswers")}`
          )}
        >
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <AddAlternative>
          {this.renderPlusButton()}
          <Tabs
            value={value}
            onChange={this.handleTabChange}
            style={{ marginBottom: 10, marginTop: 20 }}
          >
            <Tab
              style={{ borderRadius: validation.altResponses <= 1 ? "4px" : "4px 0 0 4px" }}
              label={t("component.correctanswers.correct")}
              type="primary"
            />
            {this.renderAltResponses()}
          </Tabs>
        </AddAlternative>
        {value === 0 && (
          <TabContainer>
            <CorrectAnswer
              key={options}
              response={validation.validResponse}
              stimulus={stimulus}
              options={options}
              uiStyle={uiStyle}
              item={item}
              configureOptions={configureOptions}
              hasGroupResponses={hasGroupResponses}
              onUpdateValidationValue={this.updateCorrectValidationAnswers}
              onUpdatePoints={this.handleUpdateCorrectScore}
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
                    key={options}
                    response={alter}
                    stimulus={stimulus}
                    options={options}
                    item={item}
                    configureOptions={configureOptions}
                    hasGroupResponses={hasGroupResponses}
                    uiStyle={uiStyle}
                    onUpdateValidationValue={answers =>
                      this.updateAltCorrectValidationAnswers(answers, i)
                    }
                    onUpdatePoints={this.handleUpdateAltValidationScore(i)}
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
  onRemoveAltResponses: PropTypes.func.isRequired,
  onAddAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  question: PropTypes.object.isRequired,
  hasGroupResponses: PropTypes.bool,
  item: PropTypes.object.isRequired,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  validation: {},
  hasGroupResponses: false,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: ""
  }
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
