import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import Extras from "../../../../containers/Extras";
import WidgetOptions from "../../../../containers/WidgetOptions";
import Layout from "./Layout";

const Options = ({ onChange, uiStyle, t, outerStyle, fillSections, cleanSections }) => {
  return (
    <WidgetOptions outerStyle={outerStyle} fillSections={fillSections} cleanSections={cleanSections}>
      <Layout onChange={onChange} uiStyle={uiStyle} fillSections={fillSections} cleanSections={cleanSections} />
      <Extras fillSections={fillSections} cleanSections={cleanSections}>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  t: PropTypes.func.isRequired,
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

export default React.memo(withNamespaces("assessment")(Options));
