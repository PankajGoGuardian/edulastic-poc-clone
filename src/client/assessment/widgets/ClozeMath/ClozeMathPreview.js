/* global $ */
import React, { useEffect, useRef, useState } from "react";
import { Select, Input } from "antd";

import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, isEmpty } from "lodash";
import { MathKeyboard, WithResources, Stimulus } from "@edulastic/common";
import { black } from "@edulastic/colors";

import { SHOW, CLEAR, CHECK } from "../../constants/constantsForQuestions";
import AnswerBox from "./AnswerBox";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";

const { Option } = Select;

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
  if (!isEmpty(evaluation)) {
    console.log("---------------- evaluation -------------------");
    console.log(evaluation);
    console.log("------------------------------------------------");
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
  const [templateParts, setTemplateParts] = useState([]);
  const [dropdowns, setDropdowns] = useState(0);

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

  const getTemplateParts = () => {
    const _templateParts = newInnerHtml.match(/(<p.*?<\/p>)|(<span.*?<\/span>)/g);
    const dropDownParts = newInnerHtml.match(/<p class="text-dropdown-btn.*?<\/p>/g);
    const _dropdowns = dropDownParts !== null ? dropDownParts.length : 0;
    setTemplateParts(_templateParts);
    setDropdowns(_dropdowns);
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
          if (typeof evaluation[index] !== "undefined") {
            if (evaluation[index]) {
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
    getTemplateParts();
  }, [newInnerHtml]);

  let dropDownOptionIndex = 0;
  let inputIndex = 0;

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
        <TemplateBox className="ql-editor">
          {templateParts &&
            dropdowns > 0 &&
            templateParts.map((templatePart, index) => {
              if (templatePart.indexOf('class="text-dropdown-btn"') !== -1) {
                const optionsIndex = dropDownOptionIndex;
                dropDownOptionIndex++;
                return (
                  <StyeldSelect key={index} onChange={text => handleAddAnswer(text, optionsIndex, "dropDown")}>
                    {options &&
                      options[optionsIndex] &&
                      options[optionsIndex].map((response, respID) => (
                        <Option value={response} key={respID}>
                          {response}
                        </Option>
                      ))}
                  </StyeldSelect>
                );
              }
              if (templatePart.indexOf('class="text-input-btn"') !== -1) {
                const targetIndex = inputIndex;
                inputIndex++;
                return (
                  <InputDiv key={index}>
                    <Input onChange={e => handleAddAnswer(e.target.value, targetIndex, "inputs")} />
                  </InputDiv>
                );
              }
              return <MathP key={index} dangerouslySetInnerHTML={{ __html: templatePart }} />;
            })}
        </TemplateBox>
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

const StyeldSelect = styled(Select)`
  min-width: 80px;
  margin: 0px 4px;
`;

const NoneDiv = styled.div`
  /* display: none; */
  color: red;
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

const MathP = styled.p`
  display: inline;
  p {
    display: inline;
  }
`;

const InputDiv = styled.div`
  min-width: 80px;
  max-width: 120px;
  display: inline-block;
  margin: 0px 4px;
`;
