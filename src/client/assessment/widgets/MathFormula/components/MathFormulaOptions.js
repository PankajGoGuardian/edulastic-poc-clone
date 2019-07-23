import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { evaluationType, questionType } from "@edulastic/constants";

import Layout from "./Layout";

import CustomKeys from "./CustomKeys";

import WidgetOptions from "../../../containers/WidgetOptions";
import Extras from "../../../containers/Extras";
import KeyPadOptions from "../../../components/KeyPadOptions";

class MathFormulaOptions extends Component {
  render() {
    const {
      onChange,
      uiStyle,
      t,
      responseContainers,
      customKeys,
      item,
      fillSections,
      cleanSections,
      advancedAreOpen,
      setKeyPadOffest
    } = this.props;

    const changeCustomKey = ({ index, value }) => {
      const newCustomKeys = cloneDeep(customKeys);
      newCustomKeys[index] = value;
      onChange("custom_keys", newCustomKeys);
    };

    const addCustomKey = () => {
      onChange("custom_keys", [...customKeys, ""]);
    };

    const deleteCustomKey = index => {
      const newCustomKeys = cloneDeep(customKeys);
      newCustomKeys.splice(index, 1);
      onChange("custom_keys", newCustomKeys);
    };

    const scoringTypes = [
      {
        value: evaluationType.EXACT_MATCH,
        label: t("component.math.exactMatch")
      }
    ];

    if (item && item.type === questionType.EXPRESSION_MULTIPART) {
      scoringTypes.push({
        value: evaluationType.PARTIAL_MATCH,
        label: t("component.math.partialMatch")
      });
    }

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
          item={item}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />

        <KeyPadOptions
          onChange={onChange}
          setKeyPadOffest={setKeyPadOffest}
          item={item}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
        />

        <CustomKeys
          blocks={customKeys}
          onChange={changeCustomKey}
          onAdd={addCustomKey}
          onDelete={deleteCustomKey}
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
  customKeys: PropTypes.array,
  uiStyle: PropTypes.object,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  setKeyPadOffest: PropTypes.func, // this needs only for units types
  cleanSections: PropTypes.func
};

MathFormulaOptions.defaultProps = {
  responseContainers: [],
  customKeys: [],
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 0,
    orientation: "horizontal",
    choice_label: "number"
  },
  advancedAreOpen: false,
  setKeyPadOffest: () => null,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  withTheme
);

export default enhance(MathFormulaOptions);
