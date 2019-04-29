import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

import WidgetOptions from "../../../containers/WidgetOptions";

import Layout from "./Layout";
import Extras from "../../../containers/Extras";

const Options = ({ questionData, onChange, uiStyle, outerStyle, fillSections, cleanSections }) => (
  <WidgetOptions outerStyle={outerStyle} fillSections={fillSections} cleanSections={cleanSections}>
    <Layout
      questionData={questionData}
      onChange={onChange}
      uiStyle={uiStyle}
      fillSections={fillSections}
      cleanSections={cleanSections}
    />
    <Extras fillSections={fillSections} cleanSections={cleanSections}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

Options.propTypes = {
  questionData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  outerStyle: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Options.defaultProps = {
  outerStyle: {},
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      questionData: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(Options);
