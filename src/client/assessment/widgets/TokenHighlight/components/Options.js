import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "react-i18next";

import WidgetOptions from "../../../containers/WidgetOptions";
import Extras from "../../../containers/Extras";
import { getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

import LayoutComponent from "./LayoutComponent";

const Options = ({ item, t, fillSections, cleanSections, advancedAreOpen }) => (
  <WidgetOptions
    title={t("common.options.title")}
    advancedAreOpen={advancedAreOpen}
    fillSections={fillSections}
    cleanSections={cleanSections}
  >
    <LayoutComponent
      item={item}
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
    />

    <Extras advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections}>
      <Extras.Distractors advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
      <Extras.Hints advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections} />
    </Extras>
  </WidgetOptions>
);

Options.propTypes = {
  t: PropTypes.func.isRequired,
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
    null
  )
);

export default enhance(Options);
