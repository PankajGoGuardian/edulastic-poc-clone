/* eslint-disable no-return-assign */
import 'react-quill/dist/quill.snow.css';
import React from 'react';
import ReactQuill, { Quill } from 'react-quill';

import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import enhanceWithClickOutside from 'react-click-outside';
import CustomToolbar from './components/CustomToolbar';

const Embed = Quill.import('blots/block/embed');

class ResponseCmp extends Embed {
  static create() {
    const node = super.create();
    const responseCount = document.querySelectorAll('.response-btn').length;
    node.setAttribute('contenteditable', false);
    node.innerHTML = `&nbsp;<span class="index">${responseCount +
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
 * Event handler to be attached using Quill toolbar module
 * http://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertEmbed(cursorPosition, 'Response', 'value');
  this.quill.setSelection(cursorPosition + 2);
}

function insertPara() {}

/*
 * Editor component with custom toolbar and content containers
 */
class CustomQuillComponent extends React.Component {
  state = {
    active: false,
    // eslint-disable-next-line react/destructuring-assignment
    firstFocus: this.props.firstFocus
  };

  static propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    firstFocus: PropTypes.bool,
    showResponseBtn: PropTypes.bool.isRequired,
    toolbarId: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    clearOnFirstFocus: PropTypes.bool,
    readOnly: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    onChange: () => {},
    clearOnFirstFocus: true,
    placeholder: '',
    firstFocus: false,
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

  onFocus = () => {
    const { clearOnFirstFocus } = this.props;
    const { firstFocus } = this.state;
    if (firstFocus && clearOnFirstFocus) {
      this.handleChange('');
      this.quillRef.getEditor().setText('');
      this.setState({ firstFocus: false });
    }
    this.showToolbar();
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
          maxWidth={style.width}
        />
        <ReactQuill
          ref={el => (this.quillRef = el)}
          readOnly={readOnly}
          modules={CustomQuillComponent.modules(toolbarId)}
          onChange={this.handleChange}
          onFocus={this.onFocus}
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
