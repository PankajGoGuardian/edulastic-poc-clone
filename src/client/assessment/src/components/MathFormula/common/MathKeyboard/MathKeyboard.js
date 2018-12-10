/* eslint-disable jsx-a11y/alt-text */
import * as React from 'react';
import { Button, Icon, Select } from 'antd';
import PropTypes from 'prop-types';

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

import MathKeyboardStyles from './MathKeyboardStyles';

class MathKeyboard extends React.PureComponent {
  state = {
    dropdownOpened: false
  };

  close = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { dropdownOpened } = this.state;
    const { onInput } = this.props;

    return (
      <MathKeyboardStyles>
        <div className="keyboard">
          <div className="keyboard__header">
            <Select
              defaultValue="basic"
              className="keyboard__header__select"
              size="large"
              onDropdownVisibleChange={open => this.setState({ dropdownOpened: open })}
              suffixIcon={(
                <Icon
                  type={dropdownOpened ? 'up' : 'down'}
                  style={{ color: '#51aef8' }}
                  theme="outlined"
                />
)}
            >
              <Select.Option value="basic">Basic</Select.Option>
              <Select.Option value="x">x</Select.Option>
            </Select>
            <Button className="keyboard__header__close" onClick={this.close}>
              <Icon type="close" />
            </Button>
          </div>
          <br />
          <div>
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
              <Button className="num num--type-3 italic" onClick={() => onInput('x')}>
                x
              </Button>
              <Button className="num num--type-3 italic" onClick={() => onInput('y')}>
                y
              </Button>
              <Button className="num num--type-3 italic" onClick={() => onInput('leftright2')}>
                x²
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('\\sqrt')}>
                <img className="num__image num__image-sqrt" src={Sqrt} role="presentation" />
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
              <Button className="num num--type-3" onClick={() => onInput('/')}>
                <img className="num__image num__image-frac1" src={Group940} role="presentation" />
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('/')}>
                <img className="num__image num__image-frac2" src={Group941} role="presentation" />
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('leftright2')}>
                <img className="num__image num__image-expo" src={Group942} role="presentation" />
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('_')}>
                <img className="num__image num__image-log" src={Group943} role="presentation" />
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
              <Button className="num num--type-3" onClick={() => onInput('<')}>
                {'<'}
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('>')}>
                {'>'}
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('±')}>
                ±
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('$')}>
                $
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
              <Button className="num num--type-3" onClick={() => onInput('%')}>
                %
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('°')}>
                º
              </Button>
              <Button className="num num--type-3" onClick={() => onInput(':')}>
                :
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('(')}>
                <img className="num__image num__image-bracket" src={Group944} role="presentation" />
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
              <Button className="num num--type-3" onClick={() => onInput('|')}>
                <img className="num__image num__image-bar" src={Group993} role="presentation" />
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('π')}>
                π
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('Backspace')}>
                <img className="num__backspace num__image-back" src={Delete} role="presentation" />
              </Button>
              <Button className="num num--type-3" onClick={() => onInput('∞')}>
                ∞
              </Button>
            </div>
          </div>
        </div>
      </MathKeyboardStyles>
    );
  }
}

MathKeyboard.propTypes = {
  onClose: PropTypes.func.isRequired,
  onInput: PropTypes.func.isRequired
};

export default MathKeyboard;
