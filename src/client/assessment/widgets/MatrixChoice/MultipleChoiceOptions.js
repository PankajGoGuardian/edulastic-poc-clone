import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import produce from "immer";
import { arrayMove } from "react-sortable-hoc";

import { withNamespaces } from "@edulastic/localization";

import withAddButton from "../../components/HOC/withAddButton";
import QuillSortableList from "../../components/QuillSortableList";
import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";
import { updateVariables } from "../../utils/variables";
import connect from "react-redux/es/connect/connect";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { checkAnswerAction } from "../../../author/src/actions/testItem";

const List = withAddButton(QuillSortableList);

class MultipleChoiceOptions extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.matrix.multipleChoiceOptions"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, t } = this.props;

    const handleSortEndStems = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.stems = arrayMove(item.stems, oldIndex, newIndex);
        })
      );
    };

    const handleRemoveStem = index => {
      setQuestionData(
        produce(item, draft => {
          draft.stems.splice(index, 1);
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
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.matrix.multipleChoiceOptions")}</Subtitle>
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
      </Widget>
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
