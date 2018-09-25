import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { white, textColor, grey } from '../../../utils/css';

const Select = ({ onChange, options, value }) => (
  <SelectContainer>
    <Main onChange={e => onChange(e.target.value)} defaultValue={value}>
      {options.map((item, index) => (
        <option key={index} value={item.value}>
          {item.label}
        </option>
      ))}
    </Main>
  </SelectContainer>
);

Select.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default Select;

const Main = styled.select`
  padding: 1em 2em;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: ${white};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  color: ${textColor};
  font-size: 14px;
  border: 1px solid ${grey};
  -webkit-appearance: none;
`;

const SelectContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 150px;
  min-height: 40px;
  &:before {
    position: absolute;
    font-family: 'FontAwesome';
    top: 0;
    right: 25px;
    display: flex;
    align-items: center;
    height: 100%;
    color: ${props => props.theme.selectArrowColor};
    content: '\f0d7';
  }
  @media (max-width: 760px) {
    height: 52px;
    width: 188px;
  }
`;
