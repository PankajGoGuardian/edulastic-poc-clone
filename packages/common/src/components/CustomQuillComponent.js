/* eslint-disable no-return-assign */
import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import enhanceWithClickOutside from 'react-click-outside';

const Embed = Quill.import('blots/block/embed');

class ResponseCmp extends Embed {
  static create() {
    const node = super.create();
    const responseCount = document.querySelectorAll('.response-btn').length;
    node.setAttribute('contenteditable', false);
    node.innerHTML = `&nbsp;Quillspan class="index">${responseCount +
      1}</span><span class="text">Response</span>&nbsp;`;
    return node;
  }
}
ResponseCmp.blotName = 'Response';
ResponseCmp.tagName = 'p';
ResponseCmp.className = 'response-btn';
Quill.register(ResponseCmp, true);

class NewPara extends Embed {
  static create() {
    const node = super.create();
    node.innerHTML = '<br>';
    return node;
  }
}
NewPara.blotName = 'NewPara';
NewPara.tagName = 'p';
NewPara.className = 'newline_section';
Quill.register(NewPara, true);

/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const ResponseButton = () => (
  <div
    style={{ border: 'dotted 2px #000', padding: '2px 0px 4px', lineHeight: '0.5em', width: 18 }}
  >
    r
  </div>
);

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertEmbed(cursorPosition, 'Response', 'value');
  this.quill.setSelection(cursorPosition + 2);
}

function insertPara() {}

const CustomToolbar = ({ showResponseBtn, active, id }) => (
  <div id={id} style={{ display: active ? 'block' : 'none', width: 1100 }} className="toolbars">
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

CustomToolbar.propTypes = {
  showResponseBtn: PropTypes.bool,
  active: PropTypes.bool,
  id: PropTypes.string
};

CustomToolbar.defaultProps = {
  showResponseBtn: true,
  active: false,
  id: 'toolbar'
};

/*
 * Editor component with custom toolbar and content containers
 */
class CustomQuillComponent extends Component {
  state = {
    active: false
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    showResponseBtn: PropTypes.bool.isRequired,
    toolbarId: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    onChange: () => {},
    placeholder: '',
    readOnly: false,
    style: {
      minHeight: 134,
      border: '1px solid rgb(223, 223, 223)',
      padding: '18px 33px'
    }
  };

  showToolbar = () => {
    this.setState({ active: true });
  };

  hideToolbar = () => {
    this.setState({ active: false });
  };

  handleClickOutside() {
    this.hideToolbar();
  }

  onKeyDownHandler = (e) => {
    if (e.which === 13) {
      const cursorPosition = this.quillRef.getEditor().getSelection().index;
      this.quillRef.getEditor().insertEmbed(cursorPosition, 'NewPara', 'value');
      this.quillRef.getEditor().setSelection(cursorPosition + 1);
    }
  };

  handleChange = (content) => {
    const { onChange } = this.props;
    onChange(content);
  };

  render() {
    const { active } = this.state;
    const { value, placeholder, showResponseBtn, toolbarId, style, readOnly } = this.props;

    return (
      <div className="text-editor" style={style}>
        <CustomToolbar
          active={active && !readOnly}
          showResponseBtn={showResponseBtn}
          id={toolbarId}
        />
        <ReactQuill
          ref={el => (this.quillRef = el)}
          readOnly={readOnly}
          modules={CustomQuillComponent.modules(toolbarId)}
          onChange={this.handleChange}
          onFocus={this.showToolbar}
          onKeyDown={this.onKeyDownHandler}
          placeholder={placeholder}
          value={value}
        />
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
CustomQuillComponent.modules = toolbarId => ({
  toolbar: {
    container: `#${toolbarId}`,
    handlers: {
      insertStar,
      insertPara
    }
  }
});

/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
CustomQuillComponent.formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'formula'
];

export default enhanceWithClickOutside(CustomQuillComponent);
