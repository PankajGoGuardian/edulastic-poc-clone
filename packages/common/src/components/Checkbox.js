import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { green } from '@edulastic/colors';

const Checkbox = ({ onChange, checked, label, style, className }) => (
  <Container onClick={onChange} style={style} className={className}>
    <Input type="checkbox" checked={checked} onChange={() => {}} />
    <span />
    {label && <span className="label">{label}</span>}
  </Container>
);

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  label: PropTypes.string,
  style: PropTypes.object,
};

Checkbox.defaultProps = {
  style: {},
  label: '',
  checked: false,
};

export default Checkbox;

const Input = styled.input`
  display: none;

  + span {
    display: inline-block;
    position: relative;
    top: -1px;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    margin: -1px 0px 0 0;
    vertical-align: middle;
    background: white left top no-repeat;
    border: solid 2px #cfcfcf;
    cursor: pointer;
    margin-right: 10px;
  }

  &:checked + span {
    background: ${green} -19px top no-repeat;
  }
`;

const Container = styled.span`
  cursor: pointer;
`;
