import React from "react";
import PropTypes from "prop-types";

import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";

import Editor from "react-froala-wysiwyg";

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
    "alert"
  ],
  tableResizerOffset: 10,
  tableResizingLimit: 50
};

// sample extension of custom buttons
FroalaEditor.DefineIcon("alert", { NAME: "info", SVG_KEY: "add" });
FroalaEditor.RegisterCommand("alert", {
  title: "Hello",
  focus: false,
  undo: false,
  refreshAfterCallback: false,
  callback: function() {
    alert("Hello!");
  }
});

const CustomEditor = ({ value, onChange, tag }) => {
  return <Editor tag={tag} model={value} onModelChange={onChange} config={defaultConfig} />;
};

CustomEditor.propTypes = {
  tag: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

CustomEditor.defaultProps = {
  tag: "textarea"
};

export default CustomEditor;
