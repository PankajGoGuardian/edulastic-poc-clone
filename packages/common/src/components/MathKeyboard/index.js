import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isObject, compact } from "lodash";
import { math } from "@edulastic/constants";
import { KEYBOARD_BUTTONS } from "./constants/keyboardButtons";
import { NUMBER_PAD_ITEMS } from "./constants/numberPadItems";

import KeyboardHeader from "./components/KeyboardHeader";
import MainKeyboard from "./components/MainKeyboard";
import FullKeybord from "./components/FullKeybord";
import Keyboard from "../Keyboard";

class MathKeyboard extends React.PureComponent {
  static propTypes = {
    symbols: PropTypes.array,
    restrictKeys: PropTypes.array,
    customKeys: PropTypes.array,
    showResponse: PropTypes.bool,
    showDropdown: PropTypes.bool,
    onInput: PropTypes.func,
    onChangeKeypad: PropTypes.func
  };

  static defaultProps = {
    symbols: [],
    restrictKeys: [],
    customKeys: [],
    showResponse: false,
    showDropdown: true,
    onInput: () => null,
    onChangeKeypad: () => null
  };

  static KEYBOARD_BUTTONS = KEYBOARD_BUTTONS;

  static NUMBER_PAD_ITEMS = NUMBER_PAD_ITEMS;

  state = {
    type: ""
  };

  componentDidMount() {
    const { symbols } = this.props;
    this.setState({ type: symbols[0] });
  }

  componentDidUpdate(prevProps) {
    const { symbols } = this.props;
    const { symbols: prevSymbols } = prevProps;

    if (symbols[0] !== prevSymbols[0]) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ type: symbols[0] });
    }
  }

  handleGroupSelect = value => {
    const { onChangeKeypad } = this.props;
    if (onChangeKeypad) {
      onChangeKeypad(value);
    }
    this.setState({
      type: value
    });
  };

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

  render() {
    const { onInput, showResponse, showDropdown } = this.props;
    const { type } = this.state;

    return (
      <MathKeyboardContainer>
        <KeyboardHeader
          options={this.selectOptions}
          showResponse={showResponse}
          showDropdown={showDropdown}
          onInput={onInput}
          method={type}
          onChangeKeypad={this.handleGroupSelect}
        />
        {type === "qwerty" && <Keyboard onInput={onInput} />}
        {type !== "qwerty" && type !== "all" && <MainKeyboard onInput={onInput} btns={this.keyboardButtons} />}
        {type !== "qwerty" && type === "all" && <FullKeybord onInput={onInput} />}
      </MathKeyboardContainer>
    );
  }
}

export default MathKeyboard;

const MathKeyboardContainer = styled.div`
  /* border: 1px solid ${props => props.theme.mathKeyboard.keyboardBorderColor}; */
  background: ${props => props.theme.mathKeyboard.keyboardBgColor};
  /* padding: 10px; */
  min-width: 180px;
  max-width: 370px;
  width: max-content;
`;
