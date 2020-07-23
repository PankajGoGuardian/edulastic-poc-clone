import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import produce from "immer";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
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
    const { currentTab } = this.state;
    const { setQuestionData, item } = this.props;

    setQuestionData(
      produce(item, draft => {
        const response = {
          score: 1,
          value: {}
        };

        draft.validation.altResponses = draft.validation.altResponses || [];
        draft.validation.altResponses.push(response);
      })
    );

    this.setState({
      currentTab: currentTab + 1
    });
  };

  handleRemoveAltResponses = index => {
    const { setQuestionData, item } = this.props;

    this.setState({
      currentTab: 0
    });
    setQuestionData(
      produce(item, draft => {
        if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses = draft.validation.altResponses.filter((response, i) => i !== index);
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
      imageAlterText,
      imageWidth,
      options,
      imageUrl,
      backgroundColor,
      responses,
      imagescale,
      configureOptions,
      uiStyle,
      maxRespCount,
      showDashedBorder,
      imageHeight,
      imageOptions,
      item,
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
          response={this.response}
          stimulus={stimulus}
          imagescale={imagescale}
          options={options}
          uiStyle={uiStyle}
          responses={responses}
          imageUrl={imageUrl}
          showDashedBorder={showDashedBorder}
          configureOptions={configureOptions}
          imageAlterText={imageAlterText}
          imageWidth={imageWidth}
          maxRespCount={maxRespCount}
          backgroundColor={backgroundColor}
          imageHeight={imageHeight}
          imageOptions={imageOptions}
          item={item}
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
  imagescale: PropTypes.bool,
  options: PropTypes.array,
  responses: PropTypes.array,
  showDashedBorder: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  backgroundColor: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  maxRespCount: PropTypes.number,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  imageOptions: PropTypes.object,
  imageHeight: PropTypes.any.isRequired,
  item: PropTypes.object.isRequired
};

SetCorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responses: [],
  imagescale: false,
  validation: {},
  showDashedBorder: false,
  backgroundColor: "#fff",
  imageUrl: "",
  imageAlterText: "",
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
  fillSections: () => {},
  cleanSections: () => {},
  imageOptions: {}
};

const enhance = compose(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(SetCorrectAnswers);
