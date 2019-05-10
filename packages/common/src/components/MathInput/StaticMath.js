import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MathKeyboard } from "@edulastic/common";

import { MathInputStyles } from "./MathInputStyles";
import { WithResources } from "../../HOC/withResources";

const StaticMath = ({ style, onBlur, onInput, symbols, numberPad, latex, innerValues }) => {
  const [mathField, setMathField] = useState(null);
  const [innerField, setInnerField] = useState(null);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const containerRef = useRef(null);
  const mathFieldRef = useRef(null);

  const handleClick = e => {
    if (
      e.target.nodeName === "svg" ||
      e.target.nodeName === "path" ||
      (e.target.nodeName === "LI" && e.target.attributes[0].nodeValue === "option")
    ) {
      return;
    }
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setShowKeyboard(false);
    }
  };

  const setInnerFieldsFocuses = () => {
    if (!mathField || !mathField.innerFields || !mathField.innerFields.length) {
      return;
    }
    const MQ = window.MathQuill.getInterface(2);

    const goTo = fieldIndex => {
      const nextField = mathField.innerFields[fieldIndex];
      if (nextField) {
        nextField
          .focus()
          .el()
          .click();
      }
    };

    mathField.innerFields.forEach(field => {
      const getIndex = id => parseInt(id.replace("inner-", ""), 10);

      field.config({
        handlers: {
          upOutOf(pInnerField) {
            goTo(getIndex(pInnerField.el().id) - 1);
          },
          downOutOf(pInnerField) {
            goTo(getIndex(pInnerField.el().id) + 1);
          },
          moveOutOf: (dir, pInnerField) => {
            if (dir === MQ.L) {
              goTo(getIndex(pInnerField.el().id) - 1);
            } else if (dir === MQ.R) {
              goTo(getIndex(pInnerField.el().id) + 1);
            }
          }
        }
      });
    });
  };

  const getLatex = () => {
    if (!mathField) return;
    return mathField.latex();
  };

  const onFocus = newInnerField => {
    setInnerField(newInnerField);
    setShowKeyboard(true);
  };

  const onKeyboardClose = () => {
    setShowKeyboard(false);
  };

  const setLatex = newLatex => {
    if (!mathField) return;
    mathField.latex(newLatex);

    for (let i = 0; i < mathField.innerFields.length; i++) {
      mathField.innerFields[i].el().id = `inner-${i}`;
      mathField.innerFields[i].el().addEventListener("click", () => {
        onFocus(mathField.innerFields[i]);
      });
      mathField.innerFields[i].el().addEventListener("keydown", () => {
        setTimeout(() => {
          onInput(getLatex());
        }, 0);
      });
    }

    setInnerFieldsFocuses();
  };

  const setInnerFieldValues = values => {
    if (!mathField || !mathField.innerFields) return;
    for (let i = 0; i < mathField.innerFields.length; i++) {
      if (!mathField.innerFields[i]) continue;
      mathField.innerFields[i].latex("");
      if (!values[i]) continue;
      mathField.innerFields[i].write(values[i]);
    }
  };

  const onInputKeyboard = (key, command = "cmd") => {
    if (!innerField) return;

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
    innerField.focus();

    onInput(getLatex());
  };

  const onBlurInput = () => {
    onBlur(getLatex());
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, false);

    return function cleanup() {
      document.removeEventListener("click", handleClick, false);
    };
  });

  useEffect(() => {
    const MQ = window.MathQuill.getInterface(2);
    if (mathFieldRef.current) {
      setMathField(MQ.StaticMath(mathFieldRef.current));
      setTimeout(() => {
        setLatex(latex);
        setInnerFieldValues(innerValues);
      });
    }
  }, [mathFieldRef.current]);

  useEffect(() => {
    setLatex(latex);
    setInnerFieldValues(innerValues);
  }, [latex]);

  useEffect(() => {
    setInnerFieldValues(innerValues);
  }, [innerValues]);

  return (
    <MathInputStyles minWidth={style.minWidth}>
      <div ref={containerRef} className="input" onBlur={onBlurInput}>
        <div className="input__math" style={style} data-cy="answer-math-input-style">
          <span className="input__math__field" ref={mathFieldRef} data-cy="answer-math-input-field" />
        </div>
        <div className="input__keyboard">
          {showKeyboard && (
            <MathKeyboard
              symbols={symbols}
              numberPad={numberPad}
              onInput={onInputKeyboard}
              showResponse={false}
              onClose={onKeyboardClose}
            />
          )}
        </div>
      </div>
    </MathInputStyles>
  );
};

StaticMath.propTypes = {
  style: PropTypes.object,
  onBlur: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
  latex: PropTypes.string.isRequired,
  innerValues: PropTypes.array
};

StaticMath.defaultProps = {
  style: {},
  innerValues: []
};

const StaticMathWithResources = props => (
  <WithResources
    resources={[
      "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
      "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
      "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
    ]}
    fallBack={<span />}
  >
    <StaticMath {...props} />
  </WithResources>
);

export default StaticMathWithResources;
