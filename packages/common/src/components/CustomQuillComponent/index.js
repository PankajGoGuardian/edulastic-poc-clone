/* eslint-disable no-return-assign */
/* eslint-disable react/no-multi-comp */
import "react-quill/dist/quill.snow.css";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import Delta from "quill-delta";
import PropTypes from "prop-types";

// eslint-disable-next-line import/no-extraneous-dependencies
import enhanceWithClickOutside from "react-click-outside";
import { fileApi } from "@edulastic/api";
import MathModal from "../MathModal";

import MathInputCmp from "./QuillMathEmbed";
import ResponseCmp from "./ResponseCmp";
import TextDropDown from "./TextDropDown";
import ContainBlot from "./table/ContainBlot";
import TableRow from "./table/TableRow";
import Table from "./table/Table";
import RowBreak from "./table/RowBreak";
import CellBreak from "./table/CellBreak";
import TableCell from "./table/TableCell";

import TableSizeModal from "./table/TableSizeModal";

const Container = Quill.import("blots/container");
const Parchment = Quill.import("parchment");

Quill.register(ResponseCmp, true);
Quill.register(MathInputCmp, true);
Quill.register(TextDropDown, true);
Quill.register(ContainBlot);
Quill.register(TableRow);

Table.allowedChildren = [TableRow];
Quill.register(Table);
Quill.register(TableCell);
Quill.register(RowBreak);
Quill.register(CellBreak);

Quill.imports.tablecell = TableCell;
// Table components

const maxRows = 10;
const maxCols = 5;
const tableOptions = [];
for (let r = 1; r <= maxRows; r++) {
  for (let c = 1; c <= maxCols; c++) {
    tableOptions.push(`newtable_${r}_${c}`);
  }
}

Container.order = [
  "list",
  "contain", // Must be lower
  "td",
  "tr",
  "table" // Must be higher
];

/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const ResponseButton = () => (
  <div style={{ border: "dotted 2px #000", padding: "2px 0px 4px", lineHeight: "0.5em", width: 18 }}>r</div>
);

const FormulaButton = () => (
  <svg viewBox="0 0 18 18">
    <path
      className="ql-fill"
      d="M11.759,2.482a2.561,2.561,0,0,0-3.53.607A7.656,7.656,0,0,0,6.8,6.2C6.109,9.188,5.275,14.677,4.15,14.927a1.545,1.545,0,0,0-1.3-.933A0.922,0.922,0,0,0,2,15.036S1.954,16,4.119,16s3.091-2.691,3.7-5.553c0.177-.826.36-1.726,0.554-2.6L8.775,6.2c0.381-1.421.807-2.521,1.306-2.676a1.014,1.014,0,0,0,1.02.56A0.966,0.966,0,0,0,11.759,2.482Z"
    />
    <rect className="ql-fill" height="1.6" rx="0.8" ry="0.8" width="5" x="5.15" y="6.2" />
    <path
      className="ql-fill"
      d="M13.663,12.027a1.662,1.662,0,0,1,.266-0.276q0.193,0.069.456,0.138a2.1,2.1,0,0,0,.535.069,1.075,1.075,0,0,0,.767-0.3,1.044,1.044,0,0,0,.314-0.8,0.84,0.84,0,0,0-.238-0.619,0.8,0.8,0,0,0-.594-0.239,1.154,1.154,0,0,0-.781.3,4.607,4.607,0,0,0-.781,1q-0.091.15-.218,0.346l-0.246.38c-0.068-.288-0.137-0.582-0.212-0.885-0.459-1.847-2.494-.984-2.941-0.8-0.482.2-.353,0.647-0.094,0.529a0.869,0.869,0,0,1,1.281.585c0.217,0.751.377,1.436,0.527,2.038a5.688,5.688,0,0,1-.362.467,2.69,2.69,0,0,1-.264.271q-0.221-.08-0.471-0.147a2.029,2.029,0,0,0-.522-0.066,1.079,1.079,0,0,0-.768.3A1.058,1.058,0,0,0,9,15.131a0.82,0.82,0,0,0,.832.852,1.134,1.134,0,0,0,.787-0.3,5.11,5.11,0,0,0,.776-0.993q0.141-.219.215-0.34c0.046-.076.122-0.194,0.223-0.346a2.786,2.786,0,0,0,.918,1.726,2.582,2.582,0,0,0,2.376-.185c0.317-.181.212-0.565,0-0.494A0.807,0.807,0,0,1,14.176,15a5.159,5.159,0,0,1-.913-2.446l0,0Q13.487,12.24,13.663,12.027Z"
    />
  </svg>
);

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function formula(quill, latex) {
  const cursorPosition = quill.getSelection().index;
  if (cursorPosition === 0 || quill.getLength() - cursorPosition <= 2) {
    // This is the case when the MathFormula is required to be added at the very start of a line
    // In this case react-quill works really weird for embed blot
    // So we are just gonna add space before the MathFormula so that you can enter text there.
    quill.insertText(cursorPosition, " ", "");
    quill.insertEmbed(cursorPosition + 1, "MathInput", latex);
    quill.setSelection(cursorPosition + 3);
  } else {
    // This is the case when the MathFormula is required to be added at the middle of a line
    // In this case react-quill works really fine for embed blot
    // So we are not gonna add space before the MathFormula so that you can enter text there.
    quill.insertEmbed(cursorPosition, "MathInput", latex);
    quill.setSelection(cursorPosition + 2);
  }
}

