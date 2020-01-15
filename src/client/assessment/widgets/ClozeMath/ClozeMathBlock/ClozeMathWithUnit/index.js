/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { find, isEmpty, get } from "lodash";
import styled from "styled-components";
import { MathKeyboard, AnswerContext } from "@edulastic/common";

import CheckedBlock from "../CheckedBlock";
import SelectUnit from "../../ClozeMathAnswers/ClozeMathUnitAnswer/SelectUnit";

class ClozeMathWithUnit extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    resprops: PropTypes.object.isRequired
  };

  state = {
    showKeyboard: false
  };

  constructor(props) {
    super(props);
    this.mathRef = React.createRef();
    this.wrappedRef = React.createRef();
    this.mathKeyboardRef = React.createRef();
  }

  static contextType = AnswerContext;

  componentDidMount() {
    const { resprops = {}, id } = this.props;
    const { answers = {}, disableResponse = false } = resprops;
    const { mathUnits: userAnswers = [] } = answers;
    if (window.MathQuill && this.mathRef.current) {
      const MQ = window.MathQuill.getInterface(2);
      const mQuill = MQ.MathField(this.mathRef.current, window.MathQuill);
      this.setState({ currentMathQuill: mQuill }, () => {
        const textarea = mQuill.el().querySelector(".mq-textarea textarea");
        textarea.setAttribute("data-cy", `answer-input-math-textarea`);
        textarea.disabled = disableResponse;
        if (!disableResponse) {
          textarea.addEventListener("keyup", this.handleKeypress);
        }
      });
      mQuill.latex(userAnswers[id] ? userAnswers[id].value || "" : "");
    }
    document.addEventListener("mousedown", this.clickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutside);
  }

  getUserAnswerFromProps = props => {
    const { resprops = {}, id } = props;
    const { answers = {} } = resprops;
    const { mathUnits: userAnswers = {} } = answers;
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
    if (!isEmpty(restrictKeys)) {
      const isSpecialChar = !!(e.key.length > 1 || e.key.match(/[^a-zA-Z]/g));
      const isArrowOrShift = (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 16 || e.keyCode === 8;
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

    if (
      wrappedRef &&
      !wrappedRef.current.contains(target) &&
      !$(target).hasClass("ant-select-dropdown-menu-item") &&
      !$(target).hasClass("ant-select-dropdown-menu")
    ) {
      this.setState({ showKeyboard: false }, this.saveAnswer);
    }
  };

  showKeyboardModal = () => {
    const { currentMathQuill } = this.state;
    const { resprops } = this.props;
    const { disableResponse = false } = resprops;
    if (!currentMathQuill) {
      return;
    }
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

  saveAnswer = fromUnit => {
    const { resprops = {}, id } = this.props;
    const { currentMathQuill } = this.state;
    const { save, item, answers = {} } = resprops;
    const { mathUnits: _userAnwers = [] } = answers;
    const latex = currentMathQuill.latex();
    const {
      responseIds: { mathUnits }
    } = item;
    const { index } = find(mathUnits, res => res.id === id) || {};

    if (latex !== (_userAnwers[id] ? _userAnwers[id].value || "" : "") || fromUnit) {
      save({ ..._userAnwers[id], value: latex, index }, "mathUnits", id);
    }
  };

  onChangeUnit = (_, unit) => {
    const {
      resprops: { save },
      id
    } = this.props;
    const { currentMathQuill } = this.state;
    const latex = currentMathQuill.latex();
    save({ ...this.userAnswer, value: latex, unit }, "mathUnits", id);
  };

  onDropdownVisibleChange = () => {
    this.closeMathBoard();
  };

  getStyles = uiStyles => {
    const btnStyle = {};
    if (uiStyles.fontSize) {
      btnStyle.fontSize = uiStyles.fontSize;
    }
    if (uiStyles.width) {
      btnStyle.minWidth = uiStyles.width;
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
    const {
      responseIds: { mathUnits }
    } = item;
    const { allowedVariables } = find(mathUnits, res => res.id === id) || {};
    return allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  }

  render() {
    const { resprops = {}, id } = this.props;
    const { item, uiStyles = {}, height, width, disableResponse = false } = resprops;
    const { keypadMode, customUnits } = find(item.responseIds.mathUnits, res => res.id === id) || {};
    const { showKeyboard } = this.state;
    const { unit = "" } = this.userAnswer || {};
    const btnStyle = this.getStyles(uiStyles);
    const customKeys = get(item, "customKeys", []);
    return (
      <OuterWrapper disableResponse={disableResponse} ref={this.wrappedRef}>
        <InnerWrapper>
          <ClozeMathInputField
            ref={this.mathRef}
            onClick={this.showKeyboardModal}
            style={{
              ...btnStyle,
              minWidth: width || "auto",
              minHeight: height || "auto",
              padding: "5px 11px",
              marginRight: 0,
              borderRight: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              display: "flex",
              alignItems: "center"
            }}
          />
          <SelectUnit
            disabled={disableResponse}
            preview
            unit={unit}
            customUnits={customUnits}
            onChange={this.onChangeUnit}
            onDropdownVisibleChange={this.onDropdownVisibleChange}
            keypadMode={keypadMode}
            dropdownStyle={{ fontSize: btnStyle.fontSize }}
          />
        </InnerWrapper>
        {showKeyboard && (
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
      </OuterWrapper>
    );
  }
}

const InnerWrapper = styled.div`
  margin: 2px 2px 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.themeColor} !important;
    box-shadow: none !important;
    outline: none !important;
  }
  &:hover {
    cursor: pointer;
  }

  .mq-math-mode {
    ${({ disableResponse }) =>
      disableResponse && `background: #f5f5f5; cursor: not-allowed; color: rgba(0, 0, 0, 0.25);`}
  }
  .mq-editable-field:focus,
  .mq-editable-field:hover,
  .mq-editable-field.mq-focused,
  .mq-math-mode .mq-editable-field.mq-focused {
    border: 1px solid ${({ theme }) => theme.themeColor} !important;
    box-shadow: none !important;
    cursor: pointer;
  }
`;

const OuterWrapper = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: middle;
  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.themeColor} !important;
    box-shadow: none !important;
    outline: none !important;
  }
  &:hover {
    cursor: pointer;
  }
`;

const ClozeMathInputField = styled.span`
  width: ${({ width }) => width};
  min-width: ${({ minWidth }) => minWidth} !important;
  font-size: ${({ fontSize }) => fontSize || "initial"};
  height: ${({ height }) => height};
  margin-right: 0 !important;
  padding: 5px 11px !important;
  border-top-right-radius: 0 !important;
  display: flex !important;
  border-bottom-right-radius: 0 !important;
  font-weight: 600 !important;
  &:active,
  &:focus {
    border-color: ${({ theme }) => theme.themeColor} !important;
    box-shadow: none !important;
    outline: none !important;
  }
`;

const MathWithUnit = ({ resprops = {}, id }) => {
  const { responseContainers, item, answers = {}, evaluation = [], checked, onInnerClick, showIndex } = resprops;
  const { mathUnits = {} } = answers;

  const response = find(responseContainers, cont => cont.id === id);
  const individualWidth = response?.widthpx || 0;
  const individualHeight = response?.heightpx || 0;

  const { heightpx: globalHeight = 0, widthpx: globalWidth = 0, minHeight, minWidth } = item.uiStyle || {};

  const width = individualWidth || Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10));
  const height = individualHeight || Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10));

  return checked ? (
    <CheckedBlock
      width={width}
      height={height}
      evaluation={evaluation}
      showIndex={showIndex}
      userAnswer={mathUnits[id]}
      item={item}
      id={id}
      type="mathUnits"
      isMath
      onInnerClick={onInnerClick}
    />
  ) : (
    <ClozeMathWithUnit resprops={{ ...resprops, height, width }} id={id} />
  );
};

MathWithUnit.propTypes = {
  id: PropTypes.string.isRequired,
  resprops: PropTypes.object.isRequired
};

export default MathWithUnit;

const KeyboardWrapper = styled.div`
  width: fit-content;
  position: absolute;
  left: 4px;
  z-index: 100;
`;
