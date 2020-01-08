import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { cloneDeep, findIndex } from "lodash";
import produce from "immer";
import uuid from "uuid/v4";

import { withNamespaces } from "@edulastic/localization";
import { Tab, Tabs, TabContainer } from "@edulastic/common";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";

import CorrectAnswer from "./CorrectAnswer";
import MixMatchCorrectAnswer from "./MixMatchCorrectAnswer";
import AddAlternateAnswerButton from "../../components/AddAlternateAnswerButton";

import { updateVariables } from "../../utils/variables";

class CorrectAnswers extends Component {
  state = {
    value: 0
  };

  handleTabChange = value => {
    this.setState({ value });
  };

  renderAltResponses = () => {
    const {
      validation,
      validation: { mixAndMatch = false },
      t,
      onRemoveAltResponses,
      handleRemoveAltResponsesMixMatch
    } = this.props;

    if (validation.altResponses && validation.altResponses.length) {
      if (mixAndMatch) {
        return (
          <Tab
            close
            onClose={() => {
              handleRemoveAltResponsesMixMatch();
              this.setState({ value: 0 });
            }}
            label={`${t("component.correctanswers.alternate")}`}
            IconPosition="right"
            type="primary"
          />
        );
      }
      return validation.altResponses.map((res, i) => (
        <Tab
          close
          key={i}
          onClose={() => {
            onRemoveAltResponses(i);
            this.setState({ value: 0 });
          }}
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
    const { altResponses = [], mixAndMatch = false } = validation;
    // only need one altResponses block
    // removing the button when mixNmatch and altResponses are > 1
    if (mixAndMatch && altResponses.length >= 1) return null;
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

  updateCorrectValidationAnswers = (answers, id, widthpx) => {
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
    if (widthpx) {
      newData.uiStyle.responsecontainerindividuals = newData.uiStyle.responsecontainerindividuals || [];
      const index = findIndex(newData.uiStyle.responsecontainerindividuals, container => container.id === id);
      if (index === -1) {
        const newIndex = findIndex(newData.responseIds, resp => resp.id === id);
        newData.uiStyle.responsecontainerindividuals.push({ id, widthpx, index: newIndex });
      } else {
        newData.uiStyle.responsecontainerindividuals[index] = {
          ...newData.uiStyle.responsecontainerindividuals[index],
          widthpx
        };
      }
    }
    setQuestionData(newData);
    updateVariables(newData);
  };

  updateAltCorrectValidationAnswers = (answers, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    const updatedAltResponses = newData.validation.altResponses;
    updatedAltResponses[tabIndex] = {
      ...updatedAltResponses[tabIndex],
      score: newData.validation.altResponses[tabIndex].score,
      value: answers
    };

    newData.validation.altResponses = updatedAltResponses;
    setQuestionData(newData);
    updateVariables(newData);
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
            const resp = draft.responseIds.find(resp => resp.index === index);
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
      hasGroupResponses,
      configureOptions,
      uiStyle,
      responseIds,
      view,
      previewTab,
      isV1Migrated,
      item
    } = this.props;
    const { value } = this.state;
    return (
      <div>
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.correctanswers.setcorrectanswers")}`)}>
          {t("component.correctanswers.setcorrectanswers")}
        </Subtitle>
        <div>
          <Tabs value={value} onChange={this.handleTabChange} extra={this.renderPlusButton()}>
            <Tab
              label={t("component.correctanswers.correct")}
              style={{ borderRadius: validation.altResponses <= 1 ? "4px" : "4px 0 0 4px" }}
              type="primary"
            />
            {this.renderAltResponses()}
          </Tabs>
          {value === 0 && (
            <TabContainer>
              <CorrectAnswer
                key={options}
                response={validation.validResponse}
                stimulus={stimulus}
                options={options}
                uiStyle={uiStyle}
                configureOptions={configureOptions}
                hasGroupResponses={hasGroupResponses}
                onUpdateValidationValue={this.updateCorrectValidationAnswers}
                onUpdatePoints={this.handleUpdateCorrectScore}
                responseIds={responseIds}
                view={view}
                previewTab={previewTab}
                isV1Migrated={isV1Migrated}
                item={item}
              />
            </TabContainer>
          )}
          {validation.altResponses &&
            !!validation.altResponses.length &&
            validation.altResponses.map((alter, i) => {
              if (i + 1 === value) {
                return (
                  <TabContainer key={i}>
                    {validation.mixAndMatch && (
                      <MixMatchCorrectAnswer
                        uiStyle={uiStyle}
                        validResponse={validation.validResponse}
                        alternateResponse={validation.altResponses}
                        onUpdateValidationValue={answers => this.updateAltAnswersMixMatch(answers)}
                        addAltAnswerMixMatch={answer => this.addAltAnswerMixMatch(answer)}
                      />
                    )}
                    {!validation.mixAndMatch && (
                      <CorrectAnswer
                        key={options}
                        response={alter}
                        stimulus={stimulus}
                        options={options}
                        configureOptions={configureOptions}
                        responseIds={responseIds}
                        hasGroupResponses={hasGroupResponses}
                        uiStyle={uiStyle}
                        onUpdateValidationValue={answers => this.updateAltCorrectValidationAnswers(answers, i)}
                        onUpdatePoints={this.handleUpdateAltValidationScore(i)}
                        view={view}
                        previewTab={previewTab}
                        isV1Migrated={isV1Migrated}
                        max={validation?.validResponse?.score}
                        item={item}
                      />
                    )}
                  </TabContainer>
                );
              }
              return null;
            })}
        </div>
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
  hasGroupResponses: PropTypes.bool,
  onRemoveAltResponses: PropTypes.func,
  configureOptions: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.bool.isRequired,
  uiStyle: PropTypes.object,
  responseIds: PropTypes.object
};

CorrectAnswers.defaultProps = {
  stimulus: "",
  options: [],
  responseIds: {},
  validation: {},
  onRemoveAltResponses: () => {},
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
