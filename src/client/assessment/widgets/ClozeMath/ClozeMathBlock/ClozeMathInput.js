/* eslint-disable no-undef */
import React from "react";
import PropTypes from "prop-types";
import { find, isEqual, isEmpty, get } from "lodash";
import styled from "styled-components";
import { MathKeyboard } from "@edulastic/common";
import { response as DefaultDimensions } from "@edulastic/constants";

import CheckedBlock from "./CheckedBlock";

class ClozeMathInput extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    resprops: PropTypes.object.isRequired
  };

  state = {
    showKeyboard: false,
    currentMathQuill: null
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

    if (window.MathQuill && this.mathRef.current) {
      const MQ = window.MathQuill.getInterface(2);
      const mQuill = MQ.MathField(this.mathRef.current, window.MathQuill);
      this.setState({ currentMathQuill: mQuill }, () => {
        const textarea = mQuill.el().querySelector(".mq-textarea textarea");
        textarea.setAttribute("data-cy", `answer-input-math-textarea`);
        textarea.addEventListener("keypress", this.handleKeypress);
        textarea.addEventListener("blur", this.saveAnswer);
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
    const { resprops = {}, id } = this.props;
    const { item } = resprops;
    const {
      responseIds: { maths = [] }
    } = item;
    const { allowNumericOnly } = find(maths, res => res.id === id) || {};
    if (allowNumericOnly) {
      if (!e.key.match(/[0-9+-./%^]/g)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
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
    this.setState({ showKeyboard: true });
    currentMathQuill.focus();
  };

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
  };

  saveAnswer = () => {
    const { resprops = {}, id } = this.props;
    const { currentMathQuill, showKeyboard } = this.state;
    const { save, item, answers = {} } = resprops;
    const { maths: _userAnwers = [] } = answers;
    const latex = currentMathQuill.latex();
    const {
      responseIds: { maths }
    } = item;
    const { index } = find(maths, res => res.id === id) || {};

    if (latex !== (_userAnwers[id] ? _userAnwers[id].value || "" : "") && !showKeyboard) {
      save({ value: latex, index }, "maths", id);
    }
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

  get restrictKeys() {
    const { resprops = {}, id } = this.props;
    const { item } = resprops;
    const {
      responseIds: { maths }
    } = item;
    const { allowedVariables = "" } = find(maths, res => res.id === id) || {};
    return allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  }

  render() {
    const { resprops = {}, id } = this.props;
    const { responseContainers, item, uiStyles = {} } = resprops;
    const { showKeyboard } = this.state;
    const response = find(responseContainers, cont => cont.id === id);
    const height = response && response.heightpx ? `${response.heightpx}px` : `${DefaultDimensions.minHeight}px`;
    const btnStyle = this.getStyles(uiStyles);
    const customKeys = get(item, "customKeys", []);

    return (
      <div
        ref={this.wrappedRef}
        style={{ ...btnStyle, margin: "0 4px", display: "inline-block", position: "relative" }}
      >
        <Wrapper>
          <span
            ref={this.mathRef}
            onClick={this.showKeyboardModal}
            style={{
              ...btnStyle,
              minHeight: height,
              padding: "5px 11px 4px"
            }}
          />
          {showKeyboard && (
            <KeyboardWrapper innerRef={this.mathKeyboardRef} height={height}>
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
        </Wrapper>
      </div>
    );
  }
}

const MathInput = ({ resprops = {}, id }) => {
  const { responseContainers, item, answers = {}, evaluation = [], checked, onInnerClick, showIndex } = resprops;
  const { maths: _mathAnswers = [] } = answers;
  const response = find(responseContainers, cont => cont.id === id);
  const width = response && response.widthpx ? `${response.widthpx}px` : `${item.uiStyle.minWidth}px` || "auto";
  const height = response && response.heightpx ? `${response.heightpx}px` : "auto";

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
  left: 0px;
  top: ${({ height }) => height};
  position: absolute;
  z-index: 100;
`;

const Wrapper = styled.div`
  span {
    font-weight: 600;
    font-style: unset;
    var {
      font-weight: 600;
      font-style: unset;
    }
  }
`;
