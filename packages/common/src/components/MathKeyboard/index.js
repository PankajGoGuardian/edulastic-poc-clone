import * as React from "react";
import { Button, Icon, Select } from "antd";
import PropTypes from "prop-types";
import { isObject } from "lodash";

import { math } from "@edulastic/constants";

import { KEYBOARD_BUTTONS } from "./constants/keyboardButtons";
import { NUMBER_PAD_ITEMS } from "./constants/numberPadItems";

import Keyboard from "../Keyboard";

import { MathKeyboardStyles } from "./styled/MathKeyboardStyles";

const { EMBED_RESPONSE } = math;

class MathKeyboard extends React.PureComponent {
  static KEYBOARD_BUTTONS = KEYBOARD_BUTTONS;

  static NUMBER_PAD_ITEMS = NUMBER_PAD_ITEMS;

  state = {
    dropdownOpened: false,
    // eslint-disable-next-line react/destructuring-assignment
    type: this.props.symbols[0]
  };

  close = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleGroupSelect = value => {
    this.setState({
      type: value
    });
  };

  renderButtons = () => {
    const { onInput } = this.props;
    const { type } = this.state;
    let btns = this.keyboardButtons;

    if (btns.length < 12) {
      btns = btns.concat(new Array(12 - btns.length).fill({ types: [type], label: "" }));
    }

    if (btns.length % 3 !== 0) {
      btns = btns.concat(new Array(3 - (btns.length % 3)).fill({ types: [type], label: "" }));
    }

    const handleClick = (handler, command) => {
      if (handler && command) {
        onInput(handler, command);
      }
    };

    return btns.map(({ label, labelcy, handler, command = "cmd", name }, i) => (
      <Button
        data-cy={`virtual-keyboard-${name || (labelcy || label)}`}
        key={i}
        className="num num--type-4"
        onClick={() => handleClick(handler, command)}
      >
        {label}
      </Button>
    ));
  };

  handleClickNumPad = item => {
    const { onInput } = this.props;
    if (item.handler && item.command) {
      onInput(item.handler, item.command);
    } else {
      onInput(item.value);
    }
  };

  get keyboardButtons() {
    const { symbols } = this.props;
    const { type } = this.state;

    return KEYBOARD_BUTTONS.map(btn => {
      symbols.forEach(symbol => {
        if (isObject(symbol) && symbol.value.includes(btn.handler)) {
          btn.types.push(symbol.label);
        }
      });

      return btn;
    }).filter(btn => btn.types.includes(type));
  }

  get selectOptions() {
    const { symbols } = this.props;

    return symbols.map(symbol => {
      if (typeof symbol === "string") {
        return math.symbols.find(opt => opt.value === symbol) || { value: "", label: "" };
      }

      if (isObject(symbol)) {
        return {
          value: symbol.label,
          label: symbol.label
        };
      }

      return symbol;
    });
  }

  get numberPadItems() {
    const { numberPad } = this.props;

    if (!numberPad) {
      return [];
    }

    return numberPad.map(num => {
      const res = NUMBER_PAD_ITEMS.find(({ value }) => num === value);
      return res || { value: "", label: "" };
    });
  }

  render() {
    const { dropdownOpened, type } = this.state;
    const { onInput, showResponse, symbols, showDropdown } = this.props;

    const dropdownIcon = (
      <Icon className="keyboard__dropdown-icon" type={dropdownOpened ? "up" : "down"} theme="outlined" />
    );

    return (
      <MathKeyboardStyles>
        <div className="keyboard">
          {showDropdown && (
            <>
              <div className="keyboard__header">
                <div>
                  <Select
                    defaultValue={symbols[0]}
                    data-cy="math-keyboard-dropdown"
                    className="keyboard__header__select"
                    size="large"
                    onSelect={this.handleGroupSelect}
                    onDropdownVisibleChange={open => {
                      this.setState({ dropdownOpened: open });
                    }}
                    suffixIcon={dropdownIcon}
                  >
                    {this.selectOptions.map(({ value, label }, index) => (
                      <Select.Option value={value} key={index} data-cy={`math-keyboard-dropdown-list-${index}`}>
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                  {showResponse && (
                    <span
                      className="response-embed"
                      style={{ cursor: "pointer" }}
                      onClick={() => onInput(EMBED_RESPONSE)}
                    >
                      <span className="response-embed__char">R</span>
                      <span className="response-embed__text" data-cy="math-keyboard-response">
                        Response
                      </span>
                    </span>
                  )}
                </div>
              </div>
              <br />
            </>
          )}

          {type === "qwerty" && <Keyboard onInput={onInput} />}
          {type !== "qwerty" && (
            <div className="keyboard__main">
              <div className="box keyboard-box">
                {this.numberPadItems.map((item, index) => (
                  <Button
                    disabled={!item.value}
                    key={index}
                    className="num num--type-5"
                    data-cy={`virtual-keyboard-${item.data_cy || item.value}`}
                    onClick={() => this.handleClickNumPad(item)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="keyboard__types3 box symbols-box">{this.renderButtons()}</div>
            </div>
          )}
        </div>
      </MathKeyboardStyles>
    );
  }
}

MathKeyboard.propTypes = {
  onClose: PropTypes.func,
  onInput: PropTypes.func.isRequired,
  showResponse: PropTypes.bool,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
  showDropdown: PropTypes.bool
};

MathKeyboard.defaultProps = {
  showResponse: false,
  showDropdown: false,
  onClose: () => {}
};

export default MathKeyboard;
