import 'react-quill/dist/quill.snow.css';
import ReactQuill, { Quill } from 'react-quill';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const Embed = Quill.import('blots/block/embed');
let responseCount = 0;

class ResponseCmp extends Embed {
  static create(index) {
    const node = super.create();
    node.setAttribute('contenteditable', false);
    node.innerHTML = `<span class="index">${index + 1}</span><span class="text">Response</span>`;
    return node;
  }
}
ResponseCmp.blotName = 'Response';
ResponseCmp.tagName = 'span';
ResponseCmp.className = 'response-btn';
Quill.register(ResponseCmp, true);

/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const ResponseButton = () => <div style={{ border: 'dotted 2px #000', padding: '2px 0px 4px', lineHeight: '0.5em', width: 18 }}>r</div>;

/*
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertEmbed(cursorPosition, 'Response', responseCount);
  responseCount++;
}

const CustomToolbar = ({ showResponseBtn, active }) => (
  <div id="toolbar" style={{ display: active ? 'block' : 'none' }}>
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
        <button className="ql-insertStar" type="button"><ResponseButton /></button>
      </span>
    )}
  </div>
);

CustomToolbar.propTypes = {
  showResponseBtn: PropTypes.bool,
  active: PropTypes.bool,
};

CustomToolbar.defaultProps = {
  showResponseBtn: true,
  active: false,
};

/*
 * Editor component with custom toolbar and content containers
 */
class CustomQuillComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { editorHtml: '', active: false };
  }

  handleChange = (e) => {
    this.setState({ editorHtml: e });
  }

  showToolbar = (status) => {
    this.setState({ active: status });
  }

  render() {
    const { editorHtml, active } = this.state;
    return (
      <div className="text-editor">
        <CustomToolbar active={active} />
        <ReactQuill
          modules={CustomQuillComponent.modules}
          onChange={this.handleChange}
          onFocus={() => this.showToolbar(true)}
          onBlur={() => this.showToolbar(false)}
          value={editorHtml}
        />
      </div>
    );
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
CustomQuillComponent.modules = {
  toolbar: {
    container: '#toolbar',
    handlers: {
      insertStar,
    },
  },
};

/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
CustomQuillComponent.formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image',
];

export default CustomQuillComponent;