function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertEmbed(cursorPosition, "Response", "value");
  this.quill.setSelection(cursorPosition + 2);
}

function insertDropdown() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertEmbed(cursorPosition, "TextDropDown", "value");
  this.quill.setSelection(cursorPosition + 2);
}

function insertPara() {}

const CustomToolbar = ({
  showTableBtn,
  showResponseBtn,
  showDropdownBtn,
  active,
  id,
  maxWidth,
  onTableClick,
  onFormulaClick
}) => {
  const getTopStyle = () =>
    document.getElementById(id)
      ? document.getElementById(id).offsetHeight
        ? -document.getElementById(id).offsetHeight - 48
        : -120
      : -120;

  return (
    <div
      id={id}
      style={{
        display: "block",
        top: getTopStyle(),
        opacity: active ? 1 : 0,
        zIndex: active ? 1000 : -1,
        pointerEvents: active ? "all" : "none",
        maxWidth
      }}
      className="toolbars"
    >
      <span className="ql-formats">
        <select className="ql-font" />
        <select className="ql-size" />
      </span>
      <span className="ql-formats">
        <button className="ql-bold" type="button" />
        <button className="ql-italic" type="button" />
        <button className="ql-underline" type="button" />
        <button className="ql-strike" type="button" />
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-script" value="sub" type="button" />
        <button className="ql-script" value="super" type="button" />
      </span>
      <span className="ql-formats">
        <button className="ql-header" value="1" type="button" />
        <button className="ql-header" value="2" type="button" />
        <button className="ql-blockquote" type="button" />
        <button className="ql-code-block" type="button" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" type="button" />
        <button className="ql-list" value="bullet" type="button" />
        <button className="ql-indent" value="-1" type="button" />
        <button className="ql-indent" value="+1" type="button" />
      </span>
      <span className="ql-formats">
        <button className="ql-direction" value="rtl" type="button" />
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" type="button" />
        <button className="ql-image" type="button" />
        <button className="ql-video" type="button" />
        <span className="ql-formula" onClick={onFormulaClick}>
          <FormulaButton />
        </span>
      </span>
      {showTableBtn && (
        <span className="ql-formats" onClick={onTableClick}>
          <span className="ql-table" />
        </span>
      )}
      <span className="ql-formats">
        <button className="ql-clean" type="button" />
      </span>
      {showResponseBtn && (
        <span className="ql-formats">
          <button className="ql-insertStar" type="button">
            <ResponseButton />
          </button>
        </span>
      )}
      {showDropdownBtn && (
        <span className="ql-formats">
          <button className="ql-insertDropdown" type="button">
            <span>Text Dropdown</span>
          </button>
        </span>
      )}
    </div>
  );
};

CustomToolbar.propTypes = {
  maxWidth: PropTypes.any.isRequired,
  showResponseBtn: PropTypes.bool,
  showTableBtn: PropTypes.bool,
  showDropdownBtn: PropTypes.bool,
  active: PropTypes.bool,
  id: PropTypes.string,
  onTableClick: PropTypes.func,
  onFormulaClick: PropTypes.func
};

CustomToolbar.defaultProps = {
  showTableBtn: true,
  showResponseBtn: true,
  showDropdownBtn: false,
  active: false,
  id: "toolbar",
  onTableClick: () => {},
  onFormulaClick: () => {}
};

