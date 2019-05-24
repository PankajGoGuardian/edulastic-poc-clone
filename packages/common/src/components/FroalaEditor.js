import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";

import Editor from "react-froala-wysiwyg";

import MathModal from "./MathModal";
import { withMathFormula } from "../HOC/withMathFormula";

FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("data-latex");
FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("class");
FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("mathquill-command-id");
FroalaEditor.DEFAULTS.htmlAllowedAttrs.push("mathquill-block-id");
FroalaEditor.DEFAULTS.htmlAllowedEmptyTags.push("span");

// register custom math buttton
FroalaEditor.DefineIconTemplate(
  "math",
  `<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.188 21.645" {...props}>
<g transform="translate(0.375 0.375)">
  <path
    className="a"
    d="M25.261,49.1H12.434L7.4,66.82a1.179,1.179,0,0,1-1.08.817H6.278a1.178,1.178,0,0,1-1.093-.74L3.127,61.751H1.177a1.177,1.177,0,0,1,0-2.354H3.924a1.178,1.178,0,0,1,1.093.74l1.141,2.851,4.3-15.43a1.177,1.177,0,0,1,1.121-.817H25.261a1.177,1.177,0,1,1,0,2.354ZM25.9,64.915,21.255,59.7l4.422-4.909a.294.294,0,0,0-.218-.491h-2.8a.3.3,0,0,0-.223.1L19.47,57.847l-2.945-3.441a.293.293,0,0,0-.224-.1H13.376a.294.294,0,0,0-.219.49l4.373,4.91-4.6,5.213a.294.294,0,0,0,.22.489h2.9a.293.293,0,0,0,.226-.106l3.073-3.687,3.146,3.69a.3.3,0,0,0,.224.1h2.963a.294.294,0,0,0,.219-.49Z"
    transform="translate(0 -46.742)"
  />
</g>
</SVG>`
);

const defaultConfig = {
  toolbarButtons: [
    "bold",
    "italic",
    "underline",
    "strikeThrough",
    "insertTable",
    "|",
    "paragraphFormat",
    "align",
    "undo",
    "redo",
    "math",
    "html"
  ],

  tableResizerOffset: 10,
  tableResizingLimit: 50
};

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

let EditorRef = null;

const NoneDiv = styled.div`
  position: absolute;
  opacity: 0;
`;

const CustomEditor = ({ value, onChange, tag }) => {
  const mathFieldRef = useRef(null);

  const [showMathModal, setMathModal] = useState(false);
  const [currentLatex, setCurrentLatex] = useState("");
  const [currentMathEl, setCurrentMathEl] = useState(null);

  defaultConfig.events = {
    click: evt => {
      const closestMathParent = evt.currentTarget.closest("span.mq-math-mode[contenteditable=false]");
      if (closestMathParent) {
        setCurrentLatex(closestMathParent.getAttribute("data-latex"));
        setCurrentMathEl(closestMathParent);
        setMathModal(true);
      } else {
        setCurrentLatex("");
        setCurrentMathEl(null);
      }
    },
    keyup: evt => {
      // Add deletion logic here.
      console.log("evt: ", evt);
    }
  };

  useEffect(() => {
    // sample extension of custom buttons

    FroalaEditor.DefineIcon("math", { NAME: "math", template: "math" });
    FroalaEditor.RegisterCommand("math", {
      title: "Math",
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback() {
        EditorRef.selection.save();
        setCurrentLatex("");
        setCurrentMathEl(null);
        setMathModal(true);
      }
    });
  });

  const setMathValue = latex => {
    const MQ = window.MathQuill.getInterface(2);

    const mathfield = MQ.StaticMath(mathFieldRef.current);
    mathfield.latex(latex);
    EditorRef.selection.restore();
    if (currentMathEl) {
      currentMathEl.innerHTML = mathFieldRef.current.innerHTML;
      currentMathEl.setAttribute("data-latex", latex);
    } else {
      EditorRef.html.insert(
        `<span data-latex="${latex}" contenteditable="false" class="mq-math-mode">${
          mathFieldRef.current.innerHTML
        }</span>`
      );
    }

    setMathModal(false);
  };

  const closeMathModal = () => setMathModal(false);

  const manualControl = ({ getEditor, initialize }) => {
    initialize();
    EditorRef = getEditor();
    window.eRef = EditorRef;
  };

  const setChange = val => {
    onChange(val);
  };

  return (
    <>
      <MathModal
        show={showMathModal}
        symbols={symbols}
        numberPad={numberPad}
        showResposnse={false}
        value={currentLatex}
        onSave={setMathValue}
        onClose={closeMathModal}
      />
      <Editor
        tag={tag}
        model={value}
        onModelChange={setChange}
        config={defaultConfig}
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
  onChange: PropTypes.func.isRequired
};

CustomEditor.defaultProps = {
  tag: "textarea"
};

export default withMathFormula(CustomEditor);
