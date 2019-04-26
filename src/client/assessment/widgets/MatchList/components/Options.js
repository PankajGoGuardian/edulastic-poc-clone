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

const Options = ({ item, t, setQuestionData }) => {
  return (
    <WidgetOptions title={t("common.options.title")}>
      <LayoutWrapper item={item} setQuestionData={setQuestionData} />
      <Extras>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

Options.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
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
