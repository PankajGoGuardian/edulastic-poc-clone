/* eslint-disable func-names */
/* eslint-disable */
/* global $ */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { message } from "antd";
import { debounce } from "lodash";
import { aws } from "@edulastic/constants";
import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
import Editor from "react-froala-wysiwyg";
import { uploadToS3 } from "../helpers";
import MathModal from "./MathModal";
import { withMathFormula } from "../HOC/withMathFormula";

import { replaceLatexesWithMathHtml, replaceMathHtmlWithLatexes } from "../utils/mathUtils";

FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("data-latex");
FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("class");
FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("mathquill-command-id");
FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("mathquill-block-id");
FroalaEditor.DEFAULTS.htmlAllowedEmptyTags.push("span", "textinput", "textdropdown", "mathinput");

FroalaEditor.DEFAULTS.htmlAllowedTags.push("textinput", "textdropdown", "mathinput");
FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("index", "save", "evaluation", "answers", "options", "item");

// register custom math buttton
FroalaEditor.DefineIconTemplate(
  "math",
  `
  <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.188 21.645" {...props}>
    <g transform="translate(0.375 0.375)">
      <path
        className="a"
        d="M25.261,49.1H12.434L7.4,66.82a1.179,1.179,0,0,1-1.08.817H6.278a1.178,1.178,0,0,1-1.093-.74L3.127,61.751H1.177a1.177,1.177,0,0,1,0-2.354H3.924a1.178,1.178,0,0,1,1.093.74l1.141,2.851,4.3-15.43a1.177,1.177,0,0,1,1.121-.817H25.261a1.177,1.177,0,1,1,0,2.354ZM25.9,64.915,21.255,59.7l4.422-4.909a.294.294,0,0,0-.218-.491h-2.8a.3.3,0,0,0-.223.1L19.47,57.847l-2.945-3.441a.293.293,0,0,0-.224-.1H13.376a.294.294,0,0,0-.219.49l4.373,4.91-4.6,5.213a.294.294,0,0,0,.22.489h2.9a.293.293,0,0,0,.226-.106l3.073-3.687,3.146,3.69a.3.3,0,0,0,.224.1h2.963a.294.294,0,0,0,.219-.49Z"
        transform="translate(0 -46.742)"
      />
    </g>
  </SVG>
  `
);

FroalaEditor.DefineIconTemplate(
  "response",
  `
  <svg xmlns="http://www.w3.org/2000/svg" width="43.081" height="40" viewBox="0 0 43.081 40">
    <g transform="translate(-0.045)">
      <rect width="43.081" height="40" rx="4" transform="translate(0.045)" fill="#aaafb5"/>
      <text transform="translate(17.045 26)" fill="#fff" font-size="14" font-family="OpenSans-SemiBold, Open Sans" font-weight="600" letter-spacing="0.019em">
        <tspan x="0" y="0">R</tspan>
      </text>
    </g>
  </svg>
  `
);

FroalaEditor.DefineIconTemplate("responseBoxes", `<span class="responses-boxes-btn">Response Boxes</span>`);

const symbols = ["basic", "matrices", "general", "units_si", "units_us"];
const numberPad = [
  "7",
  "8",
  "9",
  "\\div",
  "4",
  "5",
  "6",
  "\\times",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  ",",
  "+",
  "left_move",
  "right_move",
  "Backspace",
  "="
];

const DEFAULT_TOOLBAR_BUTTONS = [
  ["bold", "italic", "underline", "strikeThrough", "insertTable"],
  ["paragraphFormat", "align", "undo", "redo", "math", "insertImage"]
];

const NoneDiv = styled.div`
  position: absolute;
  opacity: 0;
`;

