import React from "react";
import PropTypes from "prop-types";
import { isObject } from "lodash";
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

  keyboardButtons = symbol =>
    MathKeyboard.KEYBOARD_BUTTONS.map(btn => {
      if (isObject(symbol) && symbol.value.includes(btn.handler)) {
        btn.types.push(symbol.label);
      }

      return btn;
    }).filter(btn => btn.types.includes(symbol));

  render() {
    const { symbol, buttonStyle } = this.props;
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
      return (
        <CustomGroup onRemove={() => null} onChange={this.handleChange} value={symbol} buttonStyle={buttonStyle} />
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
