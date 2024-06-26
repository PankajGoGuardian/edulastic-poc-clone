import * as React from "react";
import { Button, Icon, Select } from "antd";
import PropTypes from "prop-types";
import { isObject, compact } from "lodash";

import { math } from "@edulastic/constants";

import { KEYBOARD_BUTTONS } from "./constants/keyboardButtons";
import { NUMBER_PAD_ITEMS } from "./constants/numberPadItems";

import Keyboard from "../Keyboard";

import { MathKeyboardStyles, SymbolContainer, KeyPadButton } from "./styled/MathKeyboardStyles";

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
    const { onChangeKeypad } = this.props;
    if (onChangeKeypad) {
      onChangeKeypad(value);
    }
    this.setState({
      type: value
    });
  };

  renderButtons = numOfBtns => {
    const { onInput } = this.props;
    const { type } = this.state;
    let btns = this.keyboardButtons;

    if (btns.length < numOfBtns) {
      btns = btns.concat(new Array(numOfBtns - btns.length).fill({ types: [type], label: "" }));
    }

    const handleClick = (handler, command) => {
      if (handler && command) {
        onInput(handler, command);
      }
    };

    return btns.map(({ label, labelcy, handler, command = "cmd", name }, i) => {
      let fontRate = 1;
      if (typeof label === "string" && label.length > 4) {
        fontRate = 4.5 / label.length;
      }
      return (
        <KeyPadButton
          data-cy={`virtual-keyboard-${name || (labelcy || label)}`}
          key={i}
          className="num num--type-4"
          onClick={() => handleClick(handler, command)}
          fontSizeRate={fontRate}
        >
          {label}
        </KeyPadButton>
      );
    });
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
    const { restrictKeys, customKeys } = this.props;
    const { type } = this.state;

    const isCustomMode = isObject(type);

    const restrictButtons = restrictKeys.map(key => ({
      handler: key,
      label: key,
      types: [isCustomMode ? type.label : type],
      command: "write"
    }));

    const allBtns = customKeys
      .map(key => ({
        handler: key,
        label: key,
        types: [isCustomMode ? type.label : type],
        command: "write"
      }))
      .concat(KEYBOARD_BUTTONS);

    const availables = isCustomMode
      ? compact(type.value.map(handler => allBtns.find(btn => btn.handler === handler)))
      : allBtns.filter(btn => btn.types.includes(type));

    return restrictButtons.concat(availables);
  }

  get selectOptions() {
    const { symbols } = this.props;

    if (isObject(symbols[0])) {
      return [
        {
          value: symbols[0].label,
          label: symbols[0].label
        },
        ...math.symbols
      ];
    }
    return math.symbols;
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
    const { onInput, showResponse, showDropdown, hideKeypad } = this.props;
    const btns = this.keyboardButtons;

    let cols = btns.length / 4;
    cols = cols % 1 !== 0 ? Math.floor(cols) + 1 : cols;
    if (type === "all") {
      cols = 4;
    }
    const numOfBtns = cols * 4;

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
                    defaultValue={isObject(type) ? type.label : type}
                    data-cy="math-keyboard-dropdown"
                    className="keyboard__header__select"
                    size="large"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
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
              <div className="numberpad">
                {this.numberPadItems.map((item, index) => {
                  const lastNum = (index + 1) % 4;
                  return (
                    <Button
                      disabled={!item.value}
                      key={index}
                      className={`num num--type-${lastNum ? 5 : 6}`}
                      data-cy={`virtual-keyboard-${item.data_cy || item.value}`}
                      onClick={e => {
                        this.handleClickNumPad(item);
                        e.target.blur();
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              {!hideKeypad && (
                <SymbolContainer cols={cols} isAll={type === "all"} className="keyboard__types3">
                  {this.renderButtons(numOfBtns)}
                </SymbolContainer>
              )}
            </div>
          )}
        </div>
      </MathKeyboardStyles>
    );
  }
}

MathKeyboard.propTypes = {
  onClose: PropTypes.func,
  onChangeKeypad: PropTypes.func,
  onInput: PropTypes.func.isRequired,
  showResponse: PropTypes.bool,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
  restrictKeys: PropTypes.array,
  customKeys: PropTypes.array,
  hideKeypad: PropTypes.bool,
  showDropdown: PropTypes.bool
};

MathKeyboard.defaultProps = {
  showResponse: false,
  showDropdown: false,
  hideKeypad: false,
  onClose: () => {},
  onChangeKeypad: () => {},
  restrictKeys: [],
  customKeys: []
};

export default MathKeyboard;
