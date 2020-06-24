import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";
import { cloneDeep, get, keys } from "lodash";
import uuid from "uuid/v4";
import { withNamespaces } from "@edulastic/localization";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import QuillSortableList from "../../components/QuillSortableList";
import { Subtitle } from "../../styled/Subtitle";

import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import withAddButton from "../../components/HOC/withAddButton";
import { getFontSize } from "../../utils/helpers";
import { updateVariables } from "../../utils/variables";
import Question from "../../components/Question";

const List = withAddButton(QuillSortableList);

const convertArrToObj = arr => arr.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.value }), {});

class ListComponent extends Component {
  render() {
    const { item, t, setQuestionData, fillSections, cleanSections, getContainer } = this.props;

    const fontSize = getFontSize(get(item, "uiStyle.fontsize", "normal"));
    const list = get(item, "list", {});
    const listToShow = keys(list).map(key => ({ id: key, value: list[key] }));

    const onSortOrderListEnd = ({ oldIndex, newIndex }) => {
      const newData = cloneDeep(item);
      newData.list = convertArrToObj(arrayMove(listToShow, oldIndex, newIndex));
      setQuestionData(newData);
    };

    const handleQuestionsChange = (index, value) => {
      const editedOption = { ...listToShow[index], value };
      listToShow.splice(index, 1, editedOption);
      const newData = cloneDeep(item);
      newData.list = convertArrToObj(listToShow);
      updateVariables(newData);
      setQuestionData(newData);
    };

    const handleDeleteQuestion = index => {
      setQuestionData(
        produce(item, draft => {
          listToShow.splice(index, 1);
          draft.list = convertArrToObj(listToShow);

          const validRes = keys(draft.list).reduce((acc, curr, currIndex) => ({ ...acc, [curr]: currIndex }), {});
          draft.validation.validResponse.value = validRes;

          draft.validation.altResponses = draft.validation.altResponses.map(res => {
            res.value = validRes;
            return res;
          });

          updateVariables(draft);
        })
      );
    };

    const handleAddQuestion = () => {
      setQuestionData(
        produce(item, draft => {
          const newId = uuid();
          draft.list = { ...draft.list, [newId]: "" };
          draft.validation.validResponse.value = {
            ...draft.validation.validResponse.value,
            [newId]: keys(draft.list).length - 1
          };

          if (draft.validation.altResponses.length) {
            draft.validation.altResponses = draft.validation.altResponses.map(res => {
              res.value = {
                ...res.value,
                [newId]: keys(draft.list).length - 1
              };
              return res;
            });
          }
        })
      );
    };

    if (!item || !getContainer()) return null;

    return (
      <Question
        section="main"
        label={t("component.orderlist.list")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.orderlist.list")}`)} data-cy="list-container">
          {t("component.orderlist.list")}
        </Subtitle>
        <List
          fontSize={fontSize}
          onAdd={handleAddQuestion}
          items={listToShow.map(ite => ite.value)}
          onSortEnd={onSortOrderListEnd}
          useDragHandle
          styleType="button"
          lockToContainerEdges
          lockOffset={["10%", "10%"]}
          onRemove={handleDeleteQuestion}
          onChange={handleQuestionsChange}
          fillSections={fillSections}
          cleanSections={cleanSections}
          getContainer={getContainer}
        />
      </Question>
    );
  }
}

ListComponent.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  getContainer: PropTypes.func.isRequired,
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
