import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { withNamespaces } from "@edulastic/localization";
import { evaluationType } from "@edulastic/constants";

import WidgetOptions from "../../../containers/WidgetOptions";
import Layout from "./Layout";
import Extras from "../../../containers/Extras";

class MathFormulaOptions extends Component {
  render() {
    const {
      onChange,
      uiStyle,
      t,
      responseContainers,
      textBlocks,
      item,
      fillSections,
      cleanSections,
      advancedAreOpen
    } = this.props;

    const scoringTypes = [
      {
        value: evaluationType.EXACT_MATCH,
        label: t("component.math.exactMatch")
      }
    ];

    return (
      <WidgetOptions
        scoringTypes={scoringTypes}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Layout
          onChange={onChange}
          uiStyle={uiStyle}
          responseContainers={responseContainers}
          textBlocks={textBlocks}
          item={item}
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
  }
}

MathFormulaOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  responseContainers: PropTypes.array,
  t: PropTypes.func.isRequired,
  textBlocks: PropTypes.array,
  uiStyle: PropTypes.object,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

MathFormulaOptions.defaultProps = {
  responseContainers: [],
  textBlocks: [],
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 0,
    orientation: "horizontal",
    choice_label: "number"
  },
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(MathFormulaOptions);
