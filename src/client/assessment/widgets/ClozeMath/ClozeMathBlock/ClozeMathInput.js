/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
// import { isEmpty } from "lodash";
import styled from "styled-components";
import { MathKeyboard } from "@edulastic/common";
import CheckedBlock from "./CheckedBlock";

export default class ClozeMathInput extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    targetindex: PropTypes.number.isRequired,
    resprops: PropTypes.object.isRequired
  };

  state = {
    latex: "",
    showKeyboard: false,
    currentMathQuill: null
  };

  constructor(props) {
    super(props);
    this.mathRef = React.createRef();
    this.wrappedRef = React.createRef();
  }

  componentDidMount() {
    const { resprops = {}, targetindex } = this.props;
    const { answers = {} } = resprops;
    const { math: _userAnwers = [] } = answers;

    const _this = this;

    if (window.MathQuill && this.mathRef.current) {
      const MQ = window.MathQuill.getInterface(2);
      const config = {
        handlers: {
          edit(editingMathField) {
            const _latex = editingMathField.latex();
            _this.setState({ latex: _latex });
          }
        },
        restrictMismatchedBrackets: true
      };

      const mQuill = MQ.MathField(this.mathRef.current, config);
      this.setState({ currentMathQuill: mQuill });
      mQuill.latex(_userAnwers[targetindex] ? _userAnwers[targetindex].value || "" : "");
    }
    document.addEventListener("mousedown", this.clickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutside);
  }

  clickOutside = e => {
    const { target } = e;
    const { wrappedRef } = this;
    if (!wrappedRef.current || !window.$) {
      return;
    }
    if (wrappedRef && !wrappedRef.current.contains(target) && !$(target).hasClass("ant-select-dropdown-menu-item")) {
      this.saveAnswer();
      // this.setState({ showKeyboard: false });
    }
  };

  showKeyboardModal = () => {
    const { mathRef } = this;
    if (!mathRef.current) {
      return;
    }
    this.setState({ showKeyboard: true });
    mathRef.current.focus();
  };

  closeMathBoard = () => {
    this.setState({ showKeyboard: false });
  };

  onInput = (key, command = "cmd") => {
    const { currentMathQuill } = this.state;
    const { mathRef } = this;
    if (!currentMathQuill) return;

    const innerField = currentMathQuill;

    if (key === "left_move") {
      innerField.keystroke("Left");
    } else if (key === "right_move") {
      innerField.keystroke("Right");
    } else if (key === "ln--") {
      innerField.write("ln\\left(\\right)");
    } else if (key === "leftright3") {
      innerField.write("\\sqrt[3]{}");
    } else if (key === "Backspace") {
      innerField.keystroke("Backspace");
    } else if (key === "leftright2") {
      innerField.write("^2");
    } else if (key === "down_move") {
      innerField.keystroke("Down");
    } else if (key === "up_move") {
      innerField.keystroke("Up");
    } else {
      innerField[command](key);
    }
    mathRef.current.focus();
  };

  saveAnswer = () => {
    const { resprops = {}, targetindex, index } = this.props;
    const { latex, showKeyboard } = this.state;
    const { save } = resprops;
    if (showKeyboard) {
      save({ value: latex, index, type: "math" }, targetindex);
    }
  };

  render() {
    const { index, resprops = {}, targetindex } = this.props;
    const { item, answers = {}, evaluation = [], checked } = resprops;
    const { showKeyboard } = this.state;

    const { math: _mathAnswers = [] } = answers;
    // const isChecked = checked && !isEmpty(evaluation);

    return checked ? (
      <CheckedBlock isCorrect={evaluation[index]} userAnswer={_mathAnswers[targetindex]} index={index} isMath />
    ) : (
      <span ref={this.wrappedRef}>
        <span ref={this.mathRef} onClick={this.showKeyboardModal} />
        {showKeyboard && (
          <KeyboardWrapper>
            <MathKeyboard
              onInput={this.onInput}
              onClose={() => {}}
              symbols={item.symbols}
              numberPad={item.numberPad}
              showResponse={false}
            />
          </KeyboardWrapper>
        )}
      </span>
    );
  }
}

const KeyboardWrapper = styled.div`
  width: 50%;
  position: absolute;
  z-index: 100;
`;
