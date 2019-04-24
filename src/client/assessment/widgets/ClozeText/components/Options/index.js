import React from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import WidgetOptions from "../../../../containers/WidgetOptions";
import Extras from "../../../../containers/Extras";
import Layout from "../../Layout";

const Options = ({ onChange, uiStyle, multipleLine, outerStyle }) => {
  return (
    <WidgetOptions outerStyle={outerStyle}>
      <Layout onChange={onChange} uiStyle={uiStyle} multipleLine={multipleLine} />
      <Extras>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

Options.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object,
  outerStyle: PropTypes.object,
  multipleLine: PropTypes.bool
};

Options.defaultProps = {
  outerStyle: {},
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "",
    widthpx: 0,
    heightpx: 0,
    placeholder: "",
    responsecontainerindividuals: []
  },
  multipleLine: false
};

export default React.memo(withNamespaces("assessment")(Options));
