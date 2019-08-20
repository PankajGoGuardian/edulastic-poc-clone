/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { find, isEqual, isEmpty, get } from "lodash";
import styled from "styled-components";
import { MathKeyboard } from "@edulastic/common";

import CheckedBlock from "../CheckedBlock";
import SelectUnit from "../../ClozeMathAnswers/ClozeMathUnitAnswer/SelectUnit";

class ClozeMathWithUnit extends React.Component {
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
    const { mathUnits: userAnswers = [] } = answers;

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
    const { mathUnits: userAnswers = [] } = answers;

    const { resprops: prevResProps = {} } = prevProps;
    const { answers: prevAnswers = {} } = prevResProps;
    const { mathUnits: prevUserAnswers = [] } = prevAnswers;

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
    const { mathUnits: _userAnwers = [] } = answers;

    const {
      responseIds: { mathUnits }
    } = item;
    const { index } = find(mathUnits, res => res.id === id) || {};

    if (!showKeyboard && latex !== (_userAnwers[id] ? _userAnwers[id].value || "" : "")) {
      save({ ..._userAnwers[id], value: latex, index }, "mathUnits", id);
    }
  };

  onChangeUnit = (_, unit) => {
    const {
      resprops: { save },
      id
    } = this.props;
    save({ ...this.userAnswer, unit }, "mathUnits", id);
  };

  onFocusUnitDropdown = () => {
    this.closeMathBoard();
    this.saveAnswer();
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

  get userAnswer() {
    const { resprops = {}, id } = this.props;
    const { answers = {} } = resprops;
    const { mathUnits: userAnswers = {} } = answers;
    return userAnswers[id];
  }

  get restrictKeys() {
    const { resprops = {}, id } = this.props;
    const { item } = resprops;
    const { allowedVariables = {} } = item;
    const {
      responseIds: { mathUnits }
    } = item;
    const { index } = find(mathUnits, res => res.id === id) || {};
    return allowedVariables[index] ? allowedVariables[index].split(",").map(segment => segment.trim()) : [];
  }

  render() {
    const { resprops = {}, id } = this.props;
    const { responseContainers, item, uiStyles = {} } = resprops;
    const { keypadMode, customUnits } = find(item.responseIds.mathUnits, res => res.id === id) || {};
    const { showKeyboard, keyboardStyles } = this.state;
    const { unit = "" } = this.userAnswer || {};

    // styling response box based on settings.
    const response = find(responseContainers, cont => cont.id === id);
    const width = response && response.widthpx ? `${response.widthpx}px` : `${item.uiStyle.minWidth}px` || "auto";
    const height = response && response.heightpx ? `${response.heightpx}px` : "auto";
    const btnStyle = this.getStyles(uiStyles);
    const customKeys = get(item, "custom_keys", []);

    return (
      <span ref={this.wrappedRef} style={{ ...btnStyle, margin: "0 4px" }}>
        <span
          ref={this.mathRef}
          onClick={this.showKeyboardModal}
          style={{
            ...btnStyle,
            width: width || "auto",
            height: height || "auto",
            padding: "5px 11px",
            marginRight: 0,
            borderRight: 0,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }}
        />
        <SelectUnit
          preview
          unit={unit}
          customUnits={customUnits}
          onChange={this.onChangeUnit}
          onFocus={this.onFocusUnitDropdown}
          keypadMode={keypadMode}
          height={height || "auto"}
        />
        {showKeyboard && (
          <KeyboardWrapper innerRef={this.mathKeyboardRef} style={keyboardStyles}>
            <MathKeyboard
              onInput={this.onInput}
              onClose={() => {}}
              symbols={item.symbols}
              numberPad={item.numberPad}
              restrictKeys={this.restrictKeys}
              customKeys={customKeys}
              showResponse={false}
            />
          </KeyboardWrapper>
        )}
      </span>
    );
  }
}

const MathWithUnit = ({ resprops = {}, id }) => {
  const { responseContainers, item, answers = {}, evaluation = [], checked, onInnerClick } = resprops;
  const { mathUnits } = answers;

  const response = find(responseContainers, cont => cont.id === id);
  const width = response && response.widthpx ? `${response.widthpx}px` : `${item.uiStyle.minWidth}px` || "auto";
  const height = response && response.heightpx ? `${response.heightpx}px` : "auto";

  return checked ? (
    <CheckedBlock
      width={width}
      height={height}
      evaluation={evaluation}
      userAnswer={mathUnits[id]}
      item={item}
      id={id}
      type="mathUnits"
      isMath
      onInnerClick={onInnerClick}
    />
  ) : (
    <ClozeMathWithUnit resprops={resprops} id={id} />
  );
};

MathWithUnit.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default MathWithUnit;

const KeyboardWrapper = styled.div`
  width: 40%;
  position: fixed;
  z-index: 100;
`;
