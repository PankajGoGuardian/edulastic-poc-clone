import React from "react";
import PropTypes from "prop-types";
import { isObject, get } from "lodash";
import { MathKeyboard } from "@edulastic/common";
import CustomGroup from "./CustomGroup";

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
    const customKeys = get(item, "customKeys", []);

    const customKeysBtns = customKeys.map(key => ({
      handler: key,
      label: key,
      types: [isObject(symbol) ? symbol.label : symbol],
      command: "write"
    }));

    const isCustomMode = isObject(symbol);

    const defaultKeys = MathKeyboard.KEYBOARD_BUTTONS.map(btn => {
      if (isCustomMode && symbol.value.includes(btn.handler)) {
        btn.types.push(symbol.label);
      }
      return btn;
    });

    return customKeysBtns.concat(defaultKeys.filter(btn => btn.types.includes(isCustomMode ? symbol.label : symbol)));
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
      const customKeys = get(item, "customKeys", []);

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

    return <MathKeyboard symbols={[symbol]} showDropdown={false} />;
  }
}
