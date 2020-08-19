import React, { Component } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { connect } from "react-redux";

import { arrayMove } from "react-sortable-hoc";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";

import SortableList from "./components/SortableList";
import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

class FormattingOptions extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections, advancedAreOpen } = this.props;
    const handleActiveChange = index => {
      setQuestionData(
        produce(item, draft => {
          draft.formattingOptions[index].active = !draft.formattingOptions[index].active;
        })
      );
    };

    const handleChange = ({ oldIndex, newIndex }) => {
      setQuestionData(
        produce(item, draft => {
          draft.formattingOptions = arrayMove(draft.formattingOptions, oldIndex, newIndex);
        })
      );
    };

    return (
      <Question
        section="advanced"
        label={t("component.essayText.rich.formattingOptions")}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.essayText.rich.formattingOptions")}`)}>
          {t("component.essayText.rich.formattingOptions")}
        </Subtitle>
        <SortableList
          useDragHandle
          axis="xy"
          onSortEnd={handleChange}
          items={item.formattingOptions || []}
          handleActiveChange={handleActiveChange}
        />
      </Question>
    );
  }
}

FormattingOptions.propTypes = {
  item: PropTypes.object.isRequired,
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
