import { MathKeyboard, reformatMathInputLatex, offset } from "@edulastic/common";
import { math } from "@edulastic/constants";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { MathInputStyles, DraggableKeyboard, EmptyDiv, KeyboardIcon } from "./MathInputStyles";

const { EMBED_RESPONSE } = math;

class MathInput extends React.PureComponent {
  state = {
    mathField: null,
    mathFieldFocus: false
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

    if (e.target?.nodeName === "LI" && e.target?.attributes?.[0]?.nodeValue === "option") {
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
    const { defaultFocus, value, isDocbasedSection } = this.props;
    if (!window.MathQuill) return;

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

    const keyboardPosition = this.getKeyboardPosition();
    this.setState(
      { mathField, keyboardPosition, hideKeyboardByDefault: window.isMobileDevice || isDocbasedSection },
      () => {
        // const { hideKeyboardByDefault } = this.state;
        const textarea = mathField.el().querySelector(".mq-textarea textarea");
        textarea.setAttribute("data-cy", `answer-input-math-textarea`);
        // if (!hideKeyboardByDefault) {
        //   textarea.setAttribute("readonly", "readonly");
        // }
        textarea.addEventListener("keyup", this.handleChangeField);
        textarea.addEventListener("keypress", this.handleKeypress);
        textarea.addEventListener("keydown", this.handleTabKey, false);
        document.addEventListener("click", this.handleClick, false);
      }
    );
  }

  setKeyboardPosition(keyboardPosition) {
    this.setState({ keyboardPosition });
    this?.rnd?.updatePosition(keyboardPosition);
  }

  componentDidUpdate(prevProps, prevState) {
    const { symbols: oldSymbols } = prevProps;
    const { symbols: newSymbols, isDocbasedSection = false } = this.props;
    const { mathFieldFocus: oldMathFieldFocus } = prevState;
    const { mathFieldFocus: newMathFieldFocus } = this.state;

    if ((oldMathFieldFocus !== newMathFieldFocus || oldSymbols?.[0] !== newSymbols?.[0]) && !isDocbasedSection) {
      const keyboardPosition = this.getKeyboardPosition();
      this.setKeyboardPosition(keyboardPosition);
    }
  }

  getKeyboardPosition() {
    const { symbols } = this.props;
    const { top, left, height: inputH } = offset(this.containerRef.current) || { left: 0, top: 0 };
    const { width, height: keyboardH } = math.symbols.find(x => x.value === symbols[0]) || { width: 0, height: 0 };

    let x = window.innerWidth - left - width;
    if (x > 0) {
      x = 0;
    }

    let y = window.innerHeight - top - keyboardH - inputH;
    if (y < 0) {
      // 8 is margin between math keyboard and math input
      y = -keyboardH - 8;
    } else {
      y = inputH + 8;
    }

    return { x, y };
  }

  handleTabKey = e => {
    if (e?.keyCode === 9) {
      this.setState({ mathFieldFocus: false });
    }
  };

  sanitizeLatex = v => (v?.toString() || "").replace(/&amp;/g, "&");

  handleKeypress = e => {
    const { restrictKeys, allowNumericOnly, value = "" } = this.props;
    if (allowNumericOnly) {
      const isDynamicVar = value && value[value.length - 1] === "@";
      if (isDynamicVar) {
        if (!e.key.match(/[a-zA-Z]/g)) {
          e.preventDefault();
          e.stopPropagation();
        }
        return;
      }

      if (e.key && !e.key.match(/[0-9+-.%^@/]/g)) {
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

  onInput = (key, command = "cmd", numToMove) => {
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
        mathField.write("\\lbrace");
        break;
      case "}":
        mathField.write("\\rbrace");
        break;
      case "\\embed{response}":
        mathField.write(key);
        break;
      case "{}":
        mathField[command]("{");
        break;
      default:
        mathField[command](key);
    }

    // move cursor into start of key(latex)
    if (command === "write" && numToMove) {
      for (let i = 0; i < numToMove; i++) {
        mathField.keystroke("Left");
      }
    }

    mathField.focus();
    this.handleChangeField();
  };

  onClickMathField = () => {
    const { hideKeyboardByDefault } = this.state;
    if (!hideKeyboardByDefault) {
      this.setState({ mathFieldFocus: true }, this.focus);
    }
  };

  focus = () => {
    const { onFocus, onInnerFieldClick } = this.props;
    const { mathField } = this.state;
    if (mathField) {
      mathField.focus();
    }
    if (onFocus) {
      onFocus(true);
    }
    if (onInnerFieldClick) {
      onInnerFieldClick();
    }
  };

  toggleHideKeyboard = () => {
    this.setState(
      state => ({
        hideKeyboardByDefault: !state.hideKeyboardByDefault
      }),
      () => {
        const { hideKeyboardByDefault } = this.state;
        const textarea = this.mQuill.el().querySelector(".mq-textarea textarea");
        if (hideKeyboardByDefault) {
          // textarea.removeAttribute("readonly");
          textarea.focus();
        } else {
          textarea.blur();
          // textarea.setAttribute("readonly", "readonly");
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
      onKeyDown,
      onKeyUp,
      symbols,
      numberPad,
      fullWidth,
      height,
      background,
      className,
      restrictKeys,
      customKeys,
      isDocbasedSection = false
    } = this.props;

    const { mathFieldFocus, hideKeyboardByDefault, keyboardPosition } = this.state;
    const visibleKeypad = !alwaysHideKeyboard && !alwaysShowKeyboard && mathFieldFocus && !hideKeyboardByDefault;

    const MathKeyboardWrapper = alwaysShowKeyboard ? EmptyDiv : DraggableKeyboard;

    return (
      <MathInputStyles
        fullWidth={fullWidth}
        className={className}
        fontStyle={symbols[0] === "units_si" || symbols[0] === "units_us" ? "normal" : "italic"}
        width={style.width}
        height={height}
        background={background}
        fontSize={style.fontSize}
        ref={this.containerRef}
        onKeyUp={onKeyUp}
      >
        <div className="input" onClick={this.onClickMathField}>
          <div
            onKeyDown={onKeyDown}
            className="input__math answer-math-input-field"
            style={{
              ...style,
              minHeight: style.height,
              fontSize: style.fontSize ? style.fontSize : "inherit"
            }}
            data-cy="answer-math-input-field"
          >
            <span className="input__math__field" ref={this.mathFieldRef} />

            {(window.isMobileDevice || isDocbasedSection) && (
              <KeyboardIcon
                onClick={this.toggleHideKeyboard}
                className={hideKeyboardByDefault ? "fa fa-calculator" : "fa fa-keyboard-o"}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
        {(visibleKeypad || alwaysShowKeyboard) && (
          <MathKeyboardWrapper
            className="input__keyboard"
            default={keyboardPosition}
            disableDragging={!(window.isMobileDevice || isDocbasedSection) || alwaysShowKeyboard}
            ref={c => {
              this.rnd = c;
            }}
          >
            <MathKeyboard
              symbols={symbols}
              numberPad={numberPad}
              restrictKeys={restrictKeys}
              customKeys={customKeys}
              showResponse={showResponse}
              showDropdown={showDropdown}
              onChangeKeypad={onChangeKeypad}
              onInput={(key, command, numToMove) => this.onInput(key, command, numToMove)}
            />
          </MathKeyboardWrapper>
        )}
      </MathInputStyles>
    );
  }
}

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
  customKeys: PropTypes.array
};

MathInput.defaultProps = {
  alwaysShowKeyboard: false,
  alwaysHideKeyboard: false,
  defaultFocus: false,
  value: "",
  allowNumericOnly: false,
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
