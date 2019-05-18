import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

import WidgetOptions from "../../../containers/WidgetOptions";
import Extras from "../../../containers/Extras";
import { setQuestionDataAction } from "../../../../author/src/actions/question";
import { getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";
import LayoutWrapper from "./Layout";

const Options = ({ item, setQuestionData, advancedAreOpen, fillSections, cleanSections, t }) => (
  <WidgetOptions
    title={t("common.options.title")}
    advancedAreOpen={advancedAreOpen}
    fillSections={fillSections}
    cleanSections={cleanSections}
  >
    <LayoutWrapper
      item={item}
      setQuestionData={setQuestionData}
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
    />
    <Extras advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

Options.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
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