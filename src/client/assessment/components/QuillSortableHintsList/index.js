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

import { CustomStyleBtn } from "../../styled/ButtonStyles";
import { ALPHABET } from "../../widgets/MultipleChoice/constants/alphabet";
import { updateVariables } from "../../utils/variables";
import { Label } from "../../styled/WidgetOptions/Label";

class QuillSortableHintsList extends Component {
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props;

    setQuestionData(
      produce(item, draft => {
        draft.hints = arrayMove(draft.hints, oldIndex, newIndex).map(({ label }, index) => ({
          value: index,
          label
        }));
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
          label: ""
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

    if (!item.hints) return "";

    return (
      <Fragment>
        <Label data-cy="hints">{t("component.options.hints")}</Label>
        <QuillSortableList
          items={item.hints.map(o => o.label)}
          onSortEnd={this.onSortEnd}
          prefix={"hints"}
          useDragHandle
          placeholder={t("component.enterHintForTheProblem")}
          defaultLabel={false}
          firstFocus={item.firstMount}
          onRemove={this.remove}
          onChange={this.editOptions}
        />

        <CustomStyleBtn data-cy="add-new-ch" onClick={this.addNewChoiceBtn}>
          {t("component.addANewHint")}
        </CustomStyleBtn>
      </Fragment>
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
