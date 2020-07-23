import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { get } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import CorrectAnswers from "../../../../components/CorrectAnswers";
import Question from "../../../../components/Question";
import CorrectAnswer from "./CorrectAnswer";
import AnswerOptions from "./AnswerOptions";

class SetCorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  handleTabChange = currentTab => {
    this.setState({ currentTab });
  };

  handleAddAltResponses = () => {
    const { item, setQuestionData, validation } = this.props;
    this.handleTabChange(validation.altResponses.length + 1);

    const validAnswers = get(item, "validation.validResponse.value", {});

    // storing alternate anwer based on valid answer
    const alternateAnswers = {};
    Object.keys(validAnswers).forEach(key => {
      alternateAnswers[key] = "";
    });

    setQuestionData(
      produce(item, draft => {
        draft.validation.altResponses.push({
          score: 1,
          value: alternateAnswers
        });
      })
    );
  };

  handleRemoveAltResponses = deletedTabIndex => {
    const { setQuestionData, item } = this.props;
    this.handleTabChange(0);
    setQuestionData(
      produce(item, draft => {
        if (get(draft, "validation.altResponses", null)) {
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
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        if (currentTab === 0) {
          draft.validation.validResponse.score = points;
        } else if (currentTab > 0) {
          draft.validation.altResponses[currentTab - 1].score = points;
        }
      })
    );
  };

  updateAnswers = answers => {
    const { item, setQuestionData } = this.props;
    const { currentTab } = this.state;
    setQuestionData(
      produce(item, draft => {
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
      t,
      item,
      uiStyle,
      options,
      stimulus,
      hasGroupResponses,
      fillSections,
      cleanSections,
      setQuestionData
    } = this.props;
    const { currentTab } = this.state;

    return (
      <Question
        position="unset"
        section="main"
        label={t("component.correctanswers.setcorrectanswers")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
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
          points={this.response.score}
          isCorrectAnsTab={currentTab === 0}
        >
          <CorrectAnswer
            response={this.response}
            stimulus={stimulus}
            options={options}
            uiStyle={uiStyle}
            item={item}
            hasGroupResponses={hasGroupResponses}
            onUpdateValidationValue={this.updateAnswers}
          />
        </CorrectAnswers>
        <AnswerOptions t={t} setQuestionData={setQuestionData} item={item} />
      </Question>
    );
  }
}

SetCorrectAnswers.propTypes = {
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  t: PropTypes.func.isRequired,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  hasGroupResponses: PropTypes.bool,
  item: PropTypes.object.isRequired,
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

export default withNamespaces("assessment")(SetCorrectAnswers);
