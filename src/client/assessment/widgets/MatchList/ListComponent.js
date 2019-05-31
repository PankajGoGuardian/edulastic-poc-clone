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

import { Widget } from "../../styled/Widget";

const List = withAddButton(QuillSortableList);

class ListComponent extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.matchList.list"), node.offsetTop);
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
          draft.list.push("");
        })
      );
    };

    const handleRemove = index => {
      setQuestionData(
        produce(item, draft => {
          draft.list.splice(index, 1);
        })
      );
    };
    const handleSortEnd = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.list = arrayMove(item.list, oldIndex, newIndex);
        })
      );
    };

    const handleChange = (index, value) => {
      setQuestionData(
        produce(item, draft => {
          draft.list[index] = value;
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
