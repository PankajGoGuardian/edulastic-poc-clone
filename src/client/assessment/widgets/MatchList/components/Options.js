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

const Options = ({ item, t, setQuestionData, fillSections, cleanSections }) => {
  return (
    <WidgetOptions title={t("common.options.title")} fillSections={fillSections} cleanSections={cleanSections}>
      <LayoutWrapper
        item={item}
        setQuestionData={setQuestionData}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />
      <Extras fillSections={fillSections} cleanSections={cleanSections}>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

Options.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Options.defaultProps = {
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
