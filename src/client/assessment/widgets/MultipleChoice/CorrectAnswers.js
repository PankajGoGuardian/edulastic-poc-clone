import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { Button, Tab, TabContainer, Tabs } from "@edulastic/common";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";
import { CorrectAnswersContainer } from "./styled/CorrectAnswers";

import CorrectAnswer from "./CorrectAnswer";
import { IconPlus } from "./styled/IconPlus";

class CorrectAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.correctanswers.setcorrectanswers"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  handleTabChange = value => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const { validation, t, onRemoveAltResponses } = this.props;

    if (validation.alt_responses && validation.alt_responses.length) {
      return validation.alt_responses.map((res, i) => (
        <Tab
          IconPosition="right"
          key={i}
          close
          type="primary"
          onClose={() => {
            onRemoveAltResponses(i);
            this.handleTabChange(0);
          }}
          label={`${t("component.correctanswers.alternate")} ${i + 1}`}
        />
      ));
    }
    return null;
  };

  renderPlusButton = () => {
    const { onAddAltResponses, validation } = this.props;

    return (
      <Button
        style={{ minWidth: 20, minHeight: 20, width: 20, padding: 0, marginLeft: 20 }}
        icon={<IconPlus data-cy="alternate" />}
        onClick={() => {
          this.handleTabChange(validation.alt_responses.length + 1);
          onAddAltResponses();
        }}
        color="primary"
        variant="extendedFab"
      />
    );
  };

  updateCorrectValidationAnswers = answers => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);
    const updatedValidation = {
      ...question.data,
      valid_response: {
        score: question.validation.valid_response.score,
        value: answers
      }
    };
    newData.validation.valid_response = updatedValidation.valid_response;
    setQuestionData(newData);
  };

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    const updatedAltResponses = newData.validation.alt_responses;
    updatedAltResponses[tabIndex] = {
      score: newData.validation.alt_responses[tabIndex].score,
      value: answers
    };

    newData.validation.alt_responses = updatedAltResponses;
    setQuestionData(newData);
  };

  handleUpdateCorrectScore = points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.valid_response.score = points;

    setQuestionData(newData);
  };

  handleUpdateAltValidationScore = i => points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.alt_responses[i].score = points;

    setQuestionData(newData);
  };

  render() {
    const { validation, stimulus, options, t, multipleResponses, uiStyle, styleType } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Subtitle>{t("component.correctanswers.setcorrectanswers")}</Subtitle>
        <CorrectAnswersContainer>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab IconPosition="right" label={t("component.correctanswers.correct")} type="primary" />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                uiStyle={uiStyle}
                response={validation.valid_response}
                stimulus={stimulus}
                multipleResponses={multipleResponses}
                options={options}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={this.handleUpdateCorrectScore}
                styleType={styleType}
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
                      uiStyle={uiStyle}
                      response={alter}
                      multipleResponses={multipleResponses}
                      stimulus={stimulus}
                      options={options}
                      onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                      styleType={styleType}
                      onUpdatePoints={this.handleUpdateAltValidationScore(i)}
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
  cleanSections: PropTypes.func
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
