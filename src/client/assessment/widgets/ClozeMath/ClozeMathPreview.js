/* eslint-disable func-names */
/* global $ */
import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, isEmpty, get, isUndefined } from "lodash";
import { MathKeyboard, WithResources, Stimulus } from "@edulastic/common";
import { black } from "@edulastic/colors";

import { SHOW, CLEAR, CHECK } from "../../constants/constantsForQuestions";
import AnswerBox from "./AnswerBox";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import ClozeMathBlock from "./ClozeMathBlock";

const ClozeMathPreview = ({
  type,
  item,
  template,
  userAnswer,
  saveAnswer,
  evaluation,
  showQuestionNumber,
  qIndex,
  options
}) => {
  let mathEvaluation = [];
  let dropDwonEvaluation = [];
  let inputEvaluation = [];

  if (!isEmpty(evaluation)) {
    const { mathResults, inputsResults, dropDownResults } = evaluation;
    mathEvaluation = get(mathResults, "evaluation", []);
    inputEvaluation = get(inputsResults, "evaluation", []);
    dropDwonEvaluation = get(dropDownResults, "evaluation", []);
  }
  const wrappedRef = useRef();
  const mathFieldRef = useRef();
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [currentMathQuill, setCurrentMathQuill] = useState();

  const [mathField, setMathField] = useState(null);
  const [latexHtmls, setLatexHtmls] = useState([]);
  const [latexes, setLatexes] = useState([]);
  const [mathHtmls, setMathHtmls] = useState([]);
  const [newInnerHtml, setNewInnerHtml] = useState("");
  const [templateParts, setBlocks] = useState({ blocks: [], inputs: 0, dropDowns: 0 });

  const minWidth = item.ui_style && item.ui_style.min_width ? `${item.ui_style.min_width}px` : 0;

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
      !$(event.target).hasClass("ant-select-dropdown-menu-item")
    ) {
      setShowKeyboard(false);
    }
  };

  const _getMathAnswers = () =>
    item.validation.valid_response.value.map(res => {
      const method = res[0];
      if (method) {
        return method.value;
      }
      return "";
    });

  const _getDropDownAnswers = () => item.validation.valid_dropdown.value.map(res => res || "");

  const _getTextInputAnswers = () => item.validation.valid_inputs.value.map(res => res || "");

  const replaceResponseButtons = () => {
    const MQ = window.MathQuill.getInterface(2);
    if (!$(wrappedRef.current).find(".ql-editor")[0]) return;
    $($(wrappedRef.current).find(".ql-editor")[0])
      .find(".mathField")
      // eslint-disable-next-line func-names
      .each(function(index) {
        const mQuill = MQ.StaticMath($(this).get(0));
        $(this).on("click", () => {
          setShowKeyboard(true);
          setCurrentMathQuill(mQuill);
        });

        // if (userAnswer[index]) {
        //   mQuill.innerFields[0].write(userAnswer[index]);
        // }

        mQuill.innerFields[0].config({
          handlers: {
            edit(editingMathField) {
              let newAnswers = cloneDeep(userAnswer);
              const answer = editingMathField.latex();
              const mathAnswers = newAnswers.math || [];

              mathAnswers[index] = answer;
              newAnswers = {
                ...newAnswers,
                math: mathAnswers
              };
              saveAnswer(newAnswers);
            }
          }
        });
      });
  };

  const detectLatexes = () => {
    if (!template) {
      setLatexHtmls([]);
      setLatexes([]);
      return;
    }
    const mathRegex = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
    const newLatexHtmls = template.match(mathRegex);

    if (!newLatexHtmls) {
      setLatexHtmls([]);
      setLatexes([]);
      return;
    }
    const newLatexes = newLatexHtmls.map(html => {
      const mathRegex2 = /<span class="input__math" data-latex="([^"]+)"><\/span>/g;
      const matches = mathRegex2.exec(html);
      if (matches && matches[1]) {
        return matches[1];
      }
      return null;
    });

    setLatexHtmls(newLatexHtmls);
    setLatexes(newLatexes);
  };

  const generateNewHtml = () => {
    const prevHtml = template;
    let nNewInnerHtml = ` ${prevHtml}`.slice(1);
    for (let i = 0; i < latexHtmls.length; i++) {
      nNewInnerHtml = nNewInnerHtml.replace(latexHtmls[i], mathHtmls[i]);
    }

    setNewInnerHtml(nNewInnerHtml);
  };

  const startMathValidating = () => {
    if (mathField || !window.MathQuill) return;
    if (mathFieldRef.current) {
      const MQ = window.MathQuill.getInterface(2);
      setMathField(MQ.StaticMath(mathFieldRef.current));
    }
  };

  const convertLatexToHTML = latex => {
    if (!mathField) return latex;
    mathField.latex(latex);
    return `<span class="input__math" data-latex="${latex}">${mathFieldRef.current.outerHTML}</span>`;
  };

  const convertLatexesToMathHtmls = () => {
    const newMathHtmls = latexes.map(latex => convertLatexToHTML(latex));
    setMathHtmls(newMathHtmls);
  };

  const getBlocks = () => {
    if (isUndefined(window.$)) {
      return;
    }

    const blocks = [];
    const parsedHTML = $.parseHTML(newInnerHtml);
    $(parsedHTML).each(function() {
      blocks.push($(this).prop("outerHTML"));
    });

    const dropDowns = $(parsedHTML).find(".text-dropdown-btn").length;
    const inputs = $(parsedHTML).find(".text-dropdown-btn").length;

    setBlocks({
      blocks,
      inputs,
      dropDowns
    });
  };

  const handleAddAnswer = (answer, index, key) => {
    let newAnswers = cloneDeep(userAnswer);
    const answers = newAnswers[key] || [];
    answers[index] = answer;

    newAnswers = {
      ...newAnswers,
      [key]: answers
    };
    saveAnswer(newAnswers);
  };

  useEffect(() => {
    startMathValidating();
  }, [mathFieldRef.current]);

  useEffect(() => {
    if (!window.MathQuill && template !== undefined) {
      setNewInnerHtml(template);
    }
  }, [template]);

  useEffect(() => {
    detectLatexes();
  }, [template]);

  useEffect(() => {
    convertLatexesToMathHtmls();
  }, [mathField, latexHtmls, latexes, mathFieldRef.current]);

  useEffect(() => {
    generateNewHtml();
  }, [mathHtmls]);

  useEffect(() => {
    if (window.MathQuill) replaceResponseButtons();
  }, [newInnerHtml, userAnswer, wrappedRef.current]);

  useEffect(() => {
    document.addEventListener("mousedown", _clickOutside);
    return () => {
      document.removeEventListener("mousedown", _clickOutside);
    };
  }, []);

  useEffect(() => {
    if (!window.MathQuill) return;
    const MQ = window.MathQuill.getInterface(2);
    if (!$(wrappedRef.current).find(".ql-editor")[0]) return;
    $($(wrappedRef.current).find(".ql-editor")[0])
      .find(".mathField")
      // eslint-disable-next-line func-names
      .each(function(index) {
        if (type === CLEAR) {
          let newAnswers = cloneDeep(userAnswer);
          const mQuill = MQ.StaticMath($(this).get(0));
          const answer = mQuill.innerFields[0].latex("");
          const mathAnswers = newAnswers.math || [];

          mathAnswers[index] = answer;
          newAnswers = {
            ...newAnswers,
            math: mathAnswers
          };

          $(wrappedRef.current)
            .find(".mathField")
            .each((i, element) => {
              const $element = $(element);

              $element.find(".mq-editable-field").each((ind, el) => {
                const $el = $(el);
                $el.css({
                  padding: 5,
                  minWidth
                });
              });

              $element.css({
                background: "",
                color: black
              });
            });
          $(this).removeClass("success");
          $(this).removeClass("wrong");
          $(this).removeClass("check");
          $(this).removeAttr("data-index");
          $(this).remove(".icon-wrapper");

          saveAnswer(newAnswers);
        }
      });
  }, [type, wrappedRef.current, templateParts]);

  useEffect(() => {
    if (type === CHECK) {
      if (!$(wrappedRef.current).find(".ql-editor")[0]) return;
      $($(wrappedRef.current).find(".ql-editor")[0])
        .find(".mathField")
        // eslint-disable-next-line func-names
        .each(function(index) {
          $(this)
            .find(".icon-wrapper")
            .remove();
          if (typeof mathEvaluation[index] !== "undefined") {
            if (mathEvaluation[index]) {
              $(this).addClass("success");
              $(this).append(
                $(`
                <div class="icon-wrapper success">
                  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.947 11.71" fill="#5EB500">
                    <g transform="translate(0.001 -67.998)">
                      <g transform="translate(0 67.997)">
                        <path
                          d="M15.712,68.231a.8.8,0,0,0-1.128,0L5.032,77.784,1.361,74.112A.8.8,0,1,0,.233,75.239l4.236,4.236a.8.8,0,0,0,1.128,0L15.712,69.359A.8.8,0,0,0,15.712,68.231Z"
                          transform="translate(0 -67.997)"
                        />
                      </g>
                    </g>
                  </SVG>
                </div>
              `)
              );
              $(this).removeClass("wrong");
              $(this).removeClass("check");
            } else {
              $(this).addClass("wrong");
              $(this).append(
                $(`
                <div class="icon-wrapper wrong">
                  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.635 15.635" fill="#DD2E44">
                    <g transform="translate(0 0)">
                      <g transform="translate(0 0)">
                        <path
                          d="M9.5-37.189l5.791-5.791a1.182,1.182,0,0,0,0-1.673,1.182,1.182,0,0,0-1.673,0L7.825-38.862,2.034-44.653a1.182,1.182,0,0,0-1.673,0,1.183,1.183,0,0,0,0,1.673l5.791,5.791-5.8,5.8a1.182,1.182,0,0,0,0,1.673,1.178,1.178,0,0,0,.837.347,1.178,1.178,0,0,0,.836-.347l5.8-5.8,5.791,5.791a1.181,1.181,0,0,0,.837.347,1.18,1.18,0,0,0,.836-.347,1.182,1.182,0,0,0,0-1.673Z"
                          transform="translate(-0.001 45)"
                        />
                      </g>
                    </g>
                  </SVG>
                </div>
              `)
              );
              $(this).removeClass("success");
              $(this).removeClass("check");
            }
          } else {
            $(this).addClass("check");
            $(this).addClass("wrong");
            $(this).append(
              $(`
              <div class="icon-wrapper wrong">
                <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.635 15.635" fill="#DD2E44">
                  <g transform="translate(0 0)">
                    <g transform="translate(0 0)">
                      <path
                        d="M9.5-37.189l5.791-5.791a1.182,1.182,0,0,0,0-1.673,1.182,1.182,0,0,0-1.673,0L7.825-38.862,2.034-44.653a1.182,1.182,0,0,0-1.673,0,1.183,1.183,0,0,0,0,1.673l5.791,5.791-5.8,5.8a1.182,1.182,0,0,0,0,1.673,1.178,1.178,0,0,0,.837.347,1.178,1.178,0,0,0,.836-.347l5.8-5.8,5.791,5.791a1.181,1.181,0,0,0,.837.347,1.18,1.18,0,0,0,.836-.347,1.182,1.182,0,0,0,0-1.673Z"
                        transform="translate(-0.001 45)"
                      />
                    </g>
                  </g>
                </SVG>
              </div>
            `)
            );
            $(this).removeClass("success");
          }

          $(this).attr("data-index", index + 1);
        });
    }
  }, [evaluation, wrappedRef.current]);

  useEffect(() => {
    getBlocks();
  }, [newInnerHtml, window.$]);

  const { blocks, inputs, dropDowns } = templateParts;
  return (
    <WithResources
      resources={[
        "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
      ]}
      fallBack={<span />}
      onLoaded={() => {
        startMathValidating();
      }}
    >
      <div ref={wrappedRef}>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
          <Stimulus dangerouslySetInnerHTML={{ __html: item.stimulus }} />
        </QuestionTitleWrapper>

        {(dropDowns > 0 || inputs > 0) && (
          <TemplateBox className="ql-editor">
            {blocks && (
              <ClozeMathBlock
                blocks={blocks}
                dropDwonEvaluation={dropDwonEvaluation}
                inputEvaluation={inputEvaluation}
                handleAddAnswer={handleAddAnswer}
                options={options}
                userSelections={get(item, "item.activity.userResponse", false) || userAnswer}
                checked={type === CHECK || type === SHOW}
              />
            )}
          </TemplateBox>
        )}

        {dropDowns === 0 && inputs === 0 && (
          <TemplateBox className="ql-editor" dangerouslySetInnerHTML={{ __html: newInnerHtml }} />
        )}

        {type === SHOW && (
          <AnswerBox
            mathAnswers={_getMathAnswers()}
            dropdownAnswers={_getDropDownAnswers()}
            textInputAnswers={_getTextInputAnswers()}
          />
        )}
        {showKeyboard && (
          <KeyboardWrapper>
            <MathKeyboard
              onInput={_onInput}
              onClose={() => {}}
              symbols={item.symbols}
              numberPad={item.numberPad}
              showResponse={false}
            />
          </KeyboardWrapper>
        )}
        <NoneDiv>
          <span ref={mathFieldRef} className="input__math__field" />
        </NoneDiv>
      </div>
    </WithResources>
  );
};

ClozeMathPreview.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  template: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  options: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

ClozeMathPreview.defaultProps = {
  showQuestionNumber: false,
  qIndex: null
};

export default withCheckAnswerButton(ClozeMathPreview);

const KeyboardWrapper = styled.div`
  width: 50%;
  position: absolute;
  z-index: 100;
`;

const NoneDiv = styled.div`
  display: none;
`;

const TemplateBox = styled.div`
  p {
    display: inline;
  }
`;

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;
