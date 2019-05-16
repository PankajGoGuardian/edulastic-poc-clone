/* eslint-disable no-return-assign */
/* eslint-disable react/no-multi-comp */
import "react-quill/dist/quill.snow.css";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-extraneous-dependencies
import enhanceWithClickOutside from "react-click-outside";
import { fileApi } from "@edulastic/api";
import MathModal from "./MathModal";

const Embed = Quill.import("blots/block/embed");

class ResponseCmp extends Embed {
  static create() {
    const node = super.create();
    const responseCount = document.querySelectorAll(".response-btn").length;
    node.setAttribute("contenteditable", false);
    node.innerHTML = `&nbsp;<span class="index">${responseCount + 1}</span><span class="text">Response</span>&nbsp;`;
    return node;
  }
}
ResponseCmp.blotName = "Response";
ResponseCmp.tagName = "p";
ResponseCmp.className = "response-btn";
Quill.register(ResponseCmp, true);

class MathInputCmp extends Embed {
  state = {
    mathField: null
  };

  static create() {
    const node = super.create();
    node.setAttribute("contenteditable", false);
    node.innerHTML = '&nbsp;<span class="input__math__field"></span>&nbsp;';
    return node;
  }

  static value(domNode) {
    return domNode.getAttribute("data-latex");
  }

  constructor(domNode, value) {
    super(domNode, value);
    const MQ = window.MathQuill.getInterface(2);
    const mathField = MQ.StaticMath(domNode.childNodes[1]);
    mathField.latex(value);
    this.state = {
      mathField
    };
  }

  value() {
    return this.state.mathField.latex();
  }
}
MathInputCmp.blotName = "MathInput";
MathInputCmp.tagName = "span";
MathInputCmp.className = "input__math";
Quill.register(MathInputCmp, true);

/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const ResponseButton = () => (
  <div style={{ border: "dotted 2px #000", padding: "2px 0px 4px", lineHeight: "0.5em", width: 18 }}>r</div>
);

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function formula() {
  const cursorPosition = this.quill.getSelection().index;
  if (cursorPosition === 0 || this.quill.getLength() - cursorPosition <= 2) {
    // This is the case when the MathFormula is required to be added at the very start of a line
    // In this case react-quill works really weird for embed blot
    // So we are just gonna add space before the MathFormula so that you can enter text there.
    this.quill.insertText(cursorPosition, " ", "");
    this.quill.insertEmbed(cursorPosition + 1, "MathInput", "");
    this.quill.setSelection(cursorPosition + 2);
    this.quill.inserted = 2;
  } else {
    // This is the case when the MathFormula is required to be added at the middle of a line
    // In this case react-quill works really fine for embed blot
    // So we are not gonna add space before the MathFormula so that you can enter text there.
    this.quill.insertEmbed(cursorPosition, "MathInput", "");
    this.quill.setSelection(cursorPosition + 1);
    this.quill.inserted = 1;
  }
}

function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertEmbed(cursorPosition, "Response", "value");
  this.quill.setSelection(cursorPosition + 2);
}

function insertPara() {}

const CustomToolbar = ({ showResponseBtn, active, id, maxWidth }) => {
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
        <button className="ql-formula" type="button" />
      </span>
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
    </div>
  );
};

CustomToolbar.propTypes = {
  maxWidth: PropTypes.any.isRequired,
  showResponseBtn: PropTypes.bool,
  active: PropTypes.bool,
  id: PropTypes.string
};

CustomToolbar.defaultProps = {
  showResponseBtn: true,
  active: false,
  id: "toolbar"
};

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
    tabIndex: PropTypes.number
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
    tabIndex: 0
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
      modules: CustomQuillComponent.modules(props.toolbarId)
    };
  }

  componentDidUpdate(prevProps) {
    const { value, toolbarId } = this.props;
    const { prevValue, quillKey } = this.state;

    if (prevProps.value !== value && prevValue !== value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        quillVal: value,
        quillKey: quillKey + 1,
        modules: CustomQuillComponent.modules(toolbarId),
        prevValue: value
      });
    }
    if (prevProps.toolbarId !== toolbarId) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ modules: CustomQuillComponent.modules(toolbarId) });
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
      const val = lines
        .map(line => {
          if (line instanceof MathInputCmp) {
            if (line.state.mathField) {
              const latex = line.state.mathField.latex();
              return `<span class="input__math" data-latex="${latex}"></span>`;
            }
            return '<span class="input__math"></span>';
          }
          return line.domNode.outerHTML;
        })
        .join("");

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
    if (!range) return;
    if (showMath) return;

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

  onSaveLatex = latex => {
    const { mathField, curMathRange } = this.state;
    mathField.latex(latex);

    this.quillRef.getEditor().setSelection(curMathRange.index + 1);
    this.setState({
      selLatex: "",
      showMath: false,
      active: true
    });
  };

  onCloseModal = () => {
    const { selLatex, curMathRange } = this.state;
    const quillEditor = this.quillRef.getEditor();
    if (selLatex === "" && curMathRange) {
      if (quillEditor.inserted === 1) {
        quillEditor.deleteText(curMathRange.index, 1);
      } else if (quillEditor.inserted === 2) {
        quillEditor.deleteText(curMathRange.index, 1);
        quillEditor.deleteText(curMathRange.index - 2, 2);
      }
      quillEditor.inserted = 0;
    } else {
      quillEditor.setSelection(curMathRange.index + 1);
    }
    this.setState({
      selLatex: "",
      showMath: false,
      active: true
    });
  };

  render() {
    const { active, quillVal, quillKey, showMath, selLatex, modules } = this.state;
    const { placeholder, showResponseBtn, inputId, toolbarId, style, readOnly, tabIndex } = this.props;
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
        <CustomToolbar
          key={`toolbar${quillKey}`}
          active={active && !readOnly}
          showResponseBtn={showResponseBtn}
          id={toolbarId}
          maxWidth={style.width ? style.width : "initial"}
        />
        <ReactQuill
          tabIndex={tabIndex || 1}
          ref={el => (this.quillRef = el)}
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
          onSave={this.onSaveLatex}
          onClose={this.onCloseModal}
        />
      </div>
    );
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
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
CustomQuillComponent.modules = toolbarId => ({
  keyboard: { bindings: { tab: false } },
  toolbar: {
    container: `#${toolbarId}`,
    handlers: {
      formula,
      insertStar,
      insertPara,
      image: handleImage
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
  "image",
  "formula"
];

export default enhanceWithClickOutside(CustomQuillComponent);
