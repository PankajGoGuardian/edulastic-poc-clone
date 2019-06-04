import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { arrayMove } from "react-sortable-hoc";

import { withNamespaces } from "@edulastic/localization";
import { updateVariables } from "../../utils/variables";

import withAddButton from "../../components/HOC/withAddButton";
import QuillSortableList from "../../components/QuillSortableList/index";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

const List = withAddButton(QuillSortableList);

class ListComponent extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.sortList.list"), node.offsetTop, node.scrollHeight);
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
          draft.source.push("");
          draft.validation.valid_response.value.push(draft.source.length - 1);
          draft.validation.alt_responses.forEach(ite => {
            ite.value.push(draft.source.length - 1);
          });
        })
      );
    };

    const handleRemove = index => {
      setQuestionData(
        produce(item, draft => {
          draft.source.splice(index, 1);
          draft.validation.valid_response.value.splice(
            draft.validation.valid_response.value.indexOf(draft.source.length),
            1
          );
          draft.validation.alt_responses.forEach(ite => {
            ite.value.splice(ite.value.indexOf(draft.source.length), 1);
          });

          updateVariables(draft);
        })
      );
    };

    const handleSortEnd = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.source = arrayMove(item.source, oldIndex, newIndex);
        })
      );
    };

    const handleChange = (index, value) => {
      setQuestionData(
        produce(item, draft => {
          draft.source[index] = value;
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.sortList.list")}</Subtitle>
        <List
          items={item.source}
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

export default withNamespaces("assessment")(ListComponent);
