/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { MathKeyboard } from "@edulastic/common";

import CheckedBlock from "./CheckedBlock";

class ClozeMathInput extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
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
    const { resprops = {}, id } = this.props;
    const { answers = {} } = resprops;
    const { maths: _userAnwers = [] } = answers;

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
      mQuill.latex(_userAnwers[id] ? _userAnwers[id].value || "" : "");
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
      this.setState({ showKeyboard: false }, this.saveAnswer);
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
    const { resprops = {}, id } = this.props;
    const { latex, showKeyboard } = this.state;
    const { save, item, answers = {} } = resprops;
    const { maths: _userAnwers = [] } = answers;

    const {
      response_ids: { maths }
    } = item;
    const { index } = find(maths, res => res.id === id) || {};

    if (!showKeyboard && latex !== (_userAnwers[id] ? _userAnwers[id].value || "" : "")) {
      save({ value: latex, index }, "maths", id);
    }
  };

  getStyles = uiStyles => {
    const btnStyle = {};
    if (uiStyles.fontSize) {
      btnStyle.fontSize = uiStyles.fontSize;
    }
    if (uiStyles.width) {
      btnStyle.width = uiStyles.width;
    }
    return uiStyles;
  };

  render() {
    const { resprops = {}, id } = this.props;
    const { item, uiStyles = {} } = resprops;
    const { showKeyboard } = this.state;
    const width = item.ui_style[id] && item.ui_style[id].widthpx;
    const btnStyle = this.getStyles(uiStyles);

    if (width) {
      btnStyle.width = `${width}px`;
    }

    return (
      <span ref={this.wrappedRef} style={btnStyle}>
        <span ref={this.mathRef} onClick={this.showKeyboardModal} style={btnStyle} />
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

const MathInput = ({ resprops = {}, id }) => {
  const { item, answers = {}, evaluation = [], checked, onInnerClick } = resprops;
  const { maths: _mathAnswers = [] } = answers;
  const width = item.ui_style[id] && item.ui_style[id].widthpx;
  return checked ? (
    <CheckedBlock
      width={width}
      evaluation={evaluation}
      userAnswer={_mathAnswers[id]}
      item={item}
      id={id}
      type="maths"
      isMath
      onInnerClick={onInnerClick}
    />
  ) : (
    <ClozeMathInput resprops={resprops} id={id} />
  );
};

MathInput.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default MathInput;

const KeyboardWrapper = styled.div`
  width: 50%;
  position: absolute;
  z-index: 100;
`;
