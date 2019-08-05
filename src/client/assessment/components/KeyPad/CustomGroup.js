import React from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { MathKeyboard } from "@edulastic/common";

import NumberPad from "../NumberPad";

const CustomGroup = ({ onChange, value, customKeys, buttonStyle, t }) => {
  const handleChangeValue = (field, val) => {
    const newValue = cloneDeep(value);
    newValue[field] = val;
    onChange(newValue);
  };

  const makeCharacterMap = () => {
    const customBtns = [{ value: "", label: t("component.options.empty") }].concat(
      customKeys.map(key => ({ value: key, label: key }))
    );
    return customBtns.concat(
      MathKeyboard.KEYBOARD_BUTTONS.map(button => ({
        value: button.handler,
        label: button.label
      }))
    );
  };

  const getNumberPad = () =>
    value.value.map(num => {
      let res = MathKeyboard.KEYBOARD_BUTTONS.find(({ handler }) => num === handler);
      const isCustom = customKeys.find(key => key === num);

      if (res) {
        res = {
          value: res.handler,
          label: res.label
        };
      } else if (isCustom) {
        res = {
          value: num,
          label: num
        };
      }

      return res || { value: "", label: t("component.options.empty") };
    });

  const handleChangeNumberPad = (index, val) => {
    const numberPad = value.value ? [...value.value] : [];

    numberPad[index] = val;
    handleChangeValue("value", numberPad);
  };

  return (
    <NumberPad
      onChange={handleChangeNumberPad}
      items={getNumberPad()}
      characterMapButtons={makeCharacterMap()}
      buttonStyle={buttonStyle}
    />
  );
};

CustomGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  customKeys: PropTypes.array.isRequired,
  buttonStyle: PropTypes.object,
  t: PropTypes.func.isRequired
};

CustomGroup.defaultProps = {
  buttonStyle: {}
};

export default withNamespaces("assessment")(CustomGroup);