const CustomEditor = ({ value, onChange, tag, additionalToolbarOptions, ...restOptions }) => {
  const mathFieldRef = useRef(null);

  const [showMathModal, setMathModal] = useState(false);
  const [currentLatex, setCurrentLatex] = useState("");
  const [currentMathEl, setCurrentMathEl] = useState(null);
  const [content, setContent] = useState("");
  const [prevValue, setPrevValue] = useState("");

  const [mathField, setMathField] = useState(null);

  const EditorRef = useRef(null);

  const config = Object.assign(
    {
      key: "Ig1A7vB5C2A1C1sGXh1WWTDSGXYOUKc1KINLe1OC1c1D-17D2E2F2C1E4G1A2B8E7E7==",
      initOnClick: true,
      toolbarButtons: [...DEFAULT_TOOLBAR_BUTTONS, [...(additionalToolbarOptions || [])]],
      tableResizerOffset: 10,
      tableResizingLimit: 50,
      toolbarInline: true,
      toolbarVisibleWithoutSelection: true,

      events: {
        click: function(evt) {
          const closestMathParent = evt.currentTarget.closest("span.input__math");
          if (closestMathParent) {
            this.selection.save();
            setCurrentLatex(closestMathParent.getAttribute("data-latex"));
            setCurrentMathEl(closestMathParent);
            setMathModal(true);
          } else {
            setCurrentLatex("");
            setCurrentMathEl(null);
          }
        },
        "image.beforeUpload": function(image) {
          this.image.showProgressBar();
          // TODO: pass folder as props
          uploadToS3(image[0], aws.s3Folders.COURSE)
            .then(result => {
              this.image.insert(result);
            })
            .catch(e => {
              console.error(e);
              this.popups.hideAll();
              message.error("image upload failed");
            });

          return false;
        },
        "edit.on": function(e, editor) {
          if (restOptions.readOnly === true) {
            EditorRef.current.edit.off();
          }
        }
      }
    },
    restOptions
  );

  // Math Html related helper functions

  const initMathField = () => {
    if (mathField || !window.MathQuill) return;
    if (mathFieldRef.current) {
      const MQ = window.MathQuill.getInterface(2);
      try {
        setMathField(MQ.StaticMath(mathFieldRef.current));
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  };

  const getMathHtml = latex => {
    if (!mathField) return latex;
    mathField.latex(latex);

    return mathFieldRef.current.outerHTML;
  };

  const setChange = val => {
    setContent(val);

    const valueToSave = replaceMathHtmlWithLatexes(val);
    setPrevValue(valueToSave);

    if (
      !restOptions.toolbarButtons || // Default toolbarButtons are used
      restOptions.toolbarButtons.includes("response") || // toolbarButtons prop contains response
      restOptions.toolbarButtons.includes("mathinput") || // toolbarButtons prop contains mathInput
      restOptions.toolbarButtons.includes("textdropdown") || // toolbarButtons prop contains dropdown
      restOptions.toolbarButtons.includes("textinput") // toolbarButtons prop contains text input
    ) {
      const responseIndexes = $(val)
        .find(".response-btn")
        .map(function() {
          return +$(this).text();
        })
        .toArray();
      const mathInputIndexes = $(val)
        .find(".math-input-btn")
        .map(function() {
          return +$(this).text();
        })
        .toArray();

      const dropDownIndexes = $(val)
        .find(".text-dropdown-btn")
        .map(function() {
          return +$(this).text();
        })
        .toArray();

      const inputIndexes = $(val)
        .find(".text-input-btn")
        .map(function() {
          return +$(this).text();
        })
        .toArray();
      onChange(valueToSave, responseIndexes, mathInputIndexes, dropDownIndexes, inputIndexes);
    } else {
      onChange(valueToSave, []);
    }
  };

  // Math Modal related functions
  const saveMathModal = latex => {
    EditorRef.current.selection.restore();

    const mathHtml = getMathHtml(latex);
    if (currentMathEl) {
      currentMathEl.innerHTML = mathHtml;
      currentMathEl.setAttribute("data-latex", latex);
    } else {
      EditorRef.current.html.insert(
        `<span class="input__math" contenteditable="false" data-latex="${latex}">${mathHtml}</span> `
      );
    }

    // if html is inserted over using editor methods `saveStep` requires to be called
    // to update teh editor. Otherwise `modalChange` wont be triggered!
    EditorRef.current.undo.saveStep();

    setMathModal(false);
  };

  const closeMathModal = () => setMathModal(false);

  // Froala configuration
  const manualControl = ({ getEditor, initialize }) => {
    initialize();
    EditorRef.current = getEditor();
  };

  useEffect(() => {
    // sample extension of custom buttons
    initMathField();

    FroalaEditor.DefineIcon("math", { NAME: "math", template: "math" });
    FroalaEditor.RegisterCommand("math", {
      title: "Math",
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback() {
        EditorRef.current = this;
        this.selection.save();
        setCurrentLatex("");
        setCurrentMathEl(null);
        setMathModal(true);
      }
    });

    FroalaEditor.DefineIcon("response", { NAME: "plus", template: "response" });

    FroalaEditor.RegisterCommand("response", {
      title: "Response",
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback() {
        const responseCount = EditorRef.current.$el[0].querySelectorAll(".response-btn").length;
        this.html.insert(
          ` <span class="response-btn" contenteditable="false"><span class="text">Response</span></span> `
        );
        this.undo.saveStep();
      }
    });

    // Dropdown Toobar button for MathInput/TextDropDown/TextInput
    FroalaEditor.DefineIcon("responseBoxes", { NAME: "responseBoxes", template: "responseBoxes" });
    FroalaEditor.RegisterCommand("responseBoxes", {
      type: "dropdown",
      focus: false,
      undo: true,
      refreshAfterCallback: true,
      options: {
        textinput: "Text Input",
        textdropdown: "Text Dropdown",
        mathinput: "Math Input"
      },
      callback: function(_, op) {
        if (op === "textinput") {
          const inputCount = this.$el[0].querySelectorAll(".text-input-btn").length;
          this.html.insert(
            `<TextInput
                class="text-input-btn"
                contenteditable="false"
                index={{${inputCount}}}
                save={{save}}
                evaluation={{evaluation}}
                checked={{checked}}
                answers={{answers}}
              >Text Input</TextInput>`
          );
        } else if (op === "textdropdown") {
          const dropDownCount = this.$el[0].querySelectorAll(".text-dropdown-btn").length;
          this.html.insert(
            `<TextDropdown
              class="text-dropdown-btn"
              contenteditable="false"
              save={{save}}
              options={{options}}
              checked={{checked}}
              evaluation={{evaluation}}
              answers={{answers}}
              index={{${dropDownCount}}}
              >Text Dropdown</TextDropdown>`
          );
        } else if (op === "mathinput") {
          const mathInputCount = this.$el[0].querySelectorAll(".math-input-btn").length;
          this.html.insert(
            `<MathInput
                class="math-input-btn"
                contenteditable="false"
                index={{${mathInputCount}}}
                item={{item}}
                save={{save}}
                evaluation={{evaluation}}
                checked={{checked}}
                answers={{answers}}
              >Math Input</MathInput>`
          );
        }
        this.undo.saveStep();
      }
    });
  }, []);

  useEffect(() => {
    if (mathFieldRef.current) {
      initMathField();
    }
  }, [mathFieldRef.current]);

  useEffect(() => {
    // In case of prop updates after onChange, we are gonna ignore that.
    if (!value) {
      setContent("");
      setPrevValue("");
      return;
    }

    if (prevValue === value) return;
    setPrevValue(value);
    setContent(replaceLatexesWithMathHtml(value, getMathHtml));
  }, [value]);

  return (
    <>
      <MathModal
        show={showMathModal}
        symbols={symbols}
        numberPad={numberPad}
        showResposnse={false}
        value={currentLatex}
        onSave={saveMathModal}
        onClose={closeMathModal}
      />
      <Editor
        tag={tag}
        model={content}
        onModelChange={setChange}
        config={config}
        onManualControllerReady={manualControl}
      />
      <NoneDiv>
        <span ref={mathFieldRef} className="input__math__field" />
      </NoneDiv>
    </>
  );
};

CustomEditor.propTypes = {
  tag: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  additionalToolbarOptions: PropTypes.array,
  readOnly: PropTypes.bool
};

CustomEditor.defaultProps = {
  tag: "textarea",
  additionalToolbarOptions: [],
  readOnly: false
};

export default withMathFormula(CustomEditor);
