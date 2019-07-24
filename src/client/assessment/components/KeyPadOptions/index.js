/* eslint-disable react/no-find-dom-node */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Select, Input } from "antd";
import { isObject } from "lodash";
import { math } from "@edulastic/constants";
import { MathKeyboard, Keyboard, FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { numBtnColors } from "@edulastic/colors";

import NumberPad from "../NumberPad";
import KeyPad from "../KeyPad";
import Question from "../Question";
import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";
import { StyledRow } from "./styled/StyledRow";

const defaultNumberPad = [
  "1",
  "2",
  "3",
  "+",
  "4",
  "5",
  "6",
  "-",
  "7",
  "8",
  "9",
  "\\times",
  "0",
  ".",
  "divide",
  "\\div"
];
class KeyPadOptions extends Component {
  getNumberPad = isCustom => {
    const { item, onChange, t } = this.props;
    if (!item.numberPad || !item.numberPad.length) {
      onChange("numberPad", MathKeyboard.NUMBER_PAD_ITEMS.map(({ value }) => value));
      return MathKeyboard.NUMBER_PAD_ITEMS;
    }

    if (item.numberPad.filter(num => num === "").length && !isCustom) {
      onChange("numberPad", defaultNumberPad);
      return defaultNumberPad;
    }

    return item.numberPad.map(num => {
      const res = MathKeyboard.NUMBER_PAD_ITEMS.find(({ value }) => num === value);

      return res || { value: "", label: t("component.options.empty") };
    });
  };

  handleSymbolsChange = value => {
    const { item, onChange } = this.props;
    const data = [...item.symbols];

    if (value === "custom") {
      data[0] = {
        label: "label",
        title: "",
        value: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
      };
    } else {
      data[0] = value;
    }

    onChange("symbols", data);
  };

  handleChangeNumberPad = (index, value) => {
    const { item, onChange } = this.props;
    const numberPad = item.numberPad ? [...item.numberPad] : [];

    numberPad[index] = value;
    onChange("numberPad", numberPad);
  };

  handleCustomSymboleLabel = label => {
    const { item, onChange } = this.props;
    const data = [...item.symbols];
    data[0].label = label;
    onChange("symbols", data);
  };

  render() {
    const { item, onChange, advancedAreOpen, fillSections, cleanSections, t } = this.props;
    const symbol = item.symbols[0];
    const isCustom = isObject(symbol);

    const symbolsData = [{ value: "custom", label: t("component.options.addCustom") }, ...math.symbols];

    const btnStyle = isCustom
      ? {
          color: numBtnColors.color,
          borderColor: numBtnColors.borderColor,
          backgroundColor: numBtnColors.backgroundColor
        }
      : {};

    return (
      <Question
        section="advanced"
        label={t("component.options.keypad")}
        advancedAreOpen={advancedAreOpen}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.options.keypad")}</Subtitle>

        <StyledRow gutter={60}>
          <Col span={12}>
            <Label>{t("component.options.defaultMode")}</Label>
            <Select
              size="large"
              value={isCustom ? "custom" : symbol}
              style={{ width: "100%" }}
              onChange={this.handleSymbolsChange}
              data-cy="text-formatting-options-select"
            >
              {symbolsData.map(({ value: val, label }) => (
                <Select.Option key={val} value={val} data-cy={`text-formatting-options-selected-${val}`}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12} />
        </StyledRow>

        {isCustom && (
          <StyledRow gutter={60}>
            <Col span={12}>
              <div>{t("component.options.label")}</div>
              <Input
                style={{ width: "100%" }}
                onChange={e => this.handleCustomSymboleLabel(e.target.value)}
                value={symbol.label}
                size="large"
              />
            </Col>
          </StyledRow>
        )}

        <StyledRow gutter={60}>
          <Col span={24}>
            <FlexContainer justifyContent="flex-start">
              {symbol === "qwerty" && <Keyboard onInput={() => {}} />}
              {symbol !== "qwerty" && (
                <>
                  <NumberPad
                    onChange={this.handleChangeNumberPad}
                    items={this.getNumberPad(isCustom)}
                    buttonStyle={btnStyle}
                  />
                  <KeyPad symbol={symbol} onChange={onChange} item={item} buttonStyle={btnStyle} />
                </>
              )}
            </FlexContainer>
          </Col>
          <Col span={12} />
        </StyledRow>
      </Question>
    );
  }
}

KeyPadOptions.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

KeyPadOptions.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(KeyPadOptions);
