import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep } from "lodash";
import { MathKeyboard } from "@edulastic/common";
import { greenDark, red, white, black } from "@edulastic/colors";

import { SHOW, CLEAR } from "../../constants/constantsForQuestions";
import AnswerBox from "./AnswerBox";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";

const ClozeMathPreview = ({ type, item, userAnswer, saveAnswer, evaluation }) => {
  const mathRef = useRef();
  const wrappedRef = useRef();
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [currentMathQuill, setCurrentMathQuill] = useState();

  const _onInput = (key, command = "cmd") => {
    if (!currentMathQuill) return;
    const innerField = currentMathQuill.innerFields[0];

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
  };

  const _clickOutside = event => {
    if (
      wrappedRef &&
      !wrappedRef.current.contains(event.target) &&
      // eslint-disable-next-line no-undef
      !$(event.target).hasClass("ant-select-dropdown-menu-item")
    ) {
      setShowKeyboard(false);
    }
  };

  const _getAnswers = () =>
    item.validation.valid_response.value.map(res => {
      const method = res[0];
      if (method) {
        return method.value;
      }
      return "";
    });

  useEffect(() => {
    const MQ = window.MathQuill.getInterface(2);

    // eslint-disable-next-line no-undef
    $(mathRef.current)
      .find(".response-btn")
      // eslint-disable-next-line func-names
      .each(function() {
        // eslint-disable-next-line no-undef
        $(this).replaceWith('<span class="mathField">\\MathQuillMathField{}</span>');
      });

    // eslint-disable-next-line no-undef
    $(mathRef.current)
      .find(".mathField")
      // eslint-disable-next-line func-names
      .each(function(index) {
        // eslint-disable-next-line no-undef
        const mQuill = MQ.StaticMath($(this).get(0));

        // eslint-disable-next-line no-undef
        $(this).on("click", () => {
          setShowKeyboard(true);
          setCurrentMathQuill(mQuill);
        });

        mQuill.innerFields[0].config({
          handlers: {
            edit(mathField) {
              const newAnswers = cloneDeep(userAnswer);

              newAnswers[index] = mathField.latex();

              saveAnswer(newAnswers);
            }
          }
        });
      });
  }, [item.template, userAnswer, type]);

  useEffect(() => {
    document.addEventListener("mousedown", _clickOutside);

    return () => {
      document.removeEventListener("mousedown", _clickOutside);
    };
  }, []);

  useEffect(() => {
    wrappedRef.current.querySelectorAll(".mathField").forEach((element, index) => {
      if (evaluation[index] === true) {
        element.style.background = greenDark;
        element.style.color = white;
      } else if (evaluation[index] === false) {
        element.style.background = red;
        element.style.color = white;
      } else {
        element.style.background = "";
        element.style.color = black;
      }
    });
  }, [evaluation]);

  useEffect(() => {
    const MQ = window.MathQuill.getInterface(2);
    // eslint-disable-next-line no-undef
    $(mathRef.current)
      .find(".mathField")
      // eslint-disable-next-line func-names
      .each(function(index) {
        if (type === CLEAR) {
          const newAnswers = cloneDeep(userAnswer);
          // eslint-disable-next-line no-undef
          const mQuill = MQ.StaticMath($(this).get(0));

          newAnswers[index] = mQuill.innerFields[0].latex("");

          // eslint-disable-next-line no-undef
          $(wrappedRef.current)
            .find(".mathField")
            .each((i, element) => {
              // eslint-disable-next-line no-undef
              const $element = $(element);

              $element.css({
                background: "",
                color: black
              });
            });

          saveAnswer(newAnswers);
        } else if (typeof evaluation[index] !== "undefined") {
          if (evaluation[index]) {
            // eslint-disable-next-line no-undef
            $(this).addClass("success");
          } else {
            // eslint-disable-next-line no-undef
            $(this).addClass("wrong");
          }
        }
      });
  }, [type]);

  return (
    <div ref={wrappedRef}>
      <div className="ql-editor" ref={mathRef} dangerouslySetInnerHTML={{ __html: item.template }} />
      {type === SHOW && <AnswerBox answers={_getAnswers()} />}
      {showKeyboard && (
        <KeyboardWrapper>
          <MathKeyboard onInput={_onInput} symbols={item.symbols} numberPad={item.numberPad} showResponse={false} />
        </KeyboardWrapper>
      )}
    </div>
  );
};

ClozeMathPreview.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.array.isRequired,
  evaluation: PropTypes.array.isRequired
};

export default withCheckAnswerButton(ClozeMathPreview);

const KeyboardWrapper = styled.div`
  width: 50%;
  position: absolute;
  z-index: 100;
`;
