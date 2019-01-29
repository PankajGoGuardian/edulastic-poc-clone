import React from 'react';
import PropTypes from 'prop-types';
import { math } from '@edulastic/constants';

import MathKeyboard from '../MathKeyboard';
import MathInputStyles from '../MathInputStyles';

const { EMBED_RESPONSE } = math;

class MathInput extends React.PureComponent {
  state = {
    mathField: null,
    mathFieldFocus: false
  };

  containerRef = React.createRef();

  mathFieldRef = React.createRef();

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener('click', this.handleClick, false);
    document.removeEventListener('click', this.handleChangeField, false);
    this.setState({ mathFieldFocus: false });
  }

  handleClick = (e) => {
    const { onFocus } = this.props;

    if (e.target.nodeName === 'LI' && e.target.attributes[0].nodeValue === 'option') {
      return;
    }
    if (this.containerRef.current && !this.containerRef.current.contains(e.target)) {
      onFocus(false);
      this.setState({ mathFieldFocus: false });
    }
  };

  componentWillReceiveProps(nextProps) {
    const { mathField } = this.state;

    if (mathField && mathField.latex() !== nextProps.value) {
      mathField.latex(nextProps.value);
    }
  }

  componentDidMount() {
    const { value } = this.props;

    const MQ = window.MathQuill.getInterface(2);

    MQ.registerEmbed('response', () => ({
      htmlString: `<span class="response-embed">
        <span class="response-embed__char">R</span>
        <span class="response-embed__text">Response</span>
      </span>`,
      text() {
        return 'custom_embed';
      },
      latex() {
        return EMBED_RESPONSE;
      }
    }));

    const mathField = MQ.MathField(this.mathFieldRef.current, window.MathQuill);
    mathField.write(value);

    this.setState(
      () => ({ mathField }),
      () => {
        const textarea = mathField.el().querySelector('.mq-textarea textarea');
        textarea.addEventListener('keyup', this.handleChangeField);
        document.addEventListener('click', this.handleClick, false);
      }
    );
  }

  handleChangeField = () => {
    const { onInput } = this.props;
    const { mathField } = this.state;

    const text = mathField.latex();
    onInput(text);
  };

  onInput = (key, command = 'cmd') => {
    const { mathField } = this.state;

    if (!mathField) return;

    if (key === 'left_move') {
      mathField.keystroke('Left');
    } else if (key === 'right_move') {
      mathField.keystroke('Right');
    } else if (key === 'ln--') {
      mathField.write('ln\\left(\\right)');
    } else if (key === 'leftright3') {
      mathField.write('\\sqrt[3]{}');
    } else if (key === 'Backspace') {
      mathField.keystroke('Backspace');
    } else if (key === 'leftright2') {
      mathField.write('^2');
    } else if (key === 'down_move') {
      mathField.keystroke('Down');
    } else if (key === 'up_move') {
      mathField.keystroke('Up');
    } else if (key === '\\embed{response}') {
      mathField.write(key);
    } else {
      mathField[command](key);
    }
    mathField.focus();
    this.handleChangeField();
  };

  onClose = () => {
    this.setState({ mathFieldFocus: false });
  };

  focus = () => {
    const { mathField } = this.state;
    mathField.focus();
  };

  render() {
    const { mathFieldFocus } = this.state;
    const { showResponse, style, onFocus, onKeyDown, symbols, numberPad } = this.props;

    return (
      <MathInputStyles>
        <div
          ref={this.containerRef}
          onFocus={() => {
            onFocus(true);
            this.setState({ mathFieldFocus: true });
          }}
          className="input"
        >
          <div onKeyDown={onKeyDown} className="input__math" style={style}>
            <span
              className="input__math__field"
              ref={this.mathFieldRef}
              onClick={() => this.setState({ mathFieldFocus: true })}
            />
          </div>
          <div className="input__keyboard">
            {mathFieldFocus && (
              <MathKeyboard
                symbols={symbols}
                numberPad={numberPad}
                showResponse={showResponse}
                onInput={this.onInput}
                onClose={this.onClose}
              />
            )}
          </div>
        </div>
      </MathInputStyles>
    );
  }
}

MathInput.propTypes = {
  onInput: PropTypes.func.isRequired,
  symbols: PropTypes.array.isRequired,
  numberPad: PropTypes.array.isRequired,
  showResponse: PropTypes.bool,
  value: PropTypes.string,
  style: PropTypes.object,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func
};

MathInput.defaultProps = {
  value: '',
  showResponse: false,
  style: {},
  onFocus: () => {},
  onKeyDown: () => {}
};

export default MathInput;
