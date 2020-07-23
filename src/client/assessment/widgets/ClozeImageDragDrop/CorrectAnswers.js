import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import produce from "immer";
import CorrectAnswers from "../../components/CorrectAnswers";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import CorrectAnswer from "./CorrectAnswer";

class SetCorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  handleTabChange = currentTab => {
    this.setState({ currentTab });
  };

  handleRemoveAltResponses = index => {
    const { item, setQuestionData } = this.props;
    this.setState({ currentTab: 0 });
    setQuestionData(
      produce(item, draft => {
        if (draft.validation.altResponses) {
          draft.validation.altResponses.splice(index, 1);
        }
      })
    );
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        const numberOfResponses = draft.responses?.length || 0; // responses cannot be empty, there is validator which checks that
        const response = {
          score: 1,
          value: new Array(numberOfResponses).fill({})
        };

        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses.push(response);
        } else {
          draft.validation.altResponses = [response];
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
    const { item } = this.props;
    const { currentTab } = this.state;
    if (currentTab === 0) {
      return item.validation.validResponse;
    }
    return item.validation.altResponses[currentTab - 1];
  }

  render() {
    const {
      stimulus,
      imageAlterText,
      imageWidth,
      imageHeight,
      options,
      imageUrl,
      backgroundColor,
      responses,
      configureOptions,
      uiStyle,
      maxRespCount,
      showDashedBorder,
      imageOptions,
      item,
      setQuestionData,
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
        points={this.response.score}
        isCorrectAnsTab={currentTab === 0}
      >
        <CorrectAnswer
          item={item}
          response={this.response}
          stimulus={stimulus}
          options={options}
          uiStyle={uiStyle}
          responses={responses}
          imageUrl={imageUrl}
          showDashedBorder={showDashedBorder}
          configureOptions={configureOptions}
          imageAlterText={imageAlterText}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          maxRespCount={maxRespCount}
          backgroundColor={backgroundColor}
          imageOptions={imageOptions}
          setQuestionData={setQuestionData}
          onUpdateValidationValue={this.updateAnswers}
        />
      </CorrectAnswers>
    );
  }
}

SetCorrectAnswers.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  validation: PropTypes.object,
  stimulus: PropTypes.string,
  options: PropTypes.array,
  responses: PropTypes.array,
  showDashedBorder: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
  imageOptions: PropTypes.object,
  item: PropTypes.object
};

SetCorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responses: [],
  validation: {},
  showDashedBorder: false,
  backgroundColor: "#fff",
  imageUrl: "",
  imageAlterText: "",
  imageHeight: 490,
  imageWidth: 600,
  maxRespCount: 1,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false
  },
  imageOptions: {},
  item: {}
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
