import React, { Component } from "react";
import PropTypes from "prop-types";
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
import Question from "../../components/Question";

class FormattingOptions extends Component {
  render() {
    const { item, setQuestionData, act, t, fillSections, cleanSections } = this.props;

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
      <Question
        section="main"
        label={t("component.essayText.rich.formattingOptions")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
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
      </Question>
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
