import * as React from 'react';
import PropTypes from 'prop-types';
import { math } from '@edulastic/constants';

import { IconClose } from '@edulastic/icons';
import { red, white, greenDark } from '@edulastic/colors';
import MathKeyboard from '../MathKeyboard';
import MathInputStyles from './MathInputStyles';

const { mathInputTypes, EMBED_RESPONSE } = math;

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
  }

  handleClick = (e) => {
    if (e.target.nodeName === 'LI' && e.target.attributes[0].nodeValue === 'option') {
      return;
    }
    if (!this.containerRef.current.contains(e.target)) {
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
    const { onInput, value } = this.props;

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

    mathField.config({
      spaceBehavesLikeTab: true,
      handlers: {
        edit: () => {
          const text = mathField.latex();

          if (onInput) {
            onInput(text);
          }
        }
      }
    });

    this.setState({ mathField });

    document.addEventListener('click', this.handleClick, false);
  }

  onInput = (key) => {
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
      mathField.cmd(key);
    }
    mathField.focus();
  };

  onClose = () => {
    this.setState({ mathFieldFocus: false });
  };

  get iconColor() {
    const { type } = this.props;

    switch (type) {
      case mathInputTypes.CLEAR:
        return white;
      case mathInputTypes.WRONG:
        return red;
      case mathInputTypes.SUCCESS:
        return greenDark;
      default:
        return white;
    }
  }

  render() {
    const { mathFieldFocus } = this.state;
    const { type, showResponse } = this.props;

    return (
      <MathInputStyles>
        <div
          ref={this.containerRef}
          onFocus={() => this.setState({ mathFieldFocus: true })}
          className="input"
        >
          <div className={`input__math ${type}`}>
            <span
              className="input__math__field"
              ref={this.mathFieldRef}
              onClick={() => this.setState({ mathFieldFocus: true })}
            />
            {['wrong', 'success'].includes(type) && (
              <div className="input__math__icon">
                <IconClose color={this.iconColor} />
              </div>
            )}
          </div>
          <div className="input__keyboard">
            {mathFieldFocus && (
              <MathKeyboard
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
  type: PropTypes.oneOf([mathInputTypes.CLEAR, mathInputTypes.WRONG, mathInputTypes.SUCCESS]),
  showResponse: PropTypes.bool,
  value: PropTypes.string
};

MathInput.defaultProps = {
  value: '',
  type: 'clear',
  showResponse: false
};

export default MathInput;
