/* eslint-disable func-names */
/* eslint-disable */
/* global $ */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cloneDeep, debounce } from "lodash";
import { message } from "antd";
import { withMathFormula } from "../HOC/withMathFormula";
import { aws } from "@edulastic/constants";
import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
// froala.min.css is loaded at index as it required for preview as well.

import Editor from "react-froala-wysiwyg";
import { uploadToS3, canInsert } from "../helpers";
import headings from "./FroalaPlugins/headings";

import MathModal from "./MathModal";

import { getMathHtml, replaceLatexesWithMathHtml, replaceMathHtmlWithLatexes } from "../utils/mathUtils";

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

FroalaEditor.DEFAULTS.specialCharacterSets = [
  {
    title: "spanish",
    char: "&iexcl;"
  }
];

FroalaEditor.DefineIconTemplate("response", `<span class="custom-toolbar-btn">Response</span>`);
FroalaEditor.DefineIconTemplate("responseBoxes", `<span class="custom-toolbar-btn">Response Boxes</span>`);
FroalaEditor.DefineIconTemplate("textinput", `<span class="custom-toolbar-btn">Text Input</span>`);
FroalaEditor.DefineIconTemplate("textdropdown", `<span class="custom-toolbar-btn">Text Dropdown</span>`);
FroalaEditor.DefineIconTemplate("mathinput", `<span class="custom-toolbar-btn">Math Input</span>`);

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

const DEFAULT_TOOLBAR_BUTTONS = {
  moreText: {
    buttons: [
      "bold",
      "italic",
      "underline",
      "backgroundColor",
      "textColor",
      "fontFamily",
      "fontSize",
      "strikeThrough",
      "insertTable",
      "indent",
      "outdent",
      "specialCharacters"
    ],
    buttonsVisible: 6
  },
  moreParagraph: {
    buttons: ["paragraphFormat", "align", "undo", "redo", "math", "insertImage"],
    buttonsVisible: 6
  }
};

const NoneDiv = styled.div`
  position: absolute;
  opacity: 0;
`;

const BackgroundStyleWrapper = styled.div`
  position: relative;
  width: 100%;
  display: block;

  .fr-box.fr-basic .fr-wrapper {
    background: ${props => props.backgroundColor || "rgb(255, 255, 255)"};
  }
`;

export const ToolbarContainer = styled.div.attrs({
  className: "froala-toolbar-container",
  toolbarId: props => props.toolbarId
})`
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  z-index: 1000;

  .fr-toolbar .fr-command.fr-btn {
    margin: 0 2px !important;
  }

  .fr-toolbar.fr-top {
    border-radius: 2px !important;
    border: 1px solid #cccccc !important;
  }
`;

//adds h1 & h2 buttons commands to froala editor.
headings(FroalaEditor);

const getFixedPostion = el => {
  return {
    top: $(el).offset().top - $(window).scrollTop(),
    left: $(el).offset().left - $(window).scrollLeft(),
    width: $(el).width(),
    height: $(el).height()
  };
};

