/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Button, Icon, Select } from 'antd';
import PropTypes from 'prop-types';
import { math } from '@edulastic/constants';

import Left from '../../assets/images/numpads/left.svg';
import Right from '../../assets/images/numpads/right.svg';
import Delete from '../../assets/images/numpads/delete.svg';
import Sqrt from '../../assets/images/numpads/sqrt.svg';
import Group940 from '../../assets/images/numpads/940.svg';
import Group941 from '../../assets/images/numpads/941.svg';
import Group942 from '../../assets/images/numpads/942.svg';
import Group943 from '../../assets/images/numpads/943.svg';
import Group944 from '../../assets/images/numpads/944.svg';
import Group993 from '../../assets/images/numpads/993.svg';
import Group940v2 from '../../assets/images/numpads/940-2.svg';
import Group944v2 from '../../assets/images/numpads/944-2.svg';
import Group999 from '../../assets/images/numpads/999.svg';
import Group1052 from '../../assets/images/numpads/1052.svg';

import MathKeyboardStyles from './MathKeyboardStyles';

const { EMBED_RESPONSE } = math;

class MathKeyboard extends React.PureComponent {
  state = {
    dropdownOpened: false,
    type: 'all'
  };

  keyboardOptions = [
    { value: 'all', label: 'All Symbols' },
    { value: 'basic', label: 'Basic' },
    { value: 'basicJunior', label: 'Basic Junior' },
    { value: 'algebra', label: 'Algebra' },
    { value: 'comparison', label: 'Comparison' },
    { value: 'geometry', label: 'Geometry' },
    { value: 'matrix', label: 'matrix' },
    { value: '∩', label: '∩' },
    { value: 'sin', label: 'sin' },
    { value: 'α', label: 'α' },
    { value: 'discrete', label: 'Discrete' },
    { value: 'kg', label: 'kg' },
    { value: 'lb', label: 'lb' },
    { value: 'groupingSymbols', label: <img src={Group944} width={16} height={16} /> },
    { value: 'delta', label: 'Δ' },
    { value: 'chem', label: 'Chem' }
  ];

  buttons = [
    { handler: 'x', label: 'x', types: ['all', 'basic', 'algebra'] },
    { handler: 'y', label: 'y', types: ['all', 'basic', 'algebra'] },
    { handler: 'leftright2', label: 'x²', types: ['all', 'basic', 'algebra'] },
    {
      handler: '\\sqrt',
      label: <img className="num__image num__image-sqrt" src={Sqrt} role="presentation" />,
      types: ['all', 'basic', 'algebra']
    },
    {
      handler: '\\nthroot',
      label: <img className="num__image num__image-sqrt" src={Group999} role="presentation" />,
      types: ['all', 'algebra']
    },
    {
      handler: '/',
      label: <img className="num__image num__image-frac1" src={Group940} role="presentation" />,
      types: ['all', 'basic', 'algebra']
    },
    {
      handler: '/',
      label: <img className="num__image num__image-frac1" src={Group940v2} role="presentation" />,
      types: ['all', 'basicJunior']
    },
    {
      handler: '/',
      label: <img className="num__image num__image-frac2" src={Group941} role="presentation" />,
      types: ['all', 'basic', 'basicJunior', 'algebra']
    },
    {
      handler: 'leftright2',
      label: <img className="num__image num__image-expo" src={Group942} role="presentation" />,
      types: ['all', 'basic', 'algebra']
    },
    {
      handler: '≠',
      label: '≠',
      types: ['all', 'comparison']
    },
    {
      handler: '≈',
      label: '≈',
      types: ['all', 'comparison']
    },
    {
      handler: '<',
      label: '<',
      types: ['all', 'basic', 'basicJunior', 'algebra', 'comparison']
    },
    {
      handler: '_',
      label: <img className="num__image num__image-log" src={Group943} role="presentation" />,
      types: ['all', 'basic']
    },
    {
      handler: '>',
      label: '>',
      types: ['all', 'basic', 'basicJunior', 'algebra', 'comparison']
    },
    {
      handler: '≤',
      label: '≤',
      types: ['all', 'comparison']
    },
    {
      handler: '≥',
      label: '≥',
      types: ['all', 'comparison']
    },
    {
      handler: '≯',
      label: '≯',
      types: ['all', 'comparison']
    },
    {
      handler: '≮',
      label: '≮',
      types: ['all', 'comparison']
    },
    {
      handler: '±',
      label: '±',
      types: ['all', 'basic', 'algebra']
    },
    {
      handler: '$',
      label: '$',
      types: ['all', 'basic']
    },
    {
      handler: '%',
      label: '%',
      types: ['all', 'basic']
    },
    {
      handler: '°',
      label: 'º',
      types: ['all', 'basic']
    },
    {
      handler: ':',
      label: ':',
      types: ['all', 'basic']
    },
    {
      handler: '(',
      label: <img className="num__image num__image-bracket" src={Group944} role="presentation" />,
      types: ['all', 'basic', 'algebra']
    },
    {
      handler: '[',
      label: <img className="num__image num__image-bracket" src={Group944v2} role="presentation" />,
      types: ['all', 'algebra']
    },
    {
      handler: '|',
      label: <img className="num__image num__image-bar" src={Group993} role="presentation" />,
      types: ['all', 'basic', 'algebra']
    },
    {
      handler: 'π',
      label: 'π',
      types: ['all', 'basic', 'algebra']
    },
    {
      handler: 'Backspace',
      label: <img className="num__backspace num__image-back" src={Delete} role="presentation" />,
      types: ['all', 'basic']
    },
    {
      handler: '∞',
      label: '∞',
      types: ['all', 'basic', 'algebra']
    },
    // Geometry
    {
      handler: '⊥',
      label: '⊥',
      types: ['all', 'geometry']
    },
    {
      handler: '∥',
      label: '∥',
      types: ['all', 'geometry']
    },
    {
      handler: '∦',
      label: '∦',
      types: ['all', 'geometry']
    },
    {
      handler: '\\overset{\\hphantom}{\\sim}',
      label: <img className="num__backspace num__image-back" src={Group1052} role="presentation" />,
      types: ['all', 'geometry']
    }
  ];

