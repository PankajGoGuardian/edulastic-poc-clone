import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IconClose, IconCheck } from '@edulastic/icons';
import { math } from '@edulastic/constants';
import { red, greenDark } from '@edulastic/colors';

import MathKeyboard from '../MathKeyboard';
import MathInputStyles from '../MathInputStyles';

const { mathInputTypes } = math;

class StaticMath extends PureComponent {
  state = {
    mathField: null,
    innerField: null,
    showKeyboard: false
  };

  containerRef = React.createRef();

  mathFieldRef = React.createRef();

  componentWillUnmount() {
    // make sure you remove the listener when the component is destroyed
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick(e) {
    if (
      e.target.nodeName === 'svg' ||
      e.target.nodeName === 'path' ||
      (e.target.nodeName === 'LI' && e.target.attributes[0].nodeValue === 'option')
    ) {
      return;
    }
    if (this.containerRef.current && !this.containerRef.current.contains(e.target)) {
      this.setState({ showKeyboard: false });
    }
  }

  componentDidMount() {
    const MQ = window.MathQuill.getInterface(2);

    const mathField = MQ.StaticMath(this.mathFieldRef.current);
    this.setState({ mathField });

    document.addEventListener('click', this.handleClick.bind(this), false);
  }

  setLatex = (latex) => {
    const { mathField } = this.state;

    if (!mathField) return;
    mathField.latex(latex);

    for (let i = 0; i < mathField.innerFields.length; i++) {
      mathField.innerFields[i].el().addEventListener('click', () => {
        this.onFocus(mathField.innerFields[i]);
      });
    }
  };

  getLatex = () => {
    const { mathField } = this.state;

    if (!mathField) return;
    return mathField.latex();
  };

  onInput = (key) => {
    const { innerField } = this.state;

    if (!innerField) return;

    if (key === 'left_move') {
      innerField.keystroke('Left');
    } else if (key === 'right_move') {
      innerField.keystroke('Right');
    } else if (key === 'ln--') {
      innerField.write('ln\\left(\\right)');
    } else if (key === 'leftright3') {
      innerField.write('\\sqrt[3]{}');
    } else if (key === 'Backspace') {
      innerField.keystroke('Backspace');
    } else if (key === 'leftright2') {
      innerField.write('^2');
    } else if (key === 'down_move') {
      innerField.keystroke('Down');
    } else if (key === 'up_move') {
      innerField.keystroke('Up');
    } else {
      innerField.cmd(key);
    }
    innerField.focus();
  };

  onFocus(innerField) {
    this.setState({
      innerField,
      showKeyboard: true
    });
  }

  onClose = () => {
    this.setState({ showKeyboard: false });
  };

  render() {
    const { showKeyboard } = this.state;
    const { type, onBlur } = this.props;

    return (
      <MathInputStyles>
        <div ref={this.containerRef} className="input" onBlur={onBlur}>
          <div className={`input__math ${type}`}>
            <span className="input__math__field" ref={this.mathFieldRef} />

            <div className="input__math__icon">
              {type === mathInputTypes.WRONG && <IconClose color={red} />}
              {type === mathInputTypes.SUCCESS && <IconCheck color={greenDark} />}
            </div>
          </div>
          <div className="input__keyboard">
            {showKeyboard && (
              <MathKeyboard onInput={this.onInput} showResponse={false} onClose={this.onClose} />
            )}
          </div>
        </div>
      </MathInputStyles>
    );
  }
}

StaticMath.propTypes = {
  type: PropTypes.oneOf([mathInputTypes.CLEAR, mathInputTypes.WRONG, mathInputTypes.SUCCESS]),
  onBlur: PropTypes.func.isRequired
};

StaticMath.defaultProps = {
  type: mathInputTypes.CLEAR
};

export default StaticMath;
