import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { cloneDeep, get } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import QuillSortableList from "../../components/QuillSortableList";
import { Subtitle } from "../../styled/Subtitle";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import withAddButton from "../../components/HOC/withAddButton";
import { getFontSize } from "../../utils/helpers";
import { updateVariables } from "../../utils/variables";
import Question from "../../components/Question";

const List = withAddButton(QuillSortableList);

class ListComponent extends Component {
  render() {
    const { item, t, setQuestionData, fillSections, cleanSections, saveAnswer } = this.props;

    const fontSize = getFontSize(get(item, "ui_style.fontsize", "normal"));

    const onSortOrderListEnd = ({ oldIndex, newIndex }) => {
      const newData = cloneDeep(item);

      newData.list = arrayMove(item.list, oldIndex, newIndex);

      setQuestionData(newData);
    };

    const handleQuestionsChange = (value, index) => {
      const newData = cloneDeep(item);

      newData.list[value] = index;
      updateVariables(newData);
      setQuestionData(newData);
    };

    const handleDeleteQuestion = index => {
      setQuestionData(
        produce(item, draft => {
          draft.list = draft.list.filter((q, i) => i !== index);

          const indexList = draft.list.map((val, i) => i);

          draft.validation.valid_response.value = indexList;

          draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
            res.value = indexList;
            return res;
          });

          saveAnswer(indexList);
          updateVariables(draft);
        })
      );
    };

    const handleAddQuestion = () => {
      setQuestionData(
        produce(item, draft => {
          draft.list = [...item.list, ""];
          draft.validation.valid_response.value = [
            ...draft.validation.valid_response.value,
            draft.validation.valid_response.value.length
          ];

          if (draft.validation.alt_responses.length) {
            draft.validation.alt_responses = draft.validation.alt_responses.map(res => {
              res.value.push(res.value.length);
              return res;
            });
          }

          saveAnswer(draft.list.map((q, i) => i));
        })
      );
    };

    if (!item) return null;

    return (
      <Question
        section="main"
        label={t("component.orderlist.list")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle data-cy="list-container">{t("component.orderlist.list")}</Subtitle>
        <List
          fontSize={fontSize}
          onAdd={handleAddQuestion}
          items={item.list}
          onSortEnd={onSortOrderListEnd}
          useDragHandle
          onRemove={handleDeleteQuestion}
          onChange={handleQuestionsChange}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />
      </Question>
    );
  }
}

ListComponent.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ListComponent.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
)(ListComponent);
