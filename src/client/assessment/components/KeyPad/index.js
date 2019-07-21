import React from "react";
import PropTypes from "prop-types";
import { isObject, get } from "lodash";
import { MathKeyboard } from "@edulastic/common";
import CustomGroup from "./CustomGroup";

import { SymbolsWrapper, Symbol } from "./styled";

export default class KeyPad extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    symbol: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    buttonStyle: PropTypes.object
  };

  static defaultProps = {
    buttonStyle: {}
  };

  handleChange = value => {
    const { onChange, item } = this.props;
    const data = [...item.symbols];
    data[0] = value;
    onChange("symbols", data);
  };

  keyboardButtons = symbol => {
    const { item } = this.props;
    const customKeys = get(item, "custom_keys", []);

    const customKeysBtns = customKeys.map(key => ({
      handler: key,
      label: key,
      types: [isObject(symbol) ? symbol.label : symbol],
      command: "write"
    }));

    const defaultKeys =
      symbol === "all"
        ? MathKeyboard.KEYBOARD_BUTTONS_ALL
        : MathKeyboard.KEYBOARD_BUTTONS.map(btn => {
            if (isObject(symbol) && symbol.value.includes(btn.handler)) {
              btn.types.push(symbol.label);
            }

            return btn;
          }).filter(btn => btn.types.includes(symbol));
    return customKeysBtns.concat(defaultKeys);
  };

  render() {
    const { symbol, buttonStyle, item } = this.props;
    let btns = this.keyboardButtons(symbol);

    let cols = btns.length / 4;
    cols = cols % 1 !== 0 ? Math.floor(cols) + 1 : cols;
    if (symbol === "all") {
      cols = 4;
    }

    const numOfBtns = cols * 4;

    if (btns.length < numOfBtns) {
      btns = btns.concat(new Array(numOfBtns - btns.length).fill({ types: [symbol], label: "" }));
    }
    if (isObject(symbol)) {
      const customKeys = get(item, "custom_keys", []);

      return (
        <CustomGroup
          onRemove={() => null}
          onChange={this.handleChange}
          value={symbol}
          buttonStyle={buttonStyle}
          customKeys={customKeys}
        />
      );
    }

    return (
      <SymbolsWrapper cols={cols} isAll={symbol === "all"}>
        {btns.map(({ label }, i) => (
          <Symbol key={i}>{label}</Symbol>
        ))}
      </SymbolsWrapper>
    );
  }
}
