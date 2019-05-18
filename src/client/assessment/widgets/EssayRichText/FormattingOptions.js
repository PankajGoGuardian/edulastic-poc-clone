import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import produce from "immer";
import ReactQuill from "react-quill";
import { compose } from "redux";
import { connect } from "react-redux";

import { arrayMove } from "react-sortable-hoc";

import { withNamespaces } from "@edulastic/localization";

import { updateVariables } from "../../utils/variables";

import SortableList from "./components/SortableList";
import { Subtitle } from "../../styled/Subtitle";
import { ValidList } from "./constants/validList";
import { QlToolbar } from "./styled/QlToolbar";
import { Widget } from "../../styled/Widget";

class FormattingOptions extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.essayText.rich.formattingOptions"), node.offsetTop);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, setQuestionData, act, t } = this.props;

    const handleActiveChange = index => {
      setQuestionData(
        produce(item, draft => {
          draft.formatting_options[index].active = !draft.formatting_options[index].active;
          updateVariables(draft);
        })
      );
    };

    const handleChange = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.formatting_options = arrayMove(draft.formatting_options, oldIndex, newIndex);
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.essayText.rich.formattingOptions")}</Subtitle>
        <QlToolbar id="toolbar">
          <SortableList
            axis="xy"
            onSortEnd={handleChange}
            items={act}
            useDragHandle
            validList={ValidList}
            handleActiveChange={handleActiveChange}
          />
        </QlToolbar>
        <ReactQuill modules={FormattingOptions.modules} readOnly />
      </Widget>
    );
  }
}

FormattingOptions.propTypes = {
  item: PropTypes.object.isRequired,
  act: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

FormattingOptions.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

FormattingOptions.modules = {
  toolbar: {
    container: "#toolbar"
  }
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    ({ user }) => ({ user }),
    null
  )
);

export default enhance(FormattingOptions);