  close = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleGroupSelect = (value) => {
    this.setState({
      type: value
    });
  };

  renderButtons = () => {
    const { onInput } = this.props;
    const { type } = this.state;

    return this.buttons.map(({ label, handler, types }, i) => {
      if (types.includes(type)) {
        return (
          <Button key={i} className="num num--type-3" onClick={() => onInput(handler)}>
            {label}
          </Button>
        );
      }

      return null;
    });
  };

  render() {
    const { dropdownOpened } = this.state;
    const { onInput, showResponse } = this.props;

    return (
      <MathKeyboardStyles>
        <div className="keyboard">
          <div className="keyboard__header">
            <div>
              <Select
                defaultValue="basic"
                className="keyboard__header__select"
                size="large"
                onSelect={this.handleGroupSelect}
                onDropdownVisibleChange={(open) => {
                  this.setState({ dropdownOpened: open });
                }}
                suffixIcon={(
                  <Icon
                    type={dropdownOpened ? 'up' : 'down'}
                    style={{ color: '#51aef8' }}
                    theme="outlined"
                  />
)}
              >
                {this.keyboardOptions.map(({ value, label }) => (
                  <Select.Option value={value} key={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
              {showResponse && (
                <button
                  type="button"
                  className="keyboard__header__response"
                  title="Response"
                  onClick={() => onInput(EMBED_RESPONSE)}
                >
                  <span className="keyboard__header__response_in">r</span>
                </button>
              )}
            </div>
            <Button className="keyboard__header__close" onClick={this.close}>
              <Icon type="close" />
            </Button>
          </div>
          <br />
          <div className="keyboard__main">
            <div className="half-box">
              <div className="row">
                <Button className="num num--type-1" onClick={() => onInput('7')}>
                  7
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('8')}>
                  8
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('9')}>
                  9
                </Button>
                <Button className="num num--type-2" onClick={() => onInput('\\div')}>
                  ÷
                </Button>
              </div>
              <div className="row">
                <Button className="num num--type-1" onClick={() => onInput('4')}>
                  4
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('5')}>
                  5
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('6')}>
                  6
                </Button>
                <Button className="num num--type-2" onClick={() => onInput('\\times')}>
                  x
                </Button>
              </div>
              <div className="row">
                <Button className="num num--type-1" onClick={() => onInput('1')}>
                  1
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('2')}>
                  2
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('3')}>
                  3
                </Button>
                <Button className="num num--type-2" onClick={() => onInput('-')}>
                  -
                </Button>
              </div>
              <div className="row">
                <Button className="num num--type-1" onClick={() => onInput('0')}>
                  0
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('.')}>
                  .
                </Button>
                <Button className="num num--type-1" onClick={() => onInput(',')}>
                  ,
                </Button>
                <Button className="num num--type-2" onClick={() => onInput('+')}>
                  +
                </Button>
              </div>
              <div className="row">
                <Button className="num num--type-1" onClick={() => onInput('left_move')}>
                  <img className="num__move" src={Left} role="presentation" />
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('right_move')}>
                  <img className="num__move" src={Right} role="presentation" />
                </Button>
                <Button className="num num--type-1" onClick={() => onInput('Backspace')}>
                  <img className="num__backspace" src={Delete} role="presentation" />
                </Button>
                <Button className="num num--type-2" onClick={() => onInput('=')}>
                  =
                </Button>
              </div>
            </div>
            <div className="keyboard__types3 half-box">{this.renderButtons()}</div>
          </div>
        </div>
      </MathKeyboardStyles>
    );
  }
}

MathKeyboard.propTypes = {
  onClose: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired,
  showResponse: PropTypes.bool
};

MathKeyboard.defaultProps = {
  showResponse: false
};

export default MathKeyboard;
