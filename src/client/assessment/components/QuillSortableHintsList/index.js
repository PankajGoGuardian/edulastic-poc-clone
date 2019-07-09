import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import produce from "immer";
import uuid from "uuid/v4";
import { arrayMove } from "react-sortable-hoc";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";
import QuillSortableList from "../QuillSortableList";

import { AddNewChoiceBtn } from "../../styled/AddNewChoiceBtn";
import { ALPHABET } from "../../widgets/MultipleChoice/constants/alphabet";
import { updateVariables } from "../../utils/variables";

class QuillSortableHintsList extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.hints = arrayMove(draft.hints, oldIndex, newIndex).map(({ label }, index) => ({
          value: index,
          label
        }));

        let idx = -1;

        if (draft.validation.valid_response) {
          idx = item.validation.valid_response.value.findIndex(val => val === oldIndex);
          if (idx !== -1) {
            draft.validation.valid_response.value[idx] = newIndex;
          }

          idx = item.validation.valid_response.value.findIndex(val => val === newIndex);
          if (idx !== -1) {
            draft.validation.valid_response.value[idx] = oldIndex;
          }
        }

        if (draft.validation.alt_responses) {
          for (let i = 0; i < item.validation.alt_responses; i++) {
            const altResponse = draft.validation.alt_responses[i];
            idx = item.validation.alt_responses[i].value.findIndex(val => val === oldIndex);
            if (idx !== -1) {
              altResponse.value[idx] = newIndex;
            }

            idx = item.validation.alt_responses[i].value.findIndex(val => val === newIndex);
            if (idx !== -1) {
              altResponse.value[idx] = oldIndex;
            }
            return altResponse;
          }
        }

        updateVariables(draft);
      })
    );
  };

  remove = index => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.hints.splice(index, 1);
        for (let i = index + 1; i < draft.hints.length; i++) {
          if (draft.variable && draft.variable.variableStatus) {
            draft.variable.variableStatus[`option-${i - 1}`] = draft.variable.variableStatus[`option-${i}`];
          }
        }
        updateVariables(draft);
      })
    );
  };

  addNewChoiceBtn = () => {
    const { item, setQuestionData, t } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.hints.push({
          value: uuid(),
          label: `${t("component.hint")} ${ALPHABET[draft.hints.length]}`
        });
      })
    );
  };

  editOptions = (index, value) => {
    const { item, setQuestionData } = this.props;
    setQuestionData(
      produce(item, draft => {
        draft.hints[index] = {
          value: item.hints[index].value,
          label: value
        };
        updateVariables(draft);
      })
    );
  };

  render() {
    const { t, item } = this.props;

    return (
      item.hints && (
        <Fragment>
          <QuillSortableList
            items={item.hints.map(o => o.label)}
            onSortEnd={this.onSortEnd}
            useDragHandle
            firstFocus={item.firstMount}
            onRemove={this.remove}
            onChange={this.editOptions}
          />

          <AddNewChoiceBtn data-cy="add-new-ch" onClick={this.addNewChoiceBtn}>
            {t("component.addANewHint")}
          </AddNewChoiceBtn>
        </Fragment>
      )
    );
  }
}

QuillSortableHintsList.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      item: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(QuillSortableHintsList);