// Table-related functions
function find_td(quill, what) {
  const leaf = quill.getLeaf(quill.getSelection().index);
  let blot = leaf[0];
  for (; blot !== null && blot.statics.blotName !== what; ) {
    blot = blot.parent;
  }
  return blot; // return TD or NULL
}

function getClosestNewLineIndex(contents, index) {
  return (
    index +
    contents
      .map(op => (typeof op.insert === "string" ? op.insert : " "))
      .join("")
      .slice(index)
      .indexOf("\n")
  );
}

function insertNewRow(quill, range) {
  const td = find_td(quill, "td");
  if (td) {
    let columns = 0;
    td.parent.children.forEach(child => {
      if (child instanceof TableCell) {
        columns++;
      }
    });

    // range.index + 1 is to avoid the current index having a \n
    const newLineIndex = getClosestNewLineIndex(quill.getContents(), range.index + 1);
    let changeDelta = new Delta().retain(newLineIndex);
    for (let j = 0; j < columns; j++) {
      changeDelta = changeDelta.insert("\n", {
        td: true
      });
      if (j < columns - 1) {
        changeDelta = changeDelta.insert({ tdbr: true });
      }
    }
    changeDelta = changeDelta.insert({ trbr: true });
    quill.updateContents(changeDelta, Quill.sources.USER);
  }
}

function getNextTDIndex(quill, contents, index) {
  const joinedText = contents.map(op => (typeof op.insert === "string" ? op.insert : " ")).join("");
  /**
   * Breaking at first case of tdbr/trbr places the cursor
   * at the beginning of the table cell, but from a UX point
   * of view we want it to jump to the end. So we want the
   * text preceeding the second tdbr/trbr
   */
  let breakCount = 0;
  for (let i = 0; i < joinedText.length; i++) {
    const format = quill.getFormat(index + i);
    if (format.tdbr || format.trbr) {
      breakCount++;
    }
    if (breakCount === 2) {
      return index + i - 1;
    }
    if (!(format.tdbr || format.trbr || format.td)) {
      // Add row when in last table cell
      insertNewRow(quill, {
        index,
        length: 0
      });
      return index + i;
    }
  }
}

function getPreviousTDIndex(quill, contents /* , index */) {
  const joinedText = contents.map(op => (typeof op.insert === "string" ? op.insert : " ")).join("");
  for (let i = joinedText.length - 1; i >= 0; i--) {
    const format = quill.getFormat(i);
    if (format.tdbr || format.trbr) {
      // Go To previous table cell
      return i - 1;
    }
    if (!format.td) {
      // Go to front of table if shift+tab pressed in first cell
      return i + 1;
    }
  }
}

function table(quill, rows = 3, columns = 2) {
  Parchment.create("table");
  const range = quill.getSelection();
  if (!range) return;
  const newLineIndex = getClosestNewLineIndex(quill.getContents(), range.index + range.length);
  let changeDelta = new Delta().retain(newLineIndex);
  changeDelta = changeDelta.insert("\n");
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      changeDelta = changeDelta.insert("\n", {
        td: true
      });
      if (j < columns - 1) {
        changeDelta = changeDelta.insert({ tdbr: true });
      }
    }
    changeDelta = changeDelta.insert({ trbr: true });
  }
  quill.updateContents(changeDelta, Quill.sources.USER);
  quill.setSelection(newLineIndex + 1);
}

function tableInsertRows() {
  insertNewRow(this.quill);
}

function tableInsertColumns() {
  const td = find_td(this.quill, "td");
  if (td) {
    td.parent.parent.children.forEach(tr => {
      const tdd = Parchment.create("td");
      tr.appendChild(tdd);
      tr.appendChild(Parchment.create("tdbr"));
    });
  }
}

function handleImage() {
  const input = document.createElement("input");

  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const formData = new FormData();

    formData.append("image", file);

    // Save current cursor state
    const range = this.quill.getSelection(true);

    // Insert temporary loading placeholder image
    this.quill.insertEmbed(range.index, "image", `placeholder.gif`);

    // Move cursor to right side of image (easier to continue typing)
    this.quill.setSelection(range.index + 1);

    fileApi
      .upload({ file })
      .then(res => {
        // Remove placeholder image
        this.quill.deleteText(range.index, 1);

        // Insert uploaded image
        this.quill.insertEmbed(range.index, "image", res.fileUri);
      })
      .catch(err => {
        console.warn("There was en error with image upload", err);
      });
  };
}

