import React, { Component } from "react";
import PropTypes from "prop-types";
import { arrayMove } from "react-sortable-hoc";
import { compose } from "redux";
import { find, cloneDeep, forEach } from "lodash";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "react-quill/dist/quill.snow.css";
import produce from "immer";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import SortableList from "../../components/SortableList/index";
import { Subtitle } from "../../styled/Subtitle";
import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import { defaultOptions } from "../../constants/constantsForQuestions";
import Question from "../../components/Question";
import { ChoicesConatiner } from "./styled/ChoicesConatiner";

class ChoicesForResponse extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    responses: PropTypes.array.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  onChangeQuestion = stimulus => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.stimulus = stimulus;
        updateVariables(draft);
      })
    );
  };

  onSortEnd = (responseId, { oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[responseId] = arrayMove(draft.options[responseId], oldIndex, newIndex);
      })
    );
  };

  remove = (responseId, itemIndex) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.options[responseId].splice(itemIndex, 1);

        const validAnswers = cloneDeep(draft.validation.validResponse.value);
        forEach(validAnswers, answer => {
          if (answer.id === responseId) {
            answer.value = "";
          }
        });

        draft.validation.validResponse.value = validAnswers;
        updateVariables(draft);
      })
    );
  };

  editOptions = (responseId, itemIndex, e) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[responseId] === undefined) draft.options[responseId] = [];

        const correctAnswer = find(draft.validation.validResponse.value, answer => answer.id === responseId);
        if (correctAnswer && correctAnswer.value === draft.options[responseId][itemIndex]) {
          correctAnswer.value = e.target.value;
        }

        draft.options[responseId][itemIndex] = e.target.value;
        let maxLength = 0;
        Object.keys(draft.options).forEach(option => {
          draft.options[option].forEach(opt => {
            maxLength = Math.max(maxLength, opt ? opt.length : 0);
          });
        });

        const finalWidth = 40 + maxLength * 7;
        draft.uiStyle.widthpx = finalWidth < 140 ? 140 : finalWidth > 400 ? 400 : finalWidth;
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = responseId => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        if (draft.options[responseId] === undefined) draft.options[responseId] = [];
        draft.options[responseId].push(t("component.cloze.dropDown.newChoice"));
      })
    );
  };

  render() {
    const { t, item, responses, fillSections, cleanSections } = this.props;
    const { options } = item;
    return (
      <Question
        section="main"
        dataCy="choice-response-section"
        label={t("component.cloze.dropDown.choicesforresponse")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        {responses.map(response => (
          <ChoicesConatiner data-cy={`choice-response-${response.index}`}>
            <Subtitle
              id={getFormattedAttrId(
                `${item?.title}-${t("component.cloze.dropDown.choicesforresponse")} ${response.index + 1}`
              )}
            >{`${t("component.cloze.dropDown.choicesforresponse")} ${response.index + 1}`}</Subtitle>
            <SortableList
              useDragHandle
              items={options[response.id] || []}
              defaultOptions={defaultOptions}
              onSortEnd={params => this.onSortEnd(response.id, params)}
              onRemove={itemIndex => this.remove(response.id, itemIndex)}
              onChange={(itemIndex, e) => this.editOptions(response.id, itemIndex, e)}
            />
            <div>
              <AddNewChoiceBtn data-cy={response.index} onClick={() => this.addNewChoiceBtn(response.id)}>
                {t("component.cloze.dropDown.addnewchoice")}
              </AddNewChoiceBtn>
            </div>
          </ChoicesConatiner>
        ))}
      </Question>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(ChoicesForResponse);
