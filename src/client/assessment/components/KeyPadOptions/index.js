/* eslint-disable react/no-find-dom-node */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { isObject } from "lodash";
import { Col, Select } from "antd";
import { math } from "@edulastic/constants";
import { MathKeyboard, Keyboard } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import NumberPad from "../NumberPad";
import { Widget } from "../../styled/Widget";
import { Subtitle } from "../../styled/Subtitle";
import { Label } from "../../styled/WidgetOptions/Label";
import { StyledRow } from "./styled/StyledRow";
import { SymbolsWrapper, Symbol } from "./styled/Symbol";

class KeyPadOptions extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("advanced", t("component.options.keypad"), node.offsetTop, node.scrollHeight);
  };

  componentDidUpdate(prevProps) {
    const { advancedAreOpen, fillSections, t } = this.props;

    const node = ReactDOM.findDOMNode(this);

    if (prevProps.advancedAreOpen !== advancedAreOpen) {
      fillSections("advanced", t("component.options.keypad"), node.offsetTop, node.scrollHeight);
    }
  }

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, onChange, advancedAreOpen, t } = this.props;

    const handleSymbolsChange = value => {
      const data = [...item.symbols];

      if (value === "custom") {
        data[0] = {
          label: "label",
          title: "",
          value: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
        };
      } else {
        data[0] = value;
      }

      onChange("symbols", data);
    };

    const handleChangeNumberPad = (index, value) => {
      const numberPad = item.numberPad ? [...item.numberPad] : [];

      numberPad[index] = value;
      onChange("numberPad", numberPad);
    };

    const getNumberPad = () => {
      if (!item.numberPad || !item.numberPad.length) {
        onChange("numberPad", MathKeyboard.NUMBER_PAD_ITEMS.map(({ value }) => value));
        return MathKeyboard.NUMBER_PAD_ITEMS;
      }
      return item.numberPad.map(num => {
        const res = MathKeyboard.NUMBER_PAD_ITEMS.find(({ value }) => num === value);

        return res || { value: "", label: t("component.options.empty") };
      });
    };

    const keyboardButtons = () =>
      MathKeyboard.KEYBOARD_BUTTONS.map(btn => {
        if (isObject(item.symbols[0]) && item.symbols[0].value.includes(btn.handler)) {
          btn.types.push(item.symbols[0].label);
        }

        return btn;
      }).filter(btn => btn.types.includes(item.symbols[0]));

    const renderButtons = () => {
      let btns = keyboardButtons();
      if (btns.length < 12) {
        btns = btns.concat(new Array(12 - btns.length).fill({ types: [item.symbols[0]], label: "" }));
      }
      if (btns.length % 3 !== 0) {
        btns = btns.concat(new Array(3 - (btns.length % 3)).fill({ types: [item.symbols[0]], label: "" }));
      }
      return (
        <SymbolsWrapper>
          {btns.map(({ label }, i) => (
            <Symbol key={i}>{label}</Symbol>
          ))}
        </SymbolsWrapper>
      );
    };

    const symbolsData = [...math.symbols, { value: "custom", label: t("component.options.addCustomGroup") }];

    return (
      <Widget style={{ display: advancedAreOpen ? "block" : "none" }}>
        <Subtitle>{t("component.options.keypad")}</Subtitle>

        <StyledRow gutter={60}>
          <Col span={12}>
            <Label>{t("component.options.defaultMode")}</Label>
            <Select
              size="large"
              value={item.symbols[0]}
              style={{ width: "100%" }}
              onChange={handleSymbolsChange}
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

        <StyledRow gutter={60}>
          <Col span={12}>
            {item.symbols[0] === "qwerty" && <Keyboard onInput={() => {}} />}
            {item.symbols[0] !== "qwerty" && (
              <StyledRow gutter={0}>
                <Col span={15}>
                  <NumberPad onChange={handleChangeNumberPad} items={getNumberPad()} />
                </Col>
                <Col span={9}>{renderButtons()}</Col>
              </StyledRow>
            )}
          </Col>
          <Col span={12} />
        </StyledRow>
      </Widget>
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