/*
 * Editor component with custom toolbar and content containers
 */
class CustomQuillComponent extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    showResponseBtn: PropTypes.bool.isRequired,
    inputId: PropTypes.string.isRequired,
    toolbarId: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    clearOnFirstFocus: PropTypes.bool,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    custom: PropTypes.bool,
    showDropdownBtn: PropTypes.bool
  };

  static defaultProps = {
    onChange: () => {},
    clearOnFirstFocus: true,
    placeholder: "",
    readOnly: false,
    style: {
      minHeight: 134,
      background: "#fff",
      padding: "13px 20px",
      border: `1px solid #E1E1E1`,
      borderRadius: "4px"
    },
    tabIndex: 0,
    custom: false,
    showDropdownBtn: false
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      firstFocus: !props.value,
      showMath: false,
      mathField: null,
      selLatex: "",
      curMathRange: null,
      quillVal: props.value,
      prevValue: props.value,
      quillKey: 0,
      modules: CustomQuillComponent.modules(props.toolbarId, props.custom),
      showTableSize: false,
      rows: 3,
      cols: 2
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    const { prevValue, quillKey } = this.state;

    if (prevProps.value !== value && prevValue !== value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        quillVal: value,
        quillKey: quillKey + 1,

        prevValue: value
      });
    }
  }

  componentDidMount() {
    const containers = document.getElementsByClassName("ql-container");
    Array.from(containers).forEach(el => {
      el.removeAttribute("tabindex");
    });
  }

  showToolbar = () => {
    this.setState({ active: true });
  };

  onFocus = () => {
    const { clearOnFirstFocus, onChange } = this.props;
    const { firstFocus } = this.state;
    if (firstFocus && clearOnFirstFocus) {
      this.setState({ quillVal: "" });
      onChange("");
      this.quillRef.getEditor().setText("");
      this.setState({
        firstFocus: false,
        prevValue: ""
      });
    }
    this.showToolbar();
  };

  hideToolbar = () => {
    this.setState({ active: false });
  };

  handleClickOutside() {
    this.hideToolbar();
  }

  handleChange = content => {
    const { onChange, showResponseBtn } = this.props;
    if (this.quillRef) {
      const lines = this.quillRef.getEditor().getLines();
      let val = content;
      for (const line of lines) {
        if (line instanceof MathInputCmp) {
          let newLineString = '<span class="input__math"></span>';
          if (line.state.mathField) {
            const latex = line.state.mathField.latex();
            newLineString = `<span class="input__math" data-latex="${latex}"></span>`;
          }
          val = val.replace(line.domNode.outerHTML, newLineString);
        }
      }

      val = val.replace(/<td class="tdbr"><\/td>/gm, "");
      val = val.replace(/<td class="trbr"><\/td>/gm, "");
      this.setState({
        quillVal: content,
        prevValue: val
      });

      if (showResponseBtn) {
        // eslint-disable-next-line func-names, no-undef
        const responseIndexes = $(val)
          .find(".index")
          // eslint-disable-next-line func-names
          .map(function() {
            // eslint-disable-next-line no-undef
            return +$(this).text();
          })
          .toArray();

        onChange(val, responseIndexes);
      } else {
        onChange(val);
      }
    }
  };

  onChangeSelection = range => {
    const { showMath } = this.state;
    if (!range || showMath) {
      return;
    }

    const leaf = this.quillRef.getEditor().getLeaf(range.index);
    if (range.length > 1) {
      if (showMath) {
        this.setState({
          showMath: false,
          mathField: null
        });
      }
      return;
    }

    if (leaf[0] instanceof MathInputCmp) {
      if (!showMath) {
        const { mathField } = leaf[0].state;
        this.setState({
          showMath: true,
          selLatex: mathField.latex(),
          mathField,
          curMathRange: range
        });
      }
    } else if (showMath) {
      this.setState({
        showMath: false,
        mathField: null
      });
    }
  };

  onSaveMathModal = latex => {
    this.quillRef.focus();
    const quillEditor = this.quillRef.getEditor();

    const { mathField, curMathRange } = this.state;
    if (curMathRange) {
      mathField.latex(latex);
      quillEditor.setSelection(curMathRange.index + 1);
    } else {
      formula(quillEditor, latex);
    }

    this.setState({
      selLatex: "",
      showMath: false,
      active: true,
      curMathRange: null
    });
  };

  onCloseMathModal = () => {
    this.setState({
      selLatex: "",
      showMath: false,
      active: true,
      curMathRange: null
    });
  };

  showTableModal = () => {
    this.setState({ showTableSize: true });
  };

  showMathModal = () => {
    this.setState({ showMath: true });
  };

  onTableSizeModalSave = (rows, cols) => {
    this.setState({
      rows,
      cols,
      showTableSize: false
    });
    this.quillRef.focus();
    table(this.quillRef.getEditor(), rows, cols);
  };

  onTableSizeModalClose = () => {
    this.setState({ showTableSize: false });
  };

  render() {
    const { active, quillVal, quillKey, showMath, selLatex, showTableSize, rows, cols, modules } = this.state;
    const {
      placeholder,
      showResponseBtn,
      inputId,
      toolbarId,
      style,
      readOnly,
      tabIndex,
      custom,
      showDropdownBtn
    } = this.props;
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
    return (
      <div id={inputId} data-cy="text-editor-container" className="text-editor" style={style}>
        {!custom && (
          <CustomToolbar
            key={`toolbar${quillKey}`}
            active={active && !readOnly}
            showResponseBtn={showResponseBtn}
            id={toolbarId}
            maxWidth={style.width ? style.width : "initial"}
            onTableClick={this.showTableModal}
            onFormulaClick={this.showMathModal}
            showDropdownBtn={showDropdownBtn}
          />
        )}
        <ReactQuill
          tabIndex={tabIndex || 1}
          ref={el => {
            this.quillRef = el;
          }}
          key={`math${quillKey}`}
          readOnly={readOnly}
          modules={modules}
          onChange={this.handleChange}
          onFocus={this.onFocus}
          onKeyDown={this.onKeyDownHandler}
          onChangeSelection={this.onChangeSelection}
          placeholder={placeholder}
          defaultValue={quillVal}
        />
        <MathModal
          show={showMath}
          symbols={symbols}
          numberPad={numberPad}
          value={selLatex}
          showResponse={false}
          onSave={this.onSaveMathModal}
          onClose={this.onCloseMathModal}
        />
        <TableSizeModal
          show={showTableSize}
          rows={rows}
          cols={cols}
          onSave={this.onTableSizeModalSave}
          onClose={this.onTableSizeModalClose}
        />
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
CustomQuillComponent.modules = (toolbarId, custom) => ({
  clipboard: {
    matchers: [
      [
        "TD, TH",
        (node, delta) => {
          delta.insert("\n", { td: true });
          delta.insert({ tdbr: true });
          return delta;
        }
      ],
      [
        "TR",
        (node, delta) => {
          delta.insert({ trbr: true });
          return delta;
        }
      ]
    ]
  },
  keyboard: {
    bindings: {
      tableBackspace: {
        key: 8,
        handler(range) {
          const formats = this.quill.getFormat(range.index - 1, 1);
          if (formats.tdbr || formats.trbr) {
            // prevent deletion of table break
            return false;
          }
          return true;
        }
      },
      tableShiftTab: {
        key: 9,
        format: ["td", "tdbr", "trbr"],
        shiftKey: true,
        handler(range) {
          const previousTD = getPreviousTDIndex(this.quill, this.quill.getContents(0, range.index), range.index);
          this.quill.setSelection(previousTD, "silent");
        }
      },
      tab: {
        key: 9,
        handler(range, context) {
          const formats = this.quill.getFormat(range.index - 1, 1);
          const nextTD = getNextTDIndex(this.quill, this.quill.getContents(range.index), range.index);
          if (formats.td || formats.tdbr || formats.trbr) {
            this.quill.setSelection(nextTD, 0);
          } else {
            if (!context.collapsed) {
              this.quill.scroll.deleteAt(range.index, range.length);
            }
            this.quill.insertText(range.index, "\t", "user");
            this.quill.setSelection(range.index + 1, "silent");
          }
        }
      },
      tableEnter: {
        key: 13,
        handler: () => true
      }
    }
  },
  toolbar: {
    container: custom ? toolbarId : `#${toolbarId}`,
    handlers: {
      "table-insert-rows": tableInsertRows,
      "table-insert-columns": tableInsertColumns,
      insertStar,
      insertPara,
      image: handleImage,
      insertDropdown
    }
  }
});

/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
CustomQuillComponent.formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image"
];

export default enhanceWithClickOutside(CustomQuillComponent);
