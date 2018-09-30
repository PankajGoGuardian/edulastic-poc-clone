import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { grey, greenDark } from '@edulastic/colors';

class TextField extends Component {
  state = {
    referenceEditable: false,
  }

  onIconClick = () => {
    console.log('on icon click');
    const { referenceEditable } = this.state;
    this.setState({ referenceEditable: !referenceEditable });
  }

  render() {
    // eslint-disable-next-line
    const { icon, height, style, containerStyle, onChange, onBlur, ...restProps } = this.props;
    const { referenceEditable } = this.state;
    return (
      <Container height={height} style={containerStyle}>
        <Field
          disabled={!referenceEditable}
          type="text"
          style={style}
          referenceEditable={referenceEditable}
          {...restProps}
          onChange={onChange}
          onBlur={(e) => { this.onIconClick(); onBlur(e); }}
        />
        {icon && <Icon onClick={this.onIconClick}>{icon}</Icon>}
      </Container>
    );
  }
}

TextField.propTypes = {
  icon: PropTypes.any,
  height: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

TextField.defaultProps = {
  icon: null,
  height: '45px',
  style: {},
  containerStyle: {},
};

export default TextField;

const Container = styled.span`
  position: relative;
  height: ${({ height }) => height};
  width: 100%;
`;

const Icon = styled.span`
    position: absolute;
    right: 8px;
    height: 100%;
    display: flex;
    align-items: center;
    top: 0;

    &:hover {
      cursor: pointer;
    }
`;

const Field = styled.input`
  border: 1px solid ${props => (props.referenceEditable ? greenDark : grey)};
  border-radius: 10px;
  min-height: 100%;
  width: 100%;
  padding: 10px 35px;
  color: #7a7a7a;
  font-size: 14px;
  letter-spacing: 0.5px;
`;
