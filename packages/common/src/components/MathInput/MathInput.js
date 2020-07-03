import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";
import { MathKeyboard, reformatMathInputLatex } from "@edulastic/common";
import { math } from "@edulastic/constants";
import { Popover } from "antd";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { MathInputStyles } from "./MathInputStyles";

const { EMBED_RESPONSE } = math;

class MathInput extends React.PureComponent {
  state = {
    mathField: null,
    mathFieldFocus: false,
    nativeKeyboard: !window.isMobileDevice
  };

  containerRef = React.createRef();

  mathFieldRef = React.createRef();

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener("click", this.handleClick, false);
    document.removeEventListener("click", this.handleChangeField, false);
    this.setState({ mathFieldFocus: false });
  }

  handleClick = e => {
    const { onFocus } = this.props;
    const { mathFieldFocus } = this.state;
    let shouldHideKeyboard = true;
    const jQueryTargetElem = jQuery(e.target);
    if (
      jQueryTargetElem.hasClass("keyboard") ||
      jQueryTargetElem.hasClass("num") ||
      jQueryTargetElem.hasClass("keyboardButton")
    ) {
      e.preventDefault();
      shouldHideKeyboard = false;
    }

    if (jQueryTargetElem.hasClass("ant-select")) {
      shouldHideKeyboard = false;
    }

    if (e.target.nodeName === "LI" && e.target.attributes[0]?.nodeValue === "option") {
      shouldHideKeyboard = false;
    }
    if (
      shouldHideKeyboard &&
      this.containerRef.current &&
      !this.containerRef.current.contains(e.target) &&
      mathFieldFocus
    ) {
      onFocus(false);
      this.setState({ mathFieldFocus: false }, this.handleBlur);
    }
  };

  componentWillReceiveProps(nextProps) {
    const { mathField } = this.state;
    if (mathField && mathField.latex() !== nextProps.value) {
      mathField.latex(this.sanitizeLatex(nextProps.value));
    }
  }

  componentDidMount() {
    const { defaultFocus, value } = this.props;
    const MQ = window.MathQuill.getInterface(2);

    MQ.registerEmbed("response", () => ({
      htmlString: `<span class="response-embed">
        <span class="response-embed__char">R</span>
        <span class="response-embed__text">Response</span>
      </span>`,
      text() {
        return "custom_embed";
      },
      latex() {
        return EMBED_RESPONSE;
      }
    }));

    const mathField = MQ.MathField(this.mathFieldRef.current, window.MathQuill);
    this.mQuill = mathField;
    mathField.write(this.sanitizeLatex(value));
    this.mathField1 = mathField;
    if (defaultFocus) {
      mathField.focus();
    }

    this.setState(
      () => ({ mathField }),
      () => {
        const { nativeKeyboard } = this.state;
        const textarea = mathField.el().querySelector(".mq-textarea textarea");
        textarea.setAttribute("data-cy", `answer-input-math-textarea`);
        if (!nativeKeyboard) {
          textarea.setAttribute("readonly", "readonly");
        }
        textarea.addEventListener("keyup", this.handleChangeField);
        textarea.addEventListener("keypress", this.handleKeypress);
        document.addEventListener("click", this.handleClick, false);
      }
    );
  }

  sanitizeLatex = v => v.replace(/&amp;/g, "&");

  handleKeypress = e => {
    const { restrictKeys, allowNumericOnly } = this.props;

    if (allowNumericOnly) {
      if (!e.key.match(/[0-9+-.%^/]/g)) {
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

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  handleChangeField = () => {
    const { onInput: saveAnswer } = this.props;
    const { mathField } = this.state;

    const text = reformatMathInputLatex(mathField.latex());
    saveAnswer(text.replace(/\\square/g, "\\square "));
  };

  onInput = (key, command = "cmd") => {
    const { mathField } = this.state;

    if (!mathField) return;

    switch (key) {
      case "in":
        mathField.write("in");
        break;
      case "left_move":
        mathField.keystroke("Left");
        break;
      case "right_move":
        mathField.keystroke("Right");
        break;
      case "ln--":
        mathField.write("ln\\left(\\right)");
        break;
      case "leftright3":
        mathField.write("\\sqrt[3]{}");
        break;
      case "Backspace":
        mathField.keystroke("Backspace");
        break;
      case "leftright2":
        mathField.write("^2");
        break;
      case "down_move":
        mathField.keystroke("Down");
        break;
      case "up_move":
        mathField.keystroke("Up");
        break;
      case "{":
      case "}":
        mathField.write("\\left\\{\\right\\}");
        break;
      case "\\embed{response}":
        mathField.write(key);
        break;
      default:
        mathField[command](key);
    }

    mathField.focus();
    this.handleChangeField();
  };

  onClickMathField = () => {
    const { mathFieldFocus } = this.state;
    if (!mathFieldFocus) {
      this.setState({ mathFieldFocus: true }, this.focus);
    }
  };

  focus = () => {
    const { mathField } = this.state;
    mathField.focus();
  };

  toggleNativeKeyBoard = () => {
    this.setState(
      state => ({
        nativeKeyboard: !state.nativeKeyboard
      }),
      () => {
        const { nativeKeyboard } = this.state;
        const textarea = this.mQuill.el().querySelector(".mq-textarea textarea");
        if (nativeKeyboard) {
          textarea.removeAttribute("readonly");
          textarea.focus();
        } else {
          textarea.blur();
          textarea.setAttribute("readonly", "readonly");
          this.setState({ mathFieldFocus: true });
        }
      }
    );
  };

  render() {
    const {
      alwaysShowKeyboard,
      alwaysHideKeyboard,
      onChangeKeypad,
      showResponse,
      showDropdown,
      style,
      onFocus,
      onKeyDown,
      onKeyUp,
      symbols,
      numberPad,
      fullWidth,
      className,
      restrictKeys,
      customKeys,
      hideKeypad,
      onInnerFieldClick,
      isDocbasedSection = false
    } = this.props;

    const { mathFieldFocus: showKeyboard, nativeKeyboard } = this.state;
    let mathKeyboardVisible = true;
    if (!window.isMobileDevice && showKeyboard) {
      mathKeyboardVisible = true;
    } else if (window.isMobileDevice) {
      if (!showKeyboard) {
        mathKeyboardVisible = false;
      } else if (nativeKeyboard) {
        mathKeyboardVisible = false;
      }
    } else {
      mathKeyboardVisible = false;
    }

    const keypad = (
      <MathKeyboard
        symbols={symbols}
        numberPad={numberPad}
        hideKeypad={hideKeypad}
        restrictKeys={restrictKeys}
        customKeys={customKeys}
        showResponse={showResponse}
        showDropdown={showDropdown}
        onChangeKeypad={onChangeKeypad}
        onInput={(key, command) => this.onInput(key, command)}
        docBasedKeypadStyles={isDocbasedSection && `position: fixed; right: 30px;`}
      />
    );
    const visibleKeypad = !alwaysHideKeyboard && !alwaysShowKeyboard && mathKeyboardVisible;
    return (
      <MathInputStyles
        fullWidth={fullWidth}
        className={className}
        fontStyle={symbols[0] === "units_si" || symbols[0] === "units_us" ? "normal" : "italic"}
        width={style.width}
        fontSize={style.fontSize}
        isDocbasedSection={isDocbasedSection}
        ref={this.containerRef}
        onKeyUp={onKeyUp}
      >
        <Popover
          content={keypad}
          trigger="click"
          placement="bottomLeft"
          visible={visibleKeypad}
          overlayClassName="math-keyboard-popover"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <div
            onFocus={() => {
              onFocus(true);
              this.setState({ mathFieldFocus: true }, onInnerFieldClick);
            }}
            className="input"
            onClick={this.onClickMathField}
          >
            <div
              onKeyDown={onKeyDown}
              className="input__math answer-math-input-field"
              style={{
                ...style,
                height: "auto",
                padding: "2px 5px",
                minHeight: style.height,
                fontSize: style.fontSize ? style.fontSize : "inherit",
                background: greyThemeLighter,
                border: `1px solid ${greyThemeLight}`,
                paddingRight: "25px"
              }}
              data-cy="answer-math-input-field"
            >
              <span className="input__math__field" ref={this.mathFieldRef} />

              {window.isMobileDevice && (
                <KeyboardIcon
                  onClick={this.toggleNativeKeyBoard}
                  className={nativeKeyboard ? "fa fa-calculator" : "fa fa-keyboard-o"}
                  aria-hidden="true"
                />
              )}
            </div>
            {alwaysShowKeyboard && (
              <div className="input__keyboard">
                <MathKeyboard
                  symbols={symbols}
                  numberPad={numberPad}
                  hideKeypad={hideKeypad}
                  restrictKeys={restrictKeys}
                  customKeys={customKeys}
                  showResponse={showResponse}
                  showDropdown={showDropdown}
                  onChangeKeypad={onChangeKeypad}
                  onInput={(key, command) => this.onInput(key, command)}
                />
              </div>
            )}
          </div>
        </Popover>
      </MathInputStyles>
    );
  }
}

const KeyboardIcon = styled.i`
  position: relative;
  display: inline-block;
  margin-left: -32px;
  padding: 8px;
`;

MathInput.propTypes = {
  alwaysShowKeyboard: PropTypes.bool,
  alwaysHideKeyboard: PropTypes.bool,
  defaultFocus: PropTypes.bool,
  onInput: PropTypes.func.isRequired,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
  onInnerFieldClick: PropTypes.func,
  showDropdown: PropTypes.bool,
  showResponse: PropTypes.bool,
  value: PropTypes.string,
  style: PropTypes.object,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeKeypad: PropTypes.func,
  onKeyDown: PropTypes.func,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  restrictKeys: PropTypes.array,
  allowNumericOnly: PropTypes.bool,
  customKeys: PropTypes.array,
  hideKeypad: PropTypes.bool
};

MathInput.defaultProps = {
  alwaysShowKeyboard: false,
  alwaysHideKeyboard: false,
  defaultFocus: false,
  value: "",
  allowNumericOnly: false,
  hideKeypad: false,
  showDropdown: false,
  showResponse: false,
  style: {},
  customKeys: [],
  restrictKeys: [],
  onInnerFieldClick: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onKeyDown: () => {},
  onChangeKeypad: () => {},
  fullWidth: false,
  className: ""
};

export default MathInput;
