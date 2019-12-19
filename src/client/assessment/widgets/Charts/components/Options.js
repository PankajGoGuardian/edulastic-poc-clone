import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

import WidgetOptions from "../../../containers/WidgetOptions";
import Extras from "../../../containers/Extras";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

import LayoutsComponent from "./LayoutsComponent";
import GraphControls from "./GraphControls";

const Options = ({ t, fillSections, cleanSections, advancedAreOpen, item }) => {
  const leftSideProp = {
    fillSections,
    cleanSections,
    advancedAreOpen
  };
  return (
    <WidgetOptions
      showVariables={false}
      {...leftSideProp}
      title={t("common.options.title")}
      renderExtra={<GraphControls {...leftSideProp} />}
      item={item}
    >
      <LayoutsComponent {...leftSideProp} />

      <Extras {...leftSideProp}>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

Options.propTypes = {
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Options.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
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

export default enhance(Options);
