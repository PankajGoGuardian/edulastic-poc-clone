import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import produce from "immer";
import uuid from "uuid/v4";
import { TabContainer } from "@edulastic/common";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";
import CorrectAnswers from "../../components/CorrectAnswers";
import CorrectAnswer from "./CorrectAnswer";
import MixMatchCorrectAnswer from "./MixMatchCorrectAnswer";
import { updateVariables } from "../../utils/variables";

class SetCorrectAnswers extends Component {
  state = {
    currentTab: 0
  };

  handleTabChange = currentTab => {
    this.setState({ currentTab });
  };

  handleRemoveAltResponses = deletedTabIndex => {
    const { setQuestionData, item } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.validation.mixAndMatch) {
          draft.validation.altResponses = [];
        } else if (draft.validation.altResponses && draft.validation.altResponses.length) {
          draft.validation.altResponses = draft.validation.altResponses.filter((_, i) => i !== deletedTabIndex);
        }
      })
    );
    this.setState({
      currentTab: 0
    });
  };

  updateAltAnswersMixMatch = ({ id, tabId, value }) => {
    const { question, setQuestionData } = this.props;
    const newQuestion = produce(question, draft => {
      draft.validation.altResponses = draft.validation.altResponses.map(alt => {
        if (alt.id === tabId) {
          alt.value = alt.value.filter(resp => !(resp.id === id && resp.value === value));
        }
        return alt;
      });
    });
    setQuestionData(newQuestion);
    updateVariables(newQuestion);
  };

  addAltAnswerMixMatch = ({ index, value }) => {
    const { question, setQuestionData } = this.props;
    setQuestionData(
      produce(question, draft => {
        let updated = false;
        draft.validation.altResponses.forEach(altResponse => {
          const _index = altResponse.value.findIndex(resp => resp.index === index);
          if (_index !== -1 && altResponse.value[_index].value === "") {
            altResponse.value[_index].value = value;
            updated = true;
          } else if (_index === -1 && !updated) {
            const resp = draft.responseIds.find(respItem => respItem.index === index);
            altResponse.value.push({
              id: resp.id,
              index,
              value
            });
            updated = true;
          }
        });
        if (!updated) {
          // need to add a new tab for alternate answers
          const validAnswers = draft.validation.validResponse.value.map(answer => {
            if (answer.index === index) {
              return { ...answer, value, index };
            }
            return { ...answer, value: "" };
          });
          draft.validation.altResponses.push({
            score: draft.validation.validResponse.score,
            id: uuid(),
            value: validAnswers
          });
        }
      })
    );
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const { currentTab } = this.state;

    setQuestionData(
      produce(item, draft => {
        const validAnswers = draft.validation.validResponse.value;
        draft.validation.altResponses.push({
          score: 1,
          id: uuid(),
          value: validAnswers.map(answer => ({ ...answer, value: "" }))
        });
      })
    );
    this.setState({
      currentTab: currentTab + 1
    });
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
        updateVariables(draft);
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

  get renderResponses() {
    const {
      validation,
      stimulus,
      options,
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIds,
      view,
      previewTab,
      isV1Migrated,
      item
    } = this.props;
    const { currentTab } = this.state;

    if (validation.mixAndMatch && currentTab > 0) {
      return (
        <MixMatchCorrectAnswer
          uiStyle={uiStyle}
          validResponse={validation.validResponse}
          alternateResponse={validation.altResponses}
          onUpdateValidationValue={this.updateAltAnswersMixMatch}
          addAltAnswerMixMatch={this.addAltAnswerMixMatch}
        />
      );
    }

    return (
      <CorrectAnswer
        item={item}
        view={view}
        options={options}
        uiStyle={uiStyle}
        stimulus={stimulus}
        previewTab={previewTab}
        response={this.response}
        responseIds={responseIds}
        isV1Migrated={isV1Migrated}
        configureOptions={configureOptions}
        hasGroupResponses={hasGroupResponses}
        onUpdateValidationValue={this.updateAnswers}
      />
    );
  }

  get response() {
    const { validation } = this.props;
    const { currentTab } = this.state;
    if (currentTab === 0) {
      return validation.validResponse;
    }
    return validation.altResponses[currentTab - 1];
  }

  render() {
    const { fillSections, cleanSections, item } = this.props;
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
        hidePoint={item?.validation?.mixAndMatch && currentTab > 0}
      >
        <TabContainer>{this.renderResponses}</TabContainer>
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
  configureOptions: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.bool.isRequired,
  uiStyle: PropTypes.object,
  responseIds: PropTypes.object,
  isV1Migrated: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired
};

SetCorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responseIds: {},
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
