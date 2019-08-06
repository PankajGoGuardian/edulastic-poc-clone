import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";

import { MathKeyboard } from "@edulastic/common";
import { math } from "@edulastic/constants";

import { MathInputStyles } from "./MathInputStyles";

const { EMBED_RESPONSE } = math;

class MathInput extends React.PureComponent {
  state = {
    mathField: null,
    mathFieldFocus: false
  };

  containerRef = React.createRef();

  mathFieldRef = React.createRef();

  componentWillUnmount() {
    const { onBlur } = this.props;
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener("click", this.handleClick, false);
    document.removeEventListener("click", this.handleChangeField, false);
    this.setState({ mathFieldFocus: false });
    onBlur();
  }

  handleClick = e => {
    const { onFocus, onBlur } = this.props;

    if (e.target.nodeName === "LI" && e.target.attributes[0].nodeValue === "option") {
      return;
    }
    if (this.containerRef.current && !this.containerRef.current.contains(e.target)) {
      onFocus(false);
      this.setState({ mathFieldFocus: false });
      onBlur();
    }
  };

  componentWillReceiveProps(nextProps) {
    const { mathField } = this.state;
    if (mathField && mathField.latex() !== nextProps.value) {
      mathField.latex(nextProps.value);
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
    mathField.write(value);

    if (defaultFocus) {
      mathField.focus();
    }

    this.setState(
      () => ({ mathField }),
      () => {
        const textarea = mathField.el().querySelector(".mq-textarea textarea");
        textarea.setAttribute("data-cy", `answer-input-math-textarea`);
        textarea.addEventListener("keyup", this.handleChangeField);
        textarea.addEventListener("keypress", this.handleKeypress);
        document.addEventListener("click", this.handleClick, false);
      }
    );
  }

  handleKeypress = e => {
    const { restrictKeys, allowNumericOnly } = this.props;

    if (allowNumericOnly) {
      if (!e.key.match(/[^a-zA-Z]/g)) {
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

  handleChangeField = () => {
    const { onInput: saveAnswer } = this.props;
    const { mathField } = this.state;

    const text = mathField.latex();
    saveAnswer(text);
  };

  onInput = (key, command = "cmd") => {
    const { mathField } = this.state;

    if (!mathField) return;
    if (key === "in") {
      mathField.write("in");
    } else if (key === "left_move") {
      mathField.keystroke("Left");
    } else if (key === "right_move") {
      mathField.keystroke("Right");
    } else if (key === "ln--") {
      mathField.write("ln\\left(\\right)");
    } else if (key === "leftright3") {
      mathField.write("\\sqrt[3]{}");
    } else if (key === "Backspace") {
      mathField.keystroke("Backspace");
    } else if (key === "leftright2") {
      mathField.write("^2");
    } else if (key === "down_move") {
      mathField.keystroke("Down");
    } else if (key === "up_move") {
      mathField.keystroke("Up");
    } else if (key === "\\embed{response}") {
      mathField.write(key);
    } else {
      mathField[command](key);
    }
    mathField.focus();
    this.handleChangeField();
  };

  onClose = () => {
    const { onBlur } = this.props;
    this.setState({ mathFieldFocus: false });
    onBlur();
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

  render() {
    const { mathFieldFocus } = this.state;
    const {
      alwaysShowKeyboard,
      onChangeKeypad,
      showResponse,
      showDropdown,
      style,
      onFocus,
      onKeyDown,
      symbols,
      numberPad,
      fullWidth,
      className,
      restrictKeys,
      customKeys,
      hideKeypad,
      onInnerFieldClick
    } = this.props;

    return (
      <MathInputStyles fullWidth={fullWidth} width={style.width} height={style.height} className={className}>
        <div
          ref={this.containerRef}
          onFocus={() => {
            onFocus(true);
            this.setState({ mathFieldFocus: true }, onInnerFieldClick);
          }}
          className="input"
          onClick={this.onClickMathField}
        >
          <div onKeyDown={onKeyDown} className="input__math" style={style} data-cy="answer-math-input-field">
            <span className="input__math__field" ref={this.mathFieldRef} />
          </div>
          <div className={alwaysShowKeyboard ? "input__keyboard" : "input__absolute__keyboard"}>
            {(alwaysShowKeyboard || mathFieldFocus) && (
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
            )}
          </div>
        </div>
      </MathInputStyles>
    );
  }
}

MathInput.propTypes = {
  alwaysShowKeyboard: PropTypes.bool,
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
