import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import produce from "immer";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";

import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { withNamespaces } from "@edulastic/localization";
import { IMAGE_LIST_DEFAULT_WIDTH } from "@edulastic/constants/const/imageConstants";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import withAddButton from "../../components/HOC/withAddButton";
import QuillSortableList from "../../components/QuillSortableList";
import { Subtitle } from "../../styled/Subtitle";
import { updateVariables } from "../../utils/variables";
import Question from "../../components/Question";

const List = withAddButton(QuillSortableList);

class ListComponent extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props;

    const handleAdd = () => {
      setQuestionData(
        produce(item, draft => {
          draft.list.push(null);
          draft.validation.validResponse.value.push(null);

          if (draft.validation.altResponses.length > 0) {
            draft.validation.altResponses.forEach(altResponse => {
              altResponse.value.push(null);
            });
          }

          updateVariables(draft);
        })
      );
    };

    const handleRemove = index => {
      setQuestionData(
        produce(item, draft => {
          draft.list.splice(index, 1);

          draft.validation.validResponse.value.splice(index, 1);

          if (draft.validation.altResponses.length > 0) {
            draft.validation.altResponses.forEach(altResponse => {
              altResponse.value.splice(index, 1);
            });
          }

          updateVariables(draft);
        })
      );
    };
    const handleSortEnd = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.list = arrayMove(item.list, oldIndex, newIndex);
          updateVariables(draft);
        })
      );
    };

    const handleChange = (index, value) => {
      setQuestionData(
        produce(item, draft => {
          draft.list[index] = value;
          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.matchList.list")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.matchList.list")}`)} data-cy="list-container">
          {t("component.matchList.list")}
        </Subtitle>
        <ListContainer>
          <List
            buttonText={t("component.matchList.addNew")}
            items={item.list}
            onAdd={handleAdd}
            firstFocus={item.firstMount}
            onSortEnd={handleSortEnd}
            onChange={handleChange}
            onRemove={handleRemove}
            useDragHandle
            columns={1}
            imageDefaultWidth={IMAGE_LIST_DEFAULT_WIDTH}
          />
        </ListContainer>
      </Question>
    );
  }
}

ListComponent.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

ListComponent.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(
  connect(
    null,
    { setQuestionData: setQuestionDataAction }
  )(ListComponent)
);

const ListContainer = styled.div`
  & .katex .base {
    white-space: normal;
    width: fit-content;
  }
`;
