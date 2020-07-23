import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { ItemLevelContext } from "@edulastic/common";
import _ from "lodash";
import CorrectAnswers from "../../components/CorrectAnswers";
import CorrectAnswer from "./CorrectAnswer";

class SetCorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  static contextType = ItemLevelContext;

  componentDidUpdate(prevProps) {
    const { options } = this.props;

    if (!_.isEqual(options, prevProps.options)) {
      const { validation } = this.props;
      const oldValue = validation.validResponse.value;
      const diff = _.difference(prevProps.options, options);
      if (oldValue.some(el => diff.includes(el))) {
        const index = prevProps.options.indexOf(diff[0]);
        const valueIndex = oldValue.indexOf(diff[0]);
        const newAnswers = _.cloneDeep(oldValue);
        newAnswers[valueIndex] = options[index];
        this.updateCorrectValidationAnswers(newAnswers);
      }
    }
  }

  updateCorrectValidationAnswers = answers => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.validation.validResponse.value = answers;
      })
    );
  };

  addAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        const response = {
          score: 1,
          value: new Array(draft.responseIds.length).fill(null)
        };

        draft.validation.altResponses = draft.validation.altResponses || [];
        draft.validation.altResponses.push(response);
      })
    );
    this.setState({
      currentTab: currentTab + 1
    });
  };

  removeAltResponses = index => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.validation && draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses.splice(index, 1);
        }
      })
    );
    this.setState({
      currentTab: 0
    });
  };

  tabChange = value => {
    this.setState({ currentTab: value });
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
      stimulus,
      options,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIDs,
      item,
      fillSections,
      cleanSections
    } = this.props;
    const { currentTab } = this.state;
    const { response } = this;

    return (
      <CorrectAnswers
        correctTab={currentTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
        validation={item.validation}
        questionType={item?.title}
        onAdd={this.addAltResponses}
        onCloseTab={this.removeAltResponses}
        onTabChange={this.tabChange}
        onChangePoints={this.updateScore}
        points={response.score}
        isCorrectAnsTab={currentTab === 0}
      >
        <CorrectAnswer
          response={response}
          stimulus={stimulus}
          options={options}
          uiStyle={uiStyle}
          configureOptions={configureOptions}
          hasGroupResponses={hasGroupResponses}
          onUpdateValidationValue={this.updateAnswers}
          responseIDs={responseIDs}
          item={item}
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
  hasGroupResponses: PropTypes.bool,
  configureOptions: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  responseIDs: PropTypes.array,
  item: PropTypes.object.isRequired
};

SetCorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responseIDs: [],
  validation: {},
  hasGroupResponses: false,
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false
  }
};

export default SetCorrectAnswers;
