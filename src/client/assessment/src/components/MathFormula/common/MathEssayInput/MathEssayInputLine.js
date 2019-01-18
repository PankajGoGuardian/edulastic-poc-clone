import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { blue, white } from '@edulastic/colors';
import enhanceWithClickOutside from 'react-click-outside';
import { Icon } from 'antd';
import { getFontSize } from '../../../../utils/helpers';

import CustomTextInput from './CustomTextInput';
import MathInput from '../MathInput';

class MathEssayInputLine extends Component {
  state = {
    isEmpty: false
  };

  inputRef = React.createRef();

  handleFocus = (val) => {
    const { setActive } = this.props;

    if (val) {
      setActive(false);
    }
  };

  componentWillReceiveProps(nextProps) {
    const empty = !!(nextProps.line.text === '<p><br></p>' || nextProps.line.text === '');

    if (!empty) {
      this.setState({
        isEmpty: false
      });
    } else {
      this.setState({
        isEmpty: true
      });
    }
  }

  focus = () => {
    const { active } = this.props;

    if (active && this.inputRef.current) {
      setTimeout(() => {
        this.inputRef.current.focus();
      }, 0);
    }
  };

  componentDidMount() {
    this.focus();
  }

  get fontSize() {
    const { item } = this.props;
    return getFontSize(item.ui_style.fontsize);
  }

  render() {
    const { isEmpty } = this.state;
    const { onAddNewLine, onChange, line, id, onChangeType, active, item } = this.props;

    return (
      <Wrapper active={active}>
        <WrapperIn>
          {line.type === 'text' && (
            <CustomTextInput
              ref={this.inputRef}
              toolbarId={`toolbarId${id}`}
              onFocus={this.handleFocus}
              value={line.text}
              onChange={onChange}
              fontSize={this.fontSize}
            />
          )}
          {line.type === 'math' && (
            <MathInput
              ref={this.inputRef}
              symbols={item.symbols}
              numberPad={item.numberPad}
              value={line.text}
              onInput={onChange}
              onFocus={this.handleFocus}
              style={{
                border: 0,
                height: 'auto',
                minHeight: 'auto',
                fontSize: this.fontSize
              }}
            />
          )}
          {active && isEmpty && (
            <Buttons>
              <Button
                className={line.type === 'math' ? 'active' : ''}
                onClick={() => onChangeType('math')}
                title="Math"
              >
                M
              </Button>
              <Button
                className={line.type === 'text' ? 'active' : ''}
                onClick={() => onChangeType('text')}
                title="Text"
              >
                T
              </Button>
            </Buttons>
          )}
          {active && !isEmpty && (
            <Buttons>
              <Button onClick={onAddNewLine} title="Create new line">
                <Icon type="enter" />
              </Button>
            </Buttons>
          )}
        </WrapperIn>
        {active && <Label>{line.type}</Label>}
      </Wrapper>
    );
  }
}

MathEssayInputLine.propTypes = {
  line: PropTypes.object,
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddNewLine: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
};

MathEssayInputLine.defaultProps = {
  line: {
    text: '',
    type: 'text'
  }
};

export default enhanceWithClickOutside(MathEssayInputLine);

const Wrapper = styled.div`
  border: 1px solid transparent;
  position: relative;

  ${props =>
    props.active &&
    css`
      border-color: ${blue};
      border-left-color: transparent;
      border-right-color: transparent;
    `}
`;

const WrapperIn = styled.div`
  position: relative;
`;

const Label = styled.div`
  position: absolute;
  right: 0;
  top: -14px;
  width: 70px;
  height: 14px;
  line-height: 14px;
  background: ${blue};
  color: ${white};
  text-transform: uppercase;
  text-align: center;
  font-size: 10px;
`;

const Buttons = styled.div`
  display: inline-flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
`;

const Button = styled.div`
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  border: 1px solid ${blue};
  border-radius: 5px;
  margin-right: 15px;
  cursor: pointer;

  :hover,
  &.active {
    background: ${blue};
    color: ${white};
  }

  :last-child {
    margin-right: 0;
  }
`;
