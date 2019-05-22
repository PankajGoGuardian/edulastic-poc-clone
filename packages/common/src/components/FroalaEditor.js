import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

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

window.fEditor = FroalaEditor;

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
    "alert",
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

const CustomEditor = ({ value, onChange, tag }) => {
  const [showMathModal, setMathModal] = useState(false);

  useEffect(() => {
    // sample extension of custom buttons

    FroalaEditor.DefineIcon("alert", { NAME: "info", SVG_KEY: "add" });
    FroalaEditor.RegisterCommand("alert", {
      title: "Hello",
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function() {
        setMathModal(true);
      }
    });
  });

  const setMathValue = latex => {
    const MQ = window.MathQuill.getInterface(2);

    const el = document.createElement("span");
    el.setAttribute("data-latex", latex);
    const mathfield = MQ.StaticMath(el);
    mathfield.latex(latex);
    EditorRef.html.insert(el.outerHTML);
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
