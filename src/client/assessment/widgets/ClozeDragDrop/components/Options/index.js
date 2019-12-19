import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import Extras from "../../../../containers/Extras";
import WidgetOptions from "../../../../containers/WidgetOptions";
import Layout from "./Layout";

const Options = ({
  onChange,
  uiStyle,
  outerStyle,
  fillSections,
  cleanSections,
  advancedAreOpen,
  responseIDs,
  item
}) => (
  <WidgetOptions
    outerStyle={outerStyle}
    fillSections={fillSections}
    cleanSections={cleanSections}
    advancedAreOpen={advancedAreOpen}
    item={item}
  >
    <Layout
      onChange={onChange}
      uiStyle={uiStyle}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
      responseIDs={responseIDs}
      questionType={item?.title}
    />
    <Extras fillSections={fillSections} cleanSections={cleanSections} advancedAreOpen={advancedAreOpen}>
      <Extras.Distractors />
      <Extras.Hints />
    </Extras>
  </WidgetOptions>
);

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  responseIDs: PropTypes.array,
  outerStyle: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

Options.defaultProps = {
  outerStyle: {},
  responseIDs: [],
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemNumeration: "",
    widthpx: 140,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default React.memo(withNamespaces("assessment")(Options));