const CustomEditor = ({ value, onChange, toolbarId, tag, additionalToolbarOptions, ...restOptions }) => {
  const mathFieldRef = useRef(null);
  const toolbarContainerRef = useRef(null);

  const [showMathModal, setMathModal] = useState(false);
  const [mathModalIsEditable, setMathModalIsEditable] = useState(true);
  const [currentLatex, setCurrentLatex] = useState("");
  const [currentMathEl, setCurrentMathEl] = useState(null);
  const [content, setContent] = useState("");
  const [prevValue, setPrevValue] = useState("");

  const [mathField, setMathField] = useState(null);

  const EditorRef = useRef(null);

  const toolbarButtons = cloneDeep(DEFAULT_TOOLBAR_BUTTONS);
  toolbarButtons.moreMisc = {
    buttons: additionalToolbarOptions,
    buttonsVisible: 3
  };
  const toolbarButtonsMD = cloneDeep(toolbarButtons);
  toolbarButtonsMD.moreText.buttonsVisible = 3;
  toolbarButtonsMD.moreParagraph.buttonsVisible = 3;

  const toolbarButtonsSM = cloneDeep(toolbarButtons);
  toolbarButtonsSM.moreText.buttonsVisible = 2;
  toolbarButtonsSM.moreParagraph.buttonsVisible = 2;

  const toolbarButtonsXS = cloneDeep(toolbarButtons);
  toolbarButtonsXS.moreText.buttonsVisible = 1;
  toolbarButtonsXS.moreParagraph.buttonsVisible = 1;

  const config = Object.assign(
    {
      key: "Ig1A7vB5C2A1C1sGXh1WWTDSGXYOUKc1KINLe1OC1c1D-17D2E2F2C1E4G1A2B8E7E7==",
      imageInsertButtons: ["imageUpload"], // hide other image uplaod options
      imageDefaultDisplay: "inline",
      initOnClick: true,
      toolbarButtons,
      toolbarButtonsMD,
      toolbarButtonsSM,
      toolbarButtonsXS,
      tableResizerOffset: 10,
      tableResizingLimit: 50,
      toolbarInline: true,
      toolbarVisibleWithoutSelection: true,
      toolbarContainer: toolbarId ? `div.froala-toolbar-container[toolbarId="${toolbarId}"]` : undefined,
      htmlAllowedEmptyTags: [
        "textarea",
        "a",
        "iframe",
        "object",
        "video",
        "style",
        "script",
        ".fa",
        "span",
        "p",
        "path",
        "line",
        "textinput",
        "textdropdown",
        "mathinput",
        "response"
      ],
      specialCharactersSets: [
        {
          title: "spanish",
          char: "s",
          list: [
            {
              char: "&aacute;",
              desc: "LATIN SMALL LETTER A WITH ACUTE"
            },
            {
              char: "&Aacute;",
              desc: "LATIN CAPITAL LETTER A WITH ACUTE"
            },
            {
              char: "&eacute;",
              desc: "LATIN SMALL LETTER E WITH ACUTE"
            },
            {
              char: "&Eacute;",
              desc: "LATIN CAPITAL LETTER E WITH ACUTE"
            },
            {
              char: "&iacute;",
              desc: "LATIN SMALL LETTER i WITH ACUTE"
            },
            {
              char: "&Iacute;",
              desc: "LATIN CAPITAL LETTER I WITH ACUTE"
            },
            {
              char: "&ntilde;",
              desc: "LATIN SMALL LETTER N WITH TILDE"
            },
            {
              char: "&Ntilde;",
              desc: "LATIN CAPITAL LETTER N WITH TILDE"
            },
            {
              char: "&oacute;",
              desc: "LATIN SMALL LETTER 0 WITH ACUTE"
            },
            {
              char: "&Oacute;",
              desc: "LATIN CAPITAL LETTER O WITH ACUTE"
            },
            {
              char: "&uacute;",
              desc: "LATIN SMALL LETTER u WITH ACUTE"
            },
            {
              char: "&Uacute;",
              desc: "LATIN CAPITAL LETTER U WITH ACUTE"
            },
            {
              char: "&uuml;",
              desc: "LATIN SMALL LETTER U WITH DIAERESIS"
            },
            {
              char: "&Uuml;",
              desc: "LATIN CAPITAL LETTER U WITH DIAERESIS"
            },
            {
              char: "&iexcl;",
              desc: "INVERTED EXCLAMATION MARK"
            },
            {
              char: "&iquest;",
              desc: "INVERTED QUESTION MARK"
            }
          ]
        }
      ],
      htmlAllowedTags: [".*"],
      htmlAllowedAttrs: [".*"],
      htmlRemoveTags: ["script"],

      events: {
        click: function(evt) {
          const closestMathParent = evt.currentTarget.closest("span.input__math");
          if (closestMathParent) {
            this.selection.save();
            setCurrentLatex(closestMathParent.getAttribute("data-latex"));
            const mqeditable = closestMathParent.getAttribute("mqeditable");
            setMathModalIsEditable(mqeditable !== "false");
            setCurrentMathEl(closestMathParent);
            setMathModal(true);
          } else {
            setCurrentLatex("");
            setCurrentMathEl(null);
          }
        },
        keydown: function(evt) {
          if (evt.which === 8) {
            const range = this.selection.ranges()[0];
            const parent = range.commonAncestorContainer;
            if (parent && range.startOffset === range.endOffset && parent.tagName === "P") {
              const cursorEl = parent.childNodes[range.startOffset - 1];
              if (["RESPONSE", "TEXTINPUT", "TEXTDROPDOWN", "MATHINPUT"].includes(cursorEl.tagName)) {
                cursorEl.remove();
                return;
              }
              if (
                cursorEl.tagName === "SPAN" &&
                $(cursorEl).hasClass("input__math") &&
                $(cursorEl).attr("data-latex")
              ) {
                cursorEl.remove();
                return;
              }
            }
          }
        },
        "image.beforeUpload": function(image) {
          if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
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
        "image.inserted": function($img, response) {
          $img.css({ verticalAlign: "middle" });
        },
        "edit.on": function(e, editor) {
          if (restOptions.readOnly === true) {
            this.edit.off();
          }
        },
        "toolbar.hide": function() {
          if (this.hasFocus) {
            return false;
          } else {
            return true;
          }
        },
        initialized: function() {
          this.hasFocus = false;
        },
        focus: function() {
          this.hasFocus = true;
          this.toolbar.show();
        },
        blur: function() {
          this.hasFocus = false;
          this.toolbar.hide();
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
        .find("response")
        .map(function() {
          return +$(this).text();
        })
        .toArray();
      const mathInputIndexes = $(val)
        .find("mathinput")
        .map(function() {
          return +$(this).text();
        })
        .toArray();

      const dropDownIndexes = $(val)
        .find("textdropdown")
        .map(function() {
          return +$(this).text();
        })
        .toArray();

      const inputIndexes = $(val)
        .find("textinput")
        .map(function() {
          return +$(this).text();
        })
        .toArray();
      onChange(valueToSave, mathInputIndexes, dropDownIndexes, inputIndexes);
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

    // Math Input
    FroalaEditor.DefineIcon("math", { NAME: "math", template: "math" });
    FroalaEditor.RegisterCommand("math", {
      title: "Math",
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback() {
        EditorRef.current = this;
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.selection.save();
        setCurrentLatex("");
        setCurrentMathEl(null);
        setMathModal(true);
        this.undo.saveStep();
      }
    });

    // Register response commnad for Response Button
    FroalaEditor.DefineIcon("response", { NAME: "response", template: "response" });
    FroalaEditor.RegisterCommand("response", {
      title: "Response",
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback() {
        const responseCount = this.$el[0].querySelectorAll("response").length;
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`<Response index={{${responseCount}}} contentEditable="false">Response</Response>`);
        this.undo.saveStep();
      }
    });

    // Register textinput command for Text Input button
    FroalaEditor.DefineIcon("textinput", { NAME: "textinput", template: "textinput" });
    FroalaEditor.RegisterCommand("textinput", {
      title: "Text Input",
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback() {
        const inputCount = this.$el[0].querySelectorAll("textinput").length;
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`<TextInput index={{${inputCount}}} contentEditable="false">Text Input</TextInput>`);
        this.undo.saveStep();
      }
    });

    // Register textdropdown command for Text Dropdown button
    FroalaEditor.DefineIcon("textdropdown", { NAME: "textdropdown", template: "textdropdown" });
    FroalaEditor.RegisterCommand("textdropdown", {
      title: "Text Dropdown",
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback() {
        const dropDownCount = this.$el[0].querySelectorAll("textdropdown").length;
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(
          `<TextDropdown index={{${dropDownCount}}} contentEditable="false">Text Dropdown</TextDropdown>`
        );
        this.undo.saveStep();
      }
    });

    // Register mathinput command for Math Input button
    FroalaEditor.DefineIcon("mathinput", { NAME: "mathinput", template: "mathinput" });
    FroalaEditor.RegisterCommand("mathinput", {
      title: "Math Input",
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback() {
        const mathInputCount = this.$el[0].querySelectorAll("mathinput").length;
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`<MathInput index={{${mathInputCount}}} contentEditable="false">Math Input</MathInput>`);
        this.undo.saveStep();
      }
    });

    // Dropdown Toobar button for MathInput/TextDropDown/TextInput mathinput
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
        // OP is registered commands
        this.commands.exec(op);
      }
    });

    if (toolbarId) {
      const onScroll = debounce(e => {
        const toolbarPosInfo = getFixedPostion(toolbarContainerRef.current);
        const editorPosInfo = getFixedPostion(EditorRef.current.$el);

        if (editorPosInfo.top > 150) {
          if ($(toolbarContainerRef.current).css("position") === "fixed") {
            $(toolbarContainerRef.current).css("position", "");
            $(toolbarContainerRef.current).css("top", "");
            $(toolbarContainerRef.current).css("left", "");
            $(toolbarContainerRef.current).css("width", "");
            $(toolbarContainerRef.current).css("height", "");
          }
        } else {
          if ($(toolbarContainerRef.current).css("position") !== "fixed") {
            $(toolbarContainerRef.current).css("position", "fixed");
            $(toolbarContainerRef.current).css("top", "100px");
            $(toolbarContainerRef.current).css("left", toolbarPosInfo.left);
            $(toolbarContainerRef.current).css("width", toolbarPosInfo.width);
            $(toolbarContainerRef.current).css("height", toolbarPosInfo.height);
          }
        }
      }, 100);
      window.addEventListener("scroll", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
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
    setContent(replaceLatexesWithMathHtml(value));
  }, [value]);

  return (
    <>
      <MathModal
        isEditable={mathModalIsEditable}
        show={showMathModal}
        symbols={symbols}
        numberPad={numberPad}
        showResposnse={false}
        value={currentLatex}
        onSave={saveMathModal}
        onClose={closeMathModal}
      />
      <BackgroundStyleWrapper backgroundColor={config.backgroundColor}>
        {toolbarId && <ToolbarContainer innerRef={toolbarContainerRef} toolbarId={toolbarId} />}
        <Editor
          tag={tag}
          model={content}
          onModelChange={setChange}
          config={config}
          onManualControllerReady={manualControl}
        />
      </BackgroundStyleWrapper>
      <NoneDiv>
        <span ref={mathFieldRef} className="input__math__field" />
      </NoneDiv>
    </>
  );
};

CustomEditor.propTypes = {
  tag: PropTypes.string,
  value: PropTypes.string.isRequired,
  toolbarId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  additionalToolbarOptions: PropTypes.array,
  readOnly: PropTypes.bool
};

CustomEditor.defaultProps = {
  tag: "textarea",
  toolbarId: null,
  additionalToolbarOptions: [],
  readOnly: false
};

export default withMathFormula(CustomEditor);
