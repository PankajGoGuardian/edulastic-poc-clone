import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { cloneDeep } from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { typedList as typedListTypes } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { updateVariables } from "../../utils/variables";

import TypedList from "../../components/TypedList";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

class TextFormattingOptions extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleAddOption = () => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle.textFormattingOptions.push("");
        })
      );
    };

    const onSortOrderListEnd = ({ oldIndex, newIndex }) => {
      const newData = cloneDeep(item);
      newData.uiStyle.textFormattingOptions = arrayMove(newData.uiStyle.textFormattingOptions, oldIndex, newIndex);
      setQuestionData(newData);
    };

    const handleDeleteQuestion = index => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle.textFormattingOptions.splice(index, 1);
          updateVariables(draft);
        })
      );
    };

    const handleQuestionsChange = (index, value) => {
      setQuestionData(
        produce(item, draft => {
          draft.uiStyle.textFormattingOptions[index] = value;
          updateVariables(draft);
        })
      );
    };

    const selectData = [
      { value: "", label: "" },
      { value: "bold", label: t("component.math.bold") },
      { value: "italic", label: t("component.math.italic") },
      { value: "underline", label: t("component.math.underline") },
      { value: "removeFormat", label: t("component.math.clearFormatting") },
      { value: "unorderedList", label: t("component.math.bulletList") },
      { value: "orderedList", label: t("component.math.numberedList") },
      { value: "superscript", label: t("component.math.superscript") },
      { value: "subscript", label: t("component.math.subscript") }
    ];

    return (
      <Question
        section="main"
        label={t("component.math.textFormattingOptions")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.math.textFormattingOptions")}`)}>
          {t("component.math.textFormattingOptions")}
        </Subtitle>
        <TypedList
          columns={2}
          buttonText={t("component.math.add")}
          selectData={selectData}
          type={typedListTypes.SELECT}
          onAdd={handleAddOption}
          items={item.uiStyle.textFormattingOptions}
          onSortEnd={onSortOrderListEnd}
          onRemove={handleDeleteQuestion}
          onChange={handleQuestionsChange}
        />
      </Question>
    );
  }
}

TextFormattingOptions.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

TextFormattingOptions.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {}
};

export default compose(
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
)(TextFormattingOptions);
