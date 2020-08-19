import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import produce from "immer";
import { compose } from "redux";

import { TabContainer } from "@edulastic/common";
import { getQuestionDataSelector, setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import CorrectAnswers from "../../components/CorrectAnswers";
import CorrectAnswer from "./CorrectAnswer";

class SetCorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  handleTabChange = currentTab => {
    this.setState({ currentTab });
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        const correctAnswer = draft.validation.validResponse.value;
        const answerToBeAdded = correctAnswer.map(answer => ({
          ...answer,
          value: ""
        }));
        draft.validation.altResponses = draft.validation.altResponses || [];
        draft.validation.altResponses.push({
          score: 1,
          value: answerToBeAdded
        });
      })
    );
    this.setState({
      currentTab: currentTab + 1
    });
  };

  handleRemoveAltResponses = deletedTabIndex => {
    const { currentTab } = this.state;
    const { setQuestionData, item } = this.props;

    if (currentTab === deletedTabIndex + 1) {
      this.setState({
        currentTab: deletedTabIndex
      });
    }

    setQuestionData(
      produce(item, draft => {
        if (draft.validation?.altResponses?.length) {
          draft.validation.altResponses.splice(deletedTabIndex, 1);
        }
      })
    );
  };

  updateScore = score => {
    if (!(score > 0)) {
      return;
    }
    const points = parseFloat(score, 10);
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

  get response() {
    const { validation } = this.props;
    const { currentTab } = this.state;
    if (currentTab === 0) {
      return validation.validResponse;
    }
    return validation.altResponses[currentTab - 1];
  }

  render() {
    const {
      stimulus,
      options,
      item,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      fillSections,
      cleanSections
    } = this.props;
    const { currentTab } = this.state;
    return (
      <CorrectAnswers
        correctTab={currentTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
        validation={item.validation}
        questionType={item?.title}
        onAdd={this.handleAddAltResponses}
        onCloseTab={this.handleRemoveAltResponses}
        onTabChange={this.handleTabChange}
        onChangePoints={this.updateScore}
        points={this.response?.score}
        isCorrectAnsTab={currentTab === 0}
      >
        <TabContainer>
          <CorrectAnswer
            response={this.response}
            stimulus={stimulus}
            options={options}
            item={item}
            configureOptions={configureOptions}
            hasGroupResponses={hasGroupResponses}
            uiStyle={uiStyle}
            onUpdateValidationValue={this.updateAnswers}
            onUpdatePoints={this.updateScore}
          />
        </TabContainer>
      </CorrectAnswers>
    );
  }
}

SetCorrectAnswers.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  question: PropTypes.object.isRequired,
  hasGroupResponses: PropTypes.bool,
  item: PropTypes.object.isRequired,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object
};

SetCorrectAnswers.defaultProps = {
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
  connect(
    state => ({
      question: getQuestionDataSelector(state)
    }),
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(SetCorrectAnswers);
