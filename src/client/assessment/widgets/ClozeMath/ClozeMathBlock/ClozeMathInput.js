/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { find, isEmpty, get } from "lodash";
import styled from "styled-components";
import { MathKeyboard, StaticMath, AnswerContext } from "@edulastic/common";

import CheckedBlock from "./CheckedBlock";

class ClozeMathInput extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    resprops: PropTypes.object.isRequired
  };

  state = {
    showKeyboard: false,
    currentMathQuill: null,
    nativeKeyboard: !window.isMobileDevice
  };

  constructor(props) {
    super(props);
    this.mathRef = React.createRef();
    this.wrappedRef = React.createRef();
    this.mathKeyboardRef = React.createRef();
  }

  static contextType = AnswerContext;

  componentDidMount() {
    const { nativeKeyboard } = this.state;
    const { resprops = {}, id } = this.props;
    const { answers = {}, disableResponse } = resprops;
    const { maths: userAnswers = [] } = answers;

    if (window.MathQuill && this.mathRef.current) {
      const MQ = window.MathQuill.getInterface(2);
      const mQuill = MQ.MathField(this.mathRef.current, window.MathQuill);
      this.mQuill = mQuill;
      this.setState({ currentMathQuill: mQuill }, () => {
        const textarea = mQuill.el().querySelector(".mq-textarea textarea");
        textarea.setAttribute("data-cy", `answer-input-math-textarea`);
        if (!nativeKeyboard) {
          textarea.setAttribute("readonly", "readonly");
        }
        textarea.disabled = disableResponse;
        if (!disableResponse) {
          textarea.addEventListener("keyup", this.handleKeypress);
        }
      });
      mQuill.latex(userAnswers[id] ? userAnswers[id].value || "" : "");
    }
    document.addEventListener("mousedown", this.clickOutside);
    document.addEventListener("touchstart", this.clickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutside);
    document.removeEventListener("touchstart", this.clickOutside);
  }

  getUserAnswerFromProps = props => {
    const { resprops = {}, id } = props;
    const { answers = {} } = resprops;
    const { maths: userAnswers = {} } = answers;
    return userAnswers[id];
  };

  componentDidUpdate(prevProps) {
    const { currentMathQuill } = this.state;
    const { expressGrader = false } = this.context;

    const userAnswer = this.getUserAnswerFromProps(this.props);
    const prevAnswer = this.getUserAnswerFromProps(prevProps);
    if (currentMathQuill && !userAnswer && !expressGrader) {
      currentMathQuill.latex("");
    }

    if (currentMathQuill && !prevAnswer && expressGrader) {
      /**
       * set the latex value received in network request in express Grader
       * this should be called only in express Grader
       */
      currentMathQuill.latex(userAnswer?.value || "");
    }
  }

  // TODO
  // debounce if keypress is exhaustive

  handleKeypress = e => {
    const { restrictKeys } = this;
    const { resprops = {}, id } = this.props;
    const { item } = resprops;
    const {
      responseIds: { maths = [] }
    } = item;
    const isArrowOrShift = (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 16 || e.keyCode === 8;
    const { allowNumericOnly } = find(maths, res => res.id === id) || {};
    if (allowNumericOnly && !isArrowOrShift) {
      if (!e.key.match(/[0-9+-./%^]/g)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    if (!isEmpty(restrictKeys)) {
      const isSpecialChar = !!(e.key.length > 1 || e.key.match(/[^a-zA-Z]/g));
      if (!(isSpecialChar || isArrowOrShift) && !isEmpty(restrictKeys)) {
        const isValidKey = restrictKeys.includes(e.key);
        if (!isValidKey) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    }
    this.saveAnswer();
  };

  clickOutside = e => {
    const { target } = e;
    const { wrappedRef } = this;
    if (!wrappedRef.current || !window.$) {
      return;
    }

    if (target.clientHeight < target.scrollHeight) {
      const scrollBarWidth = target.offsetWidth - target.clientWidth;
      const clickPos = target.scrollWidth - e.offsetX;
      if (scrollBarWidth > 0 && clickPos < 0) {
        return;
      }
    }

    if (wrappedRef && !wrappedRef.current.contains(target) && !$(target).hasClass("ant-select-dropdown-menu-item")) {
      this.setState({ showKeyboard: false }, this.saveAnswer);
    }
  };

  showKeyboardModal = () => {
    const { currentMathQuill } = this.state;
    if (!currentMathQuill) {
      return;
    }
    const { resprops = {} } = this.props;
    const { disableResponse = false } = resprops;
    if (disableResponse) {
      currentMathQuill.blur();
      return null;
    }
    this.setState({ showKeyboard: true }, this.calcKeyPosition);
    currentMathQuill.focus();
  };

  calcKeyPosition() {
    if (!this.mathKeyboardRef.current || !this.mathRef.current) {
      return;
    }
    const keyboardW = this.mathKeyboardRef.current.offsetWidth;
    const previewWrapperW = this.wrappedRef.current.offsetParent.offsetWidth; // offsetParent is Preview Container element
    const mathWrapLeft = this.wrappedRef.current.offsetLeft;
    const diff = previewWrapperW - mathWrapLeft - keyboardW;
    if (diff < 0) {
      this.mathKeyboardRef.current.style.left = `${diff}px`;
    } else {
      this.mathKeyboardRef.current.style.left = "0px";
    }
  }

  closeMathBoard = () => {
    this.setState({ showKeyboard: false });
  };

  onInput = (key, command = "cmd") => {
    const { currentMathQuill } = this.state;
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
    currentMathQuill.focus();
    this.saveAnswer();
  };

  saveAnswer = () => {
    const { resprops = {}, id } = this.props;
    const { currentMathQuill } = this.state;
    const { save, item, answers = {} } = resprops;
    const { maths: _userAnwers = [] } = answers;
    const latex = currentMathQuill.latex();
    const {
      responseIds: { maths }
    } = item;
    const { index } = find(maths, res => res.id === id) || {};

    if (latex !== (_userAnwers[id] ? _userAnwers[id].value || "" : "")) {
      save({ value: latex, index }, "maths", id);
    }
  };

  getStyles = uiStyles => {
    const btnStyle = {};
    if (uiStyles.width) {
      btnStyle.minWidth = uiStyles.width;
    }
    return btnStyle;
  };

  get restrictKeys() {
    const { resprops = {}, id } = this.props;
    const { item } = resprops;
    const {
      responseIds: { maths }
    } = item;
    const { allowedVariables = "" } = find(maths, res => res.id === id) || {};
    return allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  }

  toggleNativeKeyBoard = () => {
    this.setState(
      state => ({
        nativeKeyboard: !state.nativeKeyboard
      }),
      () => {
        const textarea = this.mQuill.el().querySelector(".mq-textarea textarea");
        if (this.state.nativeKeyboard) {
          textarea.removeAttribute("readonly");
          textarea.focus();
        } else {
          textarea.blur();
          textarea.setAttribute("readonly", "readonly");
          this.setState({ showKeyboard: true });
        }
      }
    );
  };

  render() {
    const { resprops = {} } = this.props;
    const { height, width, item, uiStyles = {}, isV1Migrated, disableResponse } = resprops;
    const { showKeyboard, nativeKeyboard } = this.state;
    const btnStyle = this.getStyles(uiStyles);
    const customKeys = get(item, "customKeys", []);

    let mathKeyboardVisible = true;
    if (!window.isMobileDevice && showKeyboard) {
      mathKeyboardVisible = true;
    } else if (window.isMobileDevice) {
      if (!showKeyboard) {
        mathKeyboardVisible = false;
      } else {
        if (nativeKeyboard) {
          mathKeyboardVisible = false;
        }
      }
    } else {
      mathKeyboardVisible = false;
    }

    return (
      <Wrapper
        disableResponse={disableResponse}
        key="mathWrapper"
        ref={this.wrappedRef}
        style={{
          ...btnStyle,
          margin: "2px 2px 4px 2px",
          display: "inline-block",
          position: "relative",
          verticalAlign: "middle",
          alignSelf: "flex-start"
        }}
      >
        <div>
          <span
            ref={this.mathRef}
            className="mathRef"
            onClick={this.showKeyboardModal}
            style={{
              ...btnStyle,
              minWidth: width,
              minHeight: height,
              padding: "5px 11px 4px"
            }}
          />
          {window.isMobileDevice && (
            <KeyboardIcon
              onClick={this.toggleNativeKeyBoard}
              className={this.state.nativeKeyboard ? "fa fa-calculator" : "fa fa-keyboard-o"}
              aria-hidden="true"
            />
          )}

          {mathKeyboardVisible && (
            <KeyboardWrapper ref={this.mathKeyboardRef}>
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
        </div>
      </Wrapper>
    );
  }
}

const KeyboardIcon = styled.i`
  position: relative;
  display: inline-block;
  margin-left: -32px;
  padding: 8px;
`;

const MathInput = ({ resprops = {}, id, responseindex }) => {
  const { responseContainers, item, answers = {}, evaluation = [], checked, onInnerClick, showIndex, save } = resprops;
  const { maths: _mathAnswers = [] } = answers;
  const response = find(responseContainers, cont => cont.id === id);
  const individualWidth = response?.widthpx || 0;
  const individualHeight = response?.heightpx || 0;

  const { heightpx: globalHeight = 0, widthpx: globalWidth = 0, minHeight, minWidth } = item.uiStyle || {};

  const width = individualWidth || Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10));
  const height = individualHeight || Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10));
  const {
    responseIds: { maths = [] }
  } = item;
  const { useTemplate, template = "" } = find(maths, res => res.id === id) || {};
  const studentTemplate = template.replace(/\\embed\{response\}/g, "\\MathQuillMathField{}");

  const customKeys = get(item, "customKeys", []);
  const isShowDropdown = item.isUnits && item.showDropdown;

  const mathInputProps = {
    hideKeypad: false,
    symbols: isShowDropdown ? ["basic"] : item.symbols,
    restrictKeys: [],
    allowNumericOnly: false,
    customKeys: isShowDropdown ? [] : customKeys,
    numberPad: item.numberPad,
    onBlur: () => null
  };

  const StaticOrMathInput = useTemplate ? (
    <StaticMath
      {...mathInputProps}
      showResponse
      latex={studentTemplate}
      onBlur={val => save({ value: val, index: responseindex }, "maths", id)}
      onInput={() => null}
      id={id}
    />
  ) : (
    <ClozeMathInput resprops={{ ...resprops, height, width }} id={id} />
  );

  // debugger;

  return checked ? (
    <CheckedBlock
      width={width}
      height={height}
      evaluation={evaluation}
      showIndex={showIndex}
      userAnswer={_mathAnswers[id]}
      item={item}
      id={id}
      type="maths"
      isMath
      onInnerClick={onInnerClick}
    />
  ) : (
    StaticOrMathInput
  );
};

MathInput.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired,
  responseindex: PropTypes.string.isRequired
};

export default MathInput;

const KeyboardWrapper = styled.div`
  width: fit-content;
  left: 4px;
  position: absolute;
  z-index: 100;
`;

const Wrapper = styled.div`
  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.themeColor} !important;
    box-shadow: none !important;
    outline: none !important;
  }
  .mq-math-mode {
    ${({ disableResponse }) =>
      disableResponse && `background: #f5f5f5; cursor: not-allowed; color: rgba(0, 0, 0, 0.25);`}
  }
  .mq-cursor {
    ${({ disableResponse }) => disableResponse && `display: none;`}
  }
  .mq-editable-field:focus,
  .mq-editable-field:hover,
  .mq-editable-field.mq-focused,
  .mq-math-mode .mq-editable-field.mq-focused {
    border-color: ${({ theme }) => theme.themeColor} !important;
    box-shadow: none !important;
    outline: none !important;
    cursor: pointer;
  }
  span {
    font-weight: 600;
    font-style: unset;
    var {
      font-weight: 600;
      font-style: unset;
    }
  }
`;
