/* eslint-disable func-names */
/* eslint-disable */
/* global $ */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { cloneDeep, debounce } from "lodash";
import { message } from "antd";
import Editor from "react-froala-wysiwyg";
import uuid from "uuid/v4";
import { withMathFormula } from "../HOC/withMathFormula";
import { aws, math } from "@edulastic/constants";
import { white, dashBorderColor, greyThemeLight, greyThemeLighter } from "@edulastic/colors";
import FroalaEditor from "froala-editor";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/plugins.pkgd.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// froala.min.css is loaded at index as it required for preview as well.

import { uploadToS3, reIndexResponses, canInsert, beforeUpload } from "../helpers";
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

FroalaEditor.DefineIconTemplate(
  "specialCharacters",
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 469.333 469.333" style="enable-background:new 0 0 469.333 469.333;" xml:space="preserve">
  <g>
    <g>
      <g>
        <path d="M253.227,300.267L253.227,300.267L199.04,246.72l0.64-0.64c37.12-41.387,63.573-88.96,79.147-139.307h62.507V64H192     V21.333h-42.667V64H0v42.453h238.293c-14.4,41.173-36.907,80.213-67.627,114.347c-19.84-22.08-36.267-46.08-49.28-71.467H78.72     c15.573,34.773,36.907,67.627,63.573,97.28l-108.48,107.2L64,384l106.667-106.667l66.347,66.347L253.227,300.267z"/>
        <path d="M373.333,192h-42.667l-96,256h42.667l24-64h101.333l24,64h42.667L373.333,192z M317.333,341.333L352,248.853     l34.667,92.48H317.333z"/>
      </g>
    </g>
  </g>
  </svg>`
);

FroalaEditor.DEFAULTS.specialCharacterSets = [
  {
    title: "spanish",
    char: "&iexcl;"
  }
];

FroalaEditor.DefineIconTemplate("response", `<span class="custom-toolbar-btn">Drop Area</span>`);
FroalaEditor.DefineIconTemplate("responseBoxes", `<span class="custom-toolbar-btn">Response Boxes</span>`);
FroalaEditor.DefineIconTemplate("textinput", `<span class="custom-toolbar-btn">Text Input</span>`);
FroalaEditor.DefineIconTemplate("textdropdown", `<span class="custom-toolbar-btn">Text Dropdown</span>`);
FroalaEditor.DefineIconTemplate("mathinput", `<span class="custom-toolbar-btn">Math Input</span>`);
FroalaEditor.DefineIconTemplate("mathunit", `<span class="custom-toolbar-btn">Math w/ units</span>`);
FroalaEditor.DefineIconTemplate("paragraphNumber", `<span class="custom-toolbar-btn">PN</span>`);

const symbols = ["basic", "intermediate", "advanced", "units_si", "units_us", "all"];
const { defaultNumberPad } = math;

FroalaEditor.VIDEO_PROVIDERS.push({
  test_regex: /^.+(screencast-o-matic.com)\/[^_&]+/,
  url_regex: "",
  url_text: "",
  html: '<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>',
  provider: "screencast"
});
const buttons = [
  "bold",
  "italic",
  "underline",
  "insertVideo",
  "fontSize",
  "indent",
  "outdent",
  "math",
  "paragraphFormat",
  "insertTable",
  "insertImage",
  "insertLink",
  "align",
  "backgroundColor",
  "textColor",
  "strikeThrough",
  "subscript",
  "superscript",
  "undo",
  "redo",
  "specialCharacters"
];

const DEFAULT_TOOLBAR_BUTTONS = {
  STD: {
    moreText: {
      buttons,
      buttonsVisible: 10
    }
  },
  MD: {
    moreText: {
      buttons,
      buttonsVisible: 8
    }
  },
  SM: {
    moreText: {
      buttons,
      buttonsVisible: 8
    }
  },
  XS: {
    moreText: {
      buttons,
      buttonsVisible: 7
    }
  }
};

const NoneDiv = styled.div`
  position: absolute;
  opacity: 0;
`;

const BackgroundStyleWrapper = styled.div.attrs({
  className: "froala-wrapper"
})`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: ${props => props.fontSize || props.theme.fontSize};
  .fr-box.fr-basic .fr-wrapper {
    background: ${props => props.backgroundColor || "rgb(255, 255, 255)"};
  }

  .fr-wrapper {
    ${({ centerContent }) => {
      if (centerContent) {
        return `.fr-element p,
        &.show-placeholder .fr-placeholder{
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          overflow-wrap: break-word;
          img{
            margin:auto;
            display:block;
          }
        }        
        `;
      }
    }}
  }

  ${({ border }) => {
    if (border === "border") {
      return `
        .fr {
          &-box {
            background: ${greyThemeLighter};
            min-height: 120px;
            border-radius: 0px;
            border: 1px solid ${greyThemeLight};
            display: flex;
          }
          &-wrapper {
            width: 100%;
            min-height: 100%;
            display: flex;
          }
          &-view {
            width: 100%;
            min-height: 100%;
            padding: 20px 23px;
          }
        }
      `;
    }
  }}
`;

export const ToolbarContainer = styled.div`
  position: absolute;
  z-index: 1000;
  left: 0px;
  right: 0px;
  bottom: 100%;
  .fr-toolbar .fr-command.fr-btn {
    margin: 0 2px !important;
  }

  .fr-toolbar.fr-top {
    border-radius: 2px !important;
    border: 1px solid #cccccc !important;
    left: 0 !important;
    top: 0 !important;
  }
`;

// if (border === "border") {
export const Placeholder = styled.div.attrs({
  className: "froala-placeholder"
})`
  position: absolute;
  top: ${props => (props.border === "border" ? 20 : 0) + (props.toolbarExpanded ? 50 : 0) + "px"};
  left: ${props => (props.border === "border" ? "23px" : 0)};
  right: 0;
  opacity: 0.7;
  color: #cccccc;
  z-index: 1;
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

const getToolbarButtons = (size, toolbarSize, additionalToolbarOptions, buttons) => {
  const sizeMap = {
    STD: { STD: "STD", MD: "MD", SM: "SM", XS: "XS" },
    MD: { STD: "MD", MD: "MD", SM: "SM", XS: "XS" },
    SM: { STD: "SM", MD: "SM", SM: "SM", XS: "XS" },
    XS: { STD: "XS", MD: "XS", SM: "XS", XS: "XS" }
  };
  const cSize = sizeMap[toolbarSize][size];
  const toolbarButtons = cloneDeep(DEFAULT_TOOLBAR_BUTTONS[cSize]);
  toolbarButtons.moreText.buttons = buttons ? [...buttons] : [...toolbarButtons.moreText.buttons];
  toolbarButtons.moreMisc = {
    buttons: additionalToolbarOptions,
    buttonsVisible: 3
  };

  return toolbarButtons;
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve();
    };
    image.onerror = () => {
      reject();
    };
    image.src = src;
  });
}

