import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";
import uuid from "uuid/v4";
import { flattenDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import withAddButton from "../../components/HOC/withAddButton";
import QuillSortableList from "../../components/QuillSortableList";
import Question from "../../components/Question";
import { Subtitle } from "../../styled/Subtitle";
import { updateVariables } from "../../utils/variables";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { checkAnswerAction } from "../../../author/src/actions/testItem";

const List = withAddButton(QuillSortableList);

class MultipleChoiceOptions extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleSortEndStems = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.stems = arrayMove(item.stems, oldIndex, newIndex);
          draft.responseIds = arrayMove(draft.responseIds, oldIndex, newIndex);
        })
      );
    };

    const handleRemoveStem = index => {
      setQuestionData(
        produce(item, draft => {
          draft.stems.splice(index, 1);
          const removed = draft.responseIds.splice(index, 1);

          flattenDeep(removed).forEach(id => {
            delete draft.validation.validResponse.value[id];
            if (draft.validation.altResponses && draft.validation.altResponses.length) {
              draft.validation.altResponses.map(res => {
                delete res.value[id];
                return res;
              });
            }
          });
        })
      );
    };

    const handleChangeStem = (index, value) => {
      setQuestionData(
        produce(item, draft => {
          draft.stems[index] = value;
          updateVariables(draft);
        })
      );
    };

    const handleAddStem = () => {
      setQuestionData(
        produce(item, draft => {
          draft.stems.push("");
          draft.responseIds.push(draft.options.map(() => uuid()));
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.matrix.multipleChoiceOptions")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.matrix.multipleChoiceOptions")}`)}>
          {t("component.matrix.multipleChoiceOptions")}
        </Subtitle>
        <List
          items={item.stems}
          onSortEnd={handleSortEndStems}
          useDragHandle
          onRemove={handleRemoveStem}
          onChange={handleChangeStem}
          onAdd={handleAddStem}
          columns={1}
          prefix="list1"
        />
      </Question>
    );
  }
}

MultipleChoiceOptions.propTypes = {
  item: PropTypes.object,
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

MultipleChoiceOptions.defaultProps = {
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
)(MultipleChoiceOptions);
