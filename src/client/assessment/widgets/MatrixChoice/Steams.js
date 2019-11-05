import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import { withRouter } from "react-router-dom";

import { withNamespaces } from "@edulastic/localization";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import withAddButton from "../../components/HOC/withAddButton";
import Question from "../../components/Question";
import QuillSortableList from "../../components/QuillSortableList";
import { Subtitle } from "../../styled/Subtitle";

import { checkAnswerAction } from "../../../author/src/actions/testItem";

const List = withAddButton(QuillSortableList);

class Steams extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleChangeOption = (index, value) => {
      setQuestionData(
        produce(item, draft => {
          draft.options[index] = value;
          updateVariables(draft);
        })
      );
    };

    const reduceResponseValue = (val, index) => {
      if (!val) return val;

      val = val.filter(i => i !== index);
      if (!val.length) {
        return null;
      }

      return val;
    };

    const handleRemoveOption = index => {
      setQuestionData(
        produce(item, draft => {
          draft.options.splice(index, 1);
          draft.validation.validResponse.value = draft.validation.validResponse.value.map(val =>
            reduceResponseValue(val, index)
          );

          if (draft.validation.altResponses && draft.validation.altResponses.length) {
            draft.validation.altResponses.map(res => {
              res.value = res.value.map(val => reduceResponseValue(val, index));
              return res;
            });
          }
          updateVariables(draft);
        })
      );
    };

    const handleAddOption = () => {
      setQuestionData(
        produce(item, draft => {
          draft.options.push("");
        })
      );
    };

    const handleSortEndOptions = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.options = arrayMove(item.options, oldIndex, newIndex);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.matrix.stems")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.matrix.stems")}</Subtitle>
        <List
          items={item.options}
          onSortEnd={handleSortEndOptions}
          useDragHandle
          onRemove={handleRemoveOption}
          onChange={handleChangeOption}
          onAdd={handleAddOption}
          columns={1}
          prefix="list2"
        />
      </Question>
    );
  }
}

Steams.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Steams.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
)(Steams);