const CustomEditor = ({
  value,
  onChange,
  toolbarId,
  tag,
  toolbarSize,
  additionalToolbarOptions,
  initOnClick,
  theme,
  border,
  centerContent,
  imageDefaultWidth,
  placeholder,
  fontSize,
  className,
  buttons,
  ...restOptions
}) => {
  const mathFieldRef = useRef(null);
  const toolbarContainerRef = useRef(null);
  const [showMathModal, setMathModal] = useState(false);
  const [mathModalIsEditable, setMathModalIsEditable] = useState(true);
  const [currentLatex, setCurrentLatex] = useState("");
  const [currentMathEl, setCurrentMathEl] = useState(null);
  const [content, setContent] = useState("");
  const [prevValue, setPrevValue] = useState("");
  const [toolbarExpanded, setToolbarExpanded] = useState(false);

  const [mathField, setMathField] = useState(null);

  const EditorRef = useRef(null);

  const toolbarButtons = getToolbarButtons("STD", toolbarSize, additionalToolbarOptions, buttons);
  const toolbarButtonsMD = getToolbarButtons("MD", toolbarSize, additionalToolbarOptions, buttons);
  const toolbarButtonsSM = getToolbarButtons("SM", toolbarSize, additionalToolbarOptions, buttons);
  const toolbarButtonsXS = getToolbarButtons("XS", toolbarSize, additionalToolbarOptions, buttons);
  const config = Object.assign(
    {
      key: process.env.POI_APP_FROALA_KEY,
      imageInsertButtons: ["imageUpload"], // hide other image uplaod options
      videoInsertButtons: ["videoBack", "|", "videoByURL", "videoEmbed"],
      imageDefaultDisplay: "inline",
      linkAlwaysBlank: true, // adding to make link always open in blank
      zIndex: 999,
      imageDefaultWidth: imageDefaultWidth,
      videoDefaultWidth: 200,
      initOnClick,
      toolbarButtons,
      toolbarButtonsMD,
      toolbarButtonsSM,
      toolbarButtonsXS,
      videoResponsive: true,
      tableResizerOffset: 10,
      tableResizingLimit: 50,
      toolbarInline: true,
      tooltips: false,
      toolbarVisibleWithoutSelection: true,
      toolbarContainer: toolbarId ? `#froalaToolbarContainer-${toolbarId}` : undefined,
      placeholderText: placeholder,
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
        "path",
        "line",
        "textinput",
        "textdropdown",
        "mathinput",
        "mathunit",
        "paragraphnumber",
        "response",
        "specialCharacters"
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
      fontSize: ["12", "14", "16", "20"],
      fontSizeDefaultSelection: "14",
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
            if (parent && range.startOffset === range.endOffset) {
              const cursorEl = parent.childNodes[range.startOffset - 1];
              if (!cursorEl || !cursorEl.tagName) return;

              if (
                ["RESPONSE", "TEXTINPUT", "TEXTDROPDOWN", "MATHINPUT", "PARAGRAPHNUMBER", "MATHUNIT"].includes(
                  cursorEl.tagName
                )
              ) {
                cursorEl.remove();
                this.selection.save();
                const updatedHtml = reIndexResponses(this.html.get(true));
                if (updatedHtml) {
                  this.html.set(updatedHtml);
                }
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
              return;
            }
            if (cursorEl.tagName === "SPAN" && $(cursorEl).hasClass("input__math") && $(cursorEl).attr("data-latex")) {
              cursorEl.remove();
              return;
            }
          }
        },
        "image.beforeUpload": function(image, clipboardImage) {
          if (
            !canInsert(this.selection.element()) ||
            !canInsert(this.selection.endElement()) ||
            !beforeUpload(image[0])
          )
            return false;
          this.image.showProgressBar();
          // TODO: pass folder as props
          uploadToS3(image[0], aws.s3Folders.DEFAULT)
            .then(result => {
              this.image.insert(result, false, null, clipboardImage);
            })
            .catch(e => {
              console.error(e);
              this.popups.hideAll();
              message.error("image upload failed");
            });

          return false;
        },
        "image.inserted": async function($img, response) {
          try {
            if (!$img[0].complete) {
              await loadImage($img[0].src);
              $img.css({
                verticalAlign: "middle",
                width: $img[0].naturalWidth < imageDefaultWidth ? `${$img[0].naturalWidth}px` : `${imageDefaultWidth}px`
              });
            }
          } catch (e) {
            message.error("image loading failed");
          }
        },
        "edit.on": function(e, editor) {
          if (restOptions.readOnly === true) {
            this.edit.off();
            this.$el.find(".input__math").css("pointer-events", "none");
            this.$el.find("img").css("pointer-events", "none");
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
          this._original_html = value;
        },
        focus: function() {
          if (initOnClick) {
            this.hasFocus = true;
          }
        },
        blur: function() {
          if (initOnClick) {
            this.hasFocus = false;
            this.toolbar.hide();
          }
        },
        "commands.after": function(cmd) {
          if (cmd === "moreText") {
            this.toolbarExpanded = !this.toolbarExpanded;
            setToolbarExpanded(this.toolbarExpanded);
            return;
          }
          if (
            cmd === "textinput" ||
            cmd === "textdropdown" ||
            cmd === "mathinput" ||
            cmd === "mathunit" ||
            cmd === "response" ||
            cmd === "paragraphNumber"
          ) {
            this.selection.save();
            const updatedHtml = reIndexResponses(this.html.get(true));
            if (updatedHtml) {
              this.html.set(updatedHtml);
            }
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

  const setChange = val => {
    setContent(val);

    const valueToSave = replaceMathHtmlWithLatexes(val);
    setPrevValue(valueToSave);

    onChange(valueToSave);
  };

  // Math Modal related functions
  const saveMathModal = latex => {
    if (!latex) {
      //close the modal and return back if nothing was entered
      setMathModal(false);
      EditorRef.current.selection.restore(); // set cursor at the end of content
      return;
    }
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

  const hasResponseBoxBtn = () =>
    additionalToolbarOptions.includes("textinput") ||
    additionalToolbarOptions.includes("response") ||
    additionalToolbarOptions.includes("mathinput") ||
    additionalToolbarOptions.includes("mathunit") ||
    additionalToolbarOptions.includes("textdropdown") ||
    additionalToolbarOptions.includes("responseBoxes") ||
    additionalToolbarOptions.includes("paragraphNumber");

  useEffect(() => {
    // sample extension of custom buttons
    initMathField();
    if (value && hasResponseBoxBtn()) {
      setChange(reIndexResponses(value));
    }
    // Math Input
    FroalaEditor.DefineIcon("math", { NAME: "math", template: "math" });
    FroalaEditor.DefineIcon("specialCharacters", { NAME: "specialCharacters", template: "specialCharacters" });

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
      title: "Drop Area",
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback() {
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`&nbsp;<Response id="${uuid()}" contentEditable="false"></Response>&nbsp;`);
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
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`&nbsp;<TextInput id="${uuid()}" contentEditable="false"></TextInput>&nbsp;`);
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
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`&nbsp;<TextDropdown id="${uuid()}" contentEditable="false"></TextDropdown>&nbsp;`);
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
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`&nbsp;<MathInput id="${uuid()}" contentEditable="false"></MathInput>&nbsp;`);
        this.undo.saveStep();
      }
    });

    // Register mathunit command for Math Unit button
    FroalaEditor.DefineIcon("mathunit", { NAME: "mathunit", template: "mathunit" });
    FroalaEditor.RegisterCommand("mathunit", {
      title: "Math w/ units",
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback() {
        if (!canInsert(this.selection.element()) || !canInsert(this.selection.endElement())) return false;
        this.html.insert(`&nbsp;<MathUnit id="${uuid()}" contentEditable="false"></MathUnit>&nbsp;`);
        this.undo.saveStep();
      }
    });

    // Dropdown Toobar button for MathInput/TextDropDown/TextInput/MathUnits
    FroalaEditor.DefineIcon("responseBoxes", { NAME: "responseBoxes", template: "responseBoxes" });
    FroalaEditor.RegisterCommand("responseBoxes", {
      type: "dropdown",
      focus: false,
      undo: true,
      refreshAfterCallback: true,
      options: {
        textinput: "Text Input",
        textdropdown: "Text Dropdown",
        mathinput: "Math Input",
        mathunit: "Math w/ units"
      },
      callback: function(_, op) {
        // OP is registered commands
        this.commands.exec(op);
      }
    });

    FroalaEditor.DefineIcon("paragraphNumber", { NAME: "paragraphNumber", template: "paragraphNumber" });
    FroalaEditor.RegisterCommand("paragraphNumber", {
      title: "paragraphNumber",
      focus: false,
      undo: true,
      refreshAfterCallback: true,
      callback: function() {
        this.html.insert(`<ParagraphNumber></ParagraphNumber>`);
        this.undo.saveStep();
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
        numberPad={defaultNumberPad}
        showDropdown
        showResposnse={false}
        value={currentLatex}
        onSave={saveMathModal}
        onClose={closeMathModal}
      />
      <BackgroundStyleWrapper
        backgroundColor={config.backgroundColor}
        centerContent={centerContent}
        border={border}
        theme={theme}
        fontSize={fontSize}
        className={className}
      >
        {toolbarId && (
          <ToolbarContainer
            toolbarid={toolbarId}
            id={`froalaToolbarContainer-${toolbarId}`}
            ref={toolbarContainerRef}
            toolbarId={toolbarId}
          />
        )}

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
  toolbarSize: PropTypes.oneOf(["STD", "MD", "SM", "XS"]),
  additionalToolbarOptions: PropTypes.array,
  readOnly: PropTypes.bool,
  imageDefaultWidth: PropTypes.number,
  initOnClick: PropTypes.bool,
  border: PropTypes.string,
  centerContent: PropTypes.bool
};

CustomEditor.defaultProps = {
  tag: "textarea",
  toolbarId: null,
  initOnClick: true,
  toolbarSize: "STD",
  additionalToolbarOptions: [],
  readOnly: false,
  imageDefaultWidth: 300,
  border: "none",
  centerContent: false
};

export default withTheme(withMathFormula(CustomEditor));
