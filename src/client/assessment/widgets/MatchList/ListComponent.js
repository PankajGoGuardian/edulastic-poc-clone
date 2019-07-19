import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { arrayMove } from "react-sortable-hoc";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import withAddButton from "../../components/HOC/withAddButton";
import QuillSortableList from "../../components/QuillSortableList";
import { Subtitle } from "../../styled/Subtitle";
import { updateVariables } from "../../utils/variables";
import { Widget } from "../../styled/Widget";

import { IMAGE_LIST_DEFAULT_WIDTH } from ".";

const List = withAddButton(QuillSortableList);

class ListComponent extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.matchList.list"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t } = this.props;

    const handleAdd = () => {
      setQuestionData(
        produce(item, draft => {
          draft.list.push(null);
          draft.validation.valid_response.value.push(null);

          if (draft.validation.alt_responses.length > 0) {
            draft.validation.alt_responses.forEach(altResponse => {
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

          draft.validation.valid_response.value.splice(index, 1);

          if (draft.validation.alt_responses.length > 0) {
            draft.validation.alt_responses.forEach(altResponse => {
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
      <Widget>
        <Subtitle data-cy="list-container">{t("component.matchList.list")}</Subtitle>
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
      </Widget>
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
