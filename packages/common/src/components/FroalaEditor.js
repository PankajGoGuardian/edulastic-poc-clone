/* eslint-disable func-names */
/* eslint-disable */
/* global $ */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { cloneDeep, debounce, isEmpty } from "lodash";
import { message } from "antd";
import { notification, sanitizeString } from "@edulastic/common";
import Editor from "react-froala-wysiwyg";
import uuid from "uuid/v4";
import { withMathFormula } from "../HOC/withMathFormula";
import { aws, math } from "@edulastic/constants";
import { white, dashBorderColor, greyThemeLight, greyThemeLighter, smallDesktopWidth } from "@edulastic/colors";
import FroalaEditor from "froala-editor";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/plugins.pkgd.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
// froala.min.css is loaded at index as it required for preview as well.

import { uploadToS3, reIndexResponses, canInsert, beforeUpload } from "../helpers";
import headings from "./FroalaPlugins/headings";

import MathModal from "./MathModal";

import { getMathHtml, replaceLatexesWithMathHtml, replaceMathHtmlWithLatexes } from "../utils/mathUtils";
import { compose } from "redux";
import { connect } from "react-redux";

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

const symbols = ["all"];
const { defaultNumberPad } = math;

FroalaEditor.VIDEO_PROVIDERS.push(
  {
    test_regex: /^.+(screencast-o-matic.com)\/[^_&]+/,
    url_regex: "",
    url_text: "",
    html: '<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>',
    provider: "screencast"
  },
  {
    test_regex: /^.+(drive.google.com)\/(file)\/(d)\/[^_&]+/,
    url_regex: /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:drive\.google\.com)\/(?:file)\/(?:d)\/?([0-9a-zA-Z_\-]+)(.+)?/g,
    url_text: "https://drive.google.com/file/d/$1/preview",
    html: `<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>`,
    provider: "google-drive"
  }
);

FroalaEditor.VIDEO_EMBED_REGEX = /<iframe[^>]*?(?:\/>|>[^<]*?<\/iframe>|(<embed.*>))\W*$/i;

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

const defaultCharacterSets = [
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
];

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
  @media (max-width: ${smallDesktopWidth}) {
    font-size: 13px;
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
            min-height: 102px;
            border-radius: 2px;
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
            padding: 8px 14px;
            overflow: auto;
          }
        }
      `;
    } else {
      /**
       * need to show scroll if math content overflows
       * @see https://snapwiz.atlassian.net/browse/EV-10575
       */
      return `
      .fr-box {
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
        }
      `;
    }
  }}

  ${({ editorHeight }) => {
    if (editorHeight > 40) {
      return `
        .fr {
          &-box {
            height: ${editorHeight}px;
            overflow-x: auto;
            overflow-y: hidden;
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
    top: $(el).offset()?.top - $(window).scrollTop(),
    left: $(el).offset()?.left - $(window).scrollLeft(),
    width: $(el).width(),
    height: $(el).height()
  };
};

