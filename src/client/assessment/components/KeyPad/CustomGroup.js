import React from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { MathKeyboard } from "@edulastic/common";

import NumberPad from "../NumberPad";

const CustomGroup = ({ onChange, value, buttonStyle, t }) => {
  const handleChangeValue = (field, val) => {
    const newValue = cloneDeep(value);
    newValue[field] = val;
    onChange(newValue);
  };

  const makeCharacterMap = () =>
    [{ value: "", label: t("component.options.empty") }].concat(
      MathKeyboard.KEYBOARD_BUTTONS.map(button => ({
        value: button.handler,
        label: button.label
      }))
    );

  const getNumberPad = () =>
    value.value.map(num => {
      let res = MathKeyboard.KEYBOARD_BUTTONS.find(({ handler }) => num === handler);

      if (res) {
        res = {
          value: res.handler,
          label: res.label
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
  buttonStyle: PropTypes.object,
  t: PropTypes.func.isRequired
};

CustomGroup.defaultProps = {
  buttonStyle: {}
};

export default withNamespaces("assessment")(CustomGroup);
