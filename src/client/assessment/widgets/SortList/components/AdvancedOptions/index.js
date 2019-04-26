import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

import WidgetOptions from "../../../../containers/WidgetOptions";

import Extras from "../../../../containers/Extras";
import LayoutWrapper from "./Layout";

const AdvancedOptions = ({ t, onUiChange, item }) => {
  return (
    <WidgetOptions outerStyle={{ marginTop: 40 }} title={t("common.options.title")}>
      <LayoutWrapper item={item} onUiChange={onUiChange} />
      <Extras>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

AdvancedOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onUiChange: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(AdvancedOptions);
