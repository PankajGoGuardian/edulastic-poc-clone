import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";
import { cloneDeep, findIndex, isObject, difference } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { evaluationType, questionType } from "@edulastic/constants";
import { MathKeyboard } from "@edulastic/common";

import Layout from "./Layout";
import ResponseContainers from "./ResponseContainers";
import CustomKeys from "./CustomKeys";

import WidgetOptions from "../../../containers/WidgetOptions";
import Extras from "../../../containers/Extras";
import KeyPadOptions from "../../../components/KeyPadOptions";

const MathFormulaOptions = ({
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
}) => {
  useEffect(() => {
    if (item.showDropdown) {
      const keypadMode = item.symbols[0];
      if (isObject(keypadMode)) {
        return;
      }
      const _keys = MathKeyboard.KEYBOARD_BUTTONS.filter(btn => btn.types.includes(keypadMode)).map(btn => btn.label);
      const diffKeys = difference(customKeys, _keys);
      onChange("custom_keys", _keys.concat(diffKeys));
    }
  }, [item.showDropdown, item.symbols]);
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

  const addResponseContainer = () => {
    const { responseIds } = item;
    const ind = responseContainers.length;
    let obj = {};
    // eslint-disable-next-line no-labels
    outerLoop: if (responseIds) {
      // eslint-disable-next-line guard-for-in
      for (const key in responseIds) {
        const responses = responseIds[key];
        for (const response of responses) {
          if (response.index === ind) {
            obj = { ...response };
            // eslint-disable-next-line no-labels
            break outerLoop;
          }
        }
      }
    }
    onChange("responseContainers", [...responseContainers, obj]);
  };

  const changeResponseContainers = ({ index, prop, value }) => {
    const newContainers = cloneDeep(responseContainers);
    const ind = findIndex(newContainers, cont => cont.index === index);
    if (ind !== -1) {
      newContainers[ind][prop] = value;
      onChange("responseContainers", newContainers);
    }
  };

  const deleteResponseContainer = index => {
    const newContainers = cloneDeep(responseContainers);
    newContainers.splice(index, 1);
    onChange("responseContainers", newContainers);
  };
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

      <ResponseContainers
        containers={responseContainers}
        onChange={changeResponseContainers}
        onAdd={addResponseContainer}
        onDelete={deleteResponseContainer}
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
        renderExtra={
          <CustomKeys
            blocks={customKeys}
            onChange={changeCustomKey}
            onAdd={addCustomKey}
            onDelete={deleteCustomKey}
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        }
      />

      <Extras advancedAreOpen={advancedAreOpen} fillSections={fillSections} cleanSections={cleanSections}>
        <Extras.Distractors />
        <Extras.Hints />
      </Extras>
    </WidgetOptions>
  );
};

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
