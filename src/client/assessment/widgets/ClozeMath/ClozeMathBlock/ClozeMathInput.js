/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { find, isEqual, isEmpty } from "lodash";
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
    currentMathQuill: null,
    keyboardStyles: {
      top: -1000
    }
  };

  constructor(props) {
    super(props);
    this.mathRef = React.createRef();
    this.wrappedRef = React.createRef();
    this.mathKeyboardRef = React.createRef();
  }

  componentDidMount() {
    const { resprops = {}, id } = this.props;
    const { answers = {} } = resprops;
    const { maths: userAnswers = [] } = answers;

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
      this.setState({ currentMathQuill: mQuill }, () => {
        const textarea = mQuill.el().querySelector(".mq-textarea textarea");
        textarea.setAttribute("data-cy", `answer-input-math-textarea`);
        textarea.addEventListener("keypress", this.handleKeypress);
      });
      mQuill.latex(userAnswers[id] ? userAnswers[id].value || "" : "");
    }
    document.addEventListener("mousedown", this.clickOutside);
  }

  componentDidUpdate(prevProps) {
    const { currentMathQuill } = this.state;
    const { resprops = {}, id } = this.props;
    const { answers = {} } = resprops;
    const { maths: userAnswers = [] } = answers;

    const { resprops: prevResProps = {} } = prevProps;
    const { answers: prevAnswers = {} } = prevResProps;
    const { maths: prevUserAnswers = [] } = prevAnswers;

    if (currentMathQuill) {
      if (!isEqual(userAnswers[id], prevUserAnswers[id])) {
        currentMathQuill.latex(userAnswers[id] ? userAnswers[id].value || "" : "");
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutside);
  }

  handleKeypress = e => {
    const { restrictKeys } = this;
    if (!isEmpty(restrictKeys)) {
      const isSpecialChar = !!(e.key.length > 1 || e.key.match(/[^a-zA-Z]/g));
      const isArrowOrShift = (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 16 || e.keyCode === 8;
      if (!(isSpecialChar || isArrowOrShift) && !isEmpty(restrictKeys)) {
        const isValidKey = restrictKeys.includes(e.key);
        if (!isValidKey) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }
  };

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
    this.setState({ showKeyboard: true }, this.calcKeyPosition);
    mathRef.current.focus();
  };

  calcKeyPosition() {
    if (!this.mathKeyboardRef.current || !this.mathRef.current) {
      this.setState({
        keyboardStyles: {
          top: "unset",
          position: "absolute"
        }
      });
      return;
    }
    const keyboardStyles = {};
    const winH = window.innerHeight;
    const winW = window.innerWidth;
    const keyboardRect = this.mathKeyboardRef.current.getBoundingClientRect();
    const mathInputRect = this.mathRef.current.getBoundingClientRect();

    const keyboardH = keyboardRect.height;
    const keyboardW = keyboardRect.width;

    const mathBottom = mathInputRect.bottom;

    const mathT = mathInputRect.top;
    const mathR = mathInputRect.right;
    const mathH = mathInputRect.height;
    const mathW = mathInputRect.width;

    const left = mathR - mathW / 2 - keyboardW / 2;
    const hDiff = keyboardW + left - winW;
    if (left < 100) {
      keyboardStyles.left = 110; // 110 is left meny width
    } else if (hDiff > 0) {
      keyboardStyles.left = left - hDiff - 20; // 20 is scrollbar width if there is scrollbar
    } else {
      keyboardStyles.left = left;
    }

    const vDiff = winH - mathBottom;
    if (vDiff < keyboardH) {
      keyboardStyles.top = "unset";
      keyboardStyles.bottom = vDiff + mathH;
    } else {
      keyboardStyles.top = mathT + mathH;
    }

    this.setState({ keyboardStyles });
  }

  closeMathBoard = () => {
    this.setState({ showKeyboard: false });
  };

  onInput = (key, command = "cmd") => {
    const { currentMathQuill } = this.state;
    const { mathRef } = this;
    if (!currentMathQuill) return;

    const innerField = currentMathQuill;

    if (key === "in") {
      innerField.write("in");
    } else if (key === "left_move") {
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

  get restrictKeys() {
    const { resprops = {} } = this.props;
    const { item } = resprops;
    const { allowedVariables } = item;
    return allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  }

  render() {
    const { resprops = {}, id } = this.props;
    const { response_containers, item, uiStyles = {} } = resprops;
    const { showKeyboard, keyboardStyles } = this.state;
    const response = find(response_containers, cont => cont.id === id);
    const width = response && response.widthpx ? `${response.widthpx}px` : `${item.ui_style.min_width}px` || "auto";
    const height = response && response.heightpx ? `${response.heightpx}px` : "auto";
    const btnStyle = this.getStyles(uiStyles);

    return (
      <span ref={this.wrappedRef} style={btnStyle}>
        <span
          ref={this.mathRef}
          onClick={this.showKeyboardModal}
          style={{
            ...btnStyle,
            width: width || "auto",
            height: height || "auto"
          }}
        />
        {showKeyboard && (
          <KeyboardWrapper innerRef={this.mathKeyboardRef} style={keyboardStyles}>
            <MathKeyboard
              onInput={this.onInput}
              onClose={() => {}}
              symbols={item.symbols}
              numberPad={item.numberPad}
              restrictKeys={this.restrictKeys}
              showResponse={false}
            />
          </KeyboardWrapper>
        )}
      </span>
    );
  }
}

const MathInput = ({ resprops = {}, id }) => {
  const { response_containers, item, answers = {}, evaluation = [], checked, onInnerClick } = resprops;
  const { maths: _mathAnswers = [] } = answers;
  const response = find(response_containers, cont => cont.id === id);
  const width = response && response.widthpx ? `${response.widthpx}px` : `${item.ui_style.min_width}px` || "auto";
  const height = response && response.heightpx ? `${response.heightpx}px` : "auto";

  return checked ? (
    <CheckedBlock
      width={width}
      height={height}
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
  width: 40%;
  position: fixed;
  z-index: 100;
`;
