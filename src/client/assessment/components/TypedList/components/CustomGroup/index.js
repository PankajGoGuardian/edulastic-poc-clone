import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { MathKeyboard } from "@edulastic/common";

import NumberPad from "../../../NumberPad";

import { IconTrash } from "../../styled/IconTrash";
import { Row } from "./styled/Row";
import { Col } from "./styled/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { TextInputStyled } from "../../../../styled/InputStyles";

const CustomGroup = ({ onChange, onRemove, value, t }) => {
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
    <Fragment>
      <Row gutter={24}>
        <Col span={12}>
          <Label>{t("component.options.label")}</Label>
          <TextInputStyled
            onChange={e => handleChangeValue("label", e.target.value)}
            value={value.label}
            size="large"
          />
        </Col>
        <Col span={12}>
          <Label>{t("component.options.title")}</Label>
          <TextInputStyled
            onChange={e => handleChangeValue("title", e.target.value)}
            value={value.title}
            size="large"
          />
        </Col>
        <IconTrash onClick={onRemove} width={40} height={40} />
      </Row>
      <Row>
        <NumberPad onChange={handleChangeNumberPad} items={getNumberPad()} characterMapButtons={makeCharacterMap()} />
      </Row>
    </Fragment>
  );
};

CustomGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  value: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(CustomGroup);