const getToolbarButtons = (size, toolbarSize, additionalToolbarOptions, buttons, buttonCounts) => {
  const sizeMap = {
    STD: { STD: "STD", MD: "MD", SM: "SM", XS: "XS" },
    MD: { STD: "MD", MD: "MD", SM: "SM", XS: "XS" },
    SM: { STD: "SM", MD: "SM", SM: "SM", XS: "XS" },
    XS: { STD: "XS", MD: "XS", SM: "XS", XS: "XS" }
  };
  const cSize = sizeMap[toolbarSize][size];
  const toolbarButtons = cloneDeep(DEFAULT_TOOLBAR_BUTTONS[cSize]);
  toolbarButtons.moreText.buttons = buttons ? [...buttons] : [...toolbarButtons.moreText.buttons];
  toolbarButtons.moreText.buttonsVisible = buttonCounts || toolbarButtons.moreText.buttonsVisible;
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

const getSpecialCharacterSets = customCharacters => {
  const customCharacterSet = isEmpty(customCharacters)
    ? []
    : [
        {
          title: "Custom",
          char: "á",
          list: customCharacters.map(char => ({ char, desc: "" }))
        }
      ];

  return [...defaultCharacterSets, ...customCharacterSet];
};

/**
 * These are the extra buttons width taken on the toolbar. If rendered extra buttons we need these widths
 * to get the remaining width of the toolbar to render default buttons.
 * Note: Width of the buttons will be same for all the resoution (may be slight less by 1 or 2 pixel).
 */
const buttonWidthMap = {
  responseBoxes: 178,
  response: 119,
  textinput: 119,
  textdropdown: 167,
  mathinput: 42,
  mathunit: 42,
  paragraphNumber: 42
};

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
  videoDefaultWidth,
  placeholder,
  fontSize,
  className,
  buttons,
  advancedAreOpen,
  customCharacters,
  editorHeight,
  allowQuickInsert = true,
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
  const [configState, setConfigState] = useState(null);
  const [mathField, setMathField] = useState(null);

  const EditorRef = useRef(null);

  const toolbarButtons = getToolbarButtons("STD", toolbarSize, additionalToolbarOptions, buttons);
  const toolbarButtonsMD = getToolbarButtons("MD", toolbarSize, additionalToolbarOptions, buttons);
  const toolbarButtonsSM = getToolbarButtons("SM", toolbarSize, additionalToolbarOptions, buttons);
  const toolbarButtonsXS = getToolbarButtons("XS", toolbarSize, additionalToolbarOptions, buttons);
  const specialCharactersSets = getSpecialCharacterSets(customCharacters);
  const initialConfig = Object.assign(
    {
      key: process.env.POI_APP_FROALA_KEY,
      imageInsertButtons: ["imageUpload"], // hide other image uplaod options
      imageDefaultDisplay: "inline",
      linkAlwaysBlank: true, // adding to make link always open in blank
      zIndex: 997, // header 999 | dropdown 998
      imageDefaultWidth: imageDefaultWidth,
      initOnClick,
      toolbarButtons,
      toolbarButtonsMD,
      toolbarButtonsSM,
      toolbarButtonsXS,
      videoInsertButtons: ["videoBack", "|", "videoByURL", "videoEmbed", "videoUpload"],
      videoResize: true,
      videoMove: true,
      videoDefaultAlign: "left",
      videoDefaultWidth: 480,
      videoDefaultDisplay: "inline",
      tableResizerOffset: 10,
      tableResizingLimit: 50,
      toolbarInline: true,
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
      specialCharactersSets,
      fontSize: ["12", "14", "16", "20"],
      fontSizeDefaultSelection: "14",
      htmlAllowedTags: [".*"],
      htmlAllowedAttrs: [".*"],
      htmlRemoveTags: ["script"],
      quickInsertEnabled: allowQuickInsert,
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
            if (cursorEl && cursorEl.tagName === "SPAN" && $(cursorEl).hasClass("input__math") && $(cursorEl).attr("data-latex")) {
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
              notification({ messageKey: "imageUploadErr" });
            });

          return false;
        },
        "image.inserted": async function($img) {
          try {
            if (!$img[0].complete) {
              await loadImage($img[0].src);
              $img.css({
                verticalAlign: "middle",
                width: $img[0].naturalWidth < imageDefaultWidth ? `${$img[0].naturalWidth}px` : `${imageDefaultWidth}px`
              });
            }
          } catch (e) {
            notification({ messageKey: "imageLoadErr" });
          }
        },
        "video.beforeUpload": function(video) {
          if (
            !canInsert(this.selection.element()) ||
            !canInsert(this.selection.endElement()) ||
            !beforeUpload(video[0], "video")
          ) {
            return false;
          }
          this.video.showProgressBar();
          uploadToS3(video[0], aws.s3Folders.DEFAULT)
            .then(url => {
              const embedded = `<video class="fr-draggable" src='${url}' controls>Video is not supported on this browser.</video>`;
              this.video.insert(embedded);
            })
            .catch(e => {
              console.error(e);
              this.popups.hideAll();
              notification({ messageKey: "videoUploadErr" });
            });
          return false;
        },
        "video.linkError": function(link) {
          const popup = this.popups.areVisible();
          const layer = popup?.find(".fr-video-progress-bar-layer");
          layer?.find(".fr-message")?.text("The video cannot be added because the address is invalid/unsupported.");
        },
        "video.codeError": function(code) {
          const popup = this.popups.areVisible();
          const layer = popup?.find(".fr-video-progress-bar-layer");
          layer?.find(".fr-message")?.text("The video cannot be added because the embed code is invalid/unsupported.");
        },
        "edit.on": function(e, editor) {
          if (restOptions.readOnly === true) {
            this.edit.off();
            this.$el?.find(".input__math")?.css("pointer-events", "none");
            this.$el?.find("img")?.css("pointer-events", "none");
            this.$el?.find("video")?.css("pointer-events", "none");
          }
        },
        "toolbar.show": function() {
          /**
           * there are no option to change tooltip of toolbar buttons
           * And 'tooltips:flase' option does not work properly on windows and linux
           * So just used this way for now.
           * @see https://snapwiz.atlassian.net/browse/EV-12857
           */
          $('[data-cmd="moreText"]')?.prop("title", "More Tools");
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
          if (initOnClick) {
            this.hasFocus = true;
          }
        },
        blur: function() {
          if (initOnClick) {
            this.hasFocus = false;
            if (this.toolbar) {
              this.toolbar.hide();
            }
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
    let toolbarWidth = toolbarContainerRef?.current?.clientWidth;
    // if response button is there than subtracting the width of response button
    if (hasResponseBoxBtn()) {
      for (let i = 0; i < additionalToolbarOptions.length; i++) {
        if (i === 3) break;
        toolbarWidth -= buttonWidthMap[additionalToolbarOptions[i]];
      }
    }
    /**
     * calculating the toolbar button counts dynamically that can be displayed without moreText and the rest will be displayed
     * in the moreText. Here each button takes the width of 42px and padding of total 31px is given to the right and left of the toolbar container
     * so subtracting the total padding and dividing the remaining width by each button width to get the count of buttons.
     */

    let buttonCounts = Math.floor((toolbarWidth - 31) / 42);

    if (initialConfig.toolbarButtons?.moreText?.buttons?.length > buttonCounts) {
      buttonCounts = buttonCounts - 1;
    }
    const _toolbarButtons = getToolbarButtons("STD", toolbarSize, additionalToolbarOptions, buttons, buttonCounts);
    const _toolbarButtonsMD = getToolbarButtons("MD", toolbarSize, additionalToolbarOptions, buttons, buttonCounts);
    const _toolbarButtonsSM = getToolbarButtons("SM", toolbarSize, additionalToolbarOptions, buttons, buttonCounts);
    const _toolbarButtonsXS = getToolbarButtons("XS", toolbarSize, additionalToolbarOptions, buttons, buttonCounts);

    const updatedConfig = {
      ...initialConfig,
      toolbarButtons: _toolbarButtons,
      toolbarButtonsMD: _toolbarButtonsMD,
      toolbarButtonsSM: _toolbarButtonsSM,
      toolbarButtonsXS: _toolbarButtonsXS
    };

    // for hidden refs wait for it to be shown in the dom to set config.
    if (EditorRef?.current?.offsetParent === null) {
      setConfigState(null);
    } else {
      setConfigState(updatedConfig);
    }
  }, [toolbarContainerRef?.current, advancedAreOpen]);

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
        const editorPosInfo = getFixedPostion(EditorRef.current?.$el);

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

    if (prevValue === value) {
      return;
    }
    let htmlStr = value;
    if (theme.isV1Migrated) {
      htmlStr = sanitizeString(value);
    }
    setPrevValue(htmlStr);
    setContent(replaceLatexesWithMathHtml(htmlStr));
  }, [value]);

  return (
    <>
      <MathModal
        isEditable={mathModalIsEditable}
        show={showMathModal}
        symbols={symbols}
        numberPad={defaultNumberPad}
        showDropdown={false}
        showResposnse={false}
        value={currentLatex}
        onSave={saveMathModal}
        onClose={closeMathModal}
      />
      <BackgroundStyleWrapper
        backgroundColor={configState?.backgroundColor}
        centerContent={centerContent}
        border={border}
        theme={theme}
        fontSize={fontSize}
        className={className}
        editorHeight={editorHeight}
      >
        {toolbarId && (
          <ToolbarContainer
            toolbarid={toolbarId}
            id={`froalaToolbarContainer-${toolbarId}`}
            ref={toolbarContainerRef}
            toolbarId={toolbarId}
          />
        )}

        {configState && (
          <Editor
            tag={tag}
            model={content}
            onModelChange={setChange}
            config={configState}
            onManualControllerReady={manualControl}
          />
        )}
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
  customCharacters: PropTypes.array,
  readOnly: PropTypes.bool,
  imageDefaultWidth: PropTypes.number,
  initOnClick: PropTypes.bool,
  border: PropTypes.string,
  centerContent: PropTypes.bool,
  editorHeight: PropTypes.number
};

CustomEditor.defaultProps = {
  tag: "textarea",
  toolbarId: null,
  initOnClick: true,
  toolbarSize: "STD",
  customCharacters: [],
  additionalToolbarOptions: [],
  readOnly: false,
  imageDefaultWidth: 300,
  videoDefaultWidth: 480,
  border: "none",
  centerContent: false,
  editorHeight: null
};

const enhance = compose(
  withMathFormula,
  withTheme,
  connect(state => ({
    advancedAreOpen: state?.assessmentplayerQuestions?.advancedAreOpen
  }))
);

export default enhance(CustomEditor);
