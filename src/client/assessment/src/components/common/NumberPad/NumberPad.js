import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import NumberPadItem from './NumberPadItem';
import { numberPadItems } from '../Options/components/KeyPadOptions';

export const NumberPadContext = React.createContext();

const NumberPad = ({ items, onChange, characterMapButtons }) => {
  const selectHandler = index => (newValue) => {
    onChange(index, newValue);
  };

  return (
    <Wrapper>
      {items.map((item, index) => (
        <NumberPadContext.Provider key={index} value={characterMapButtons}>
          <NumberPadItem onSelect={selectHandler(index)} item={item} />
        </NumberPadContext.Provider>
      ))}
    </Wrapper>
  );
};

NumberPad.propTypes = {
  onChange: PropTypes.func.isRequired,
  characterMapButtons: PropTypes.array,
  items: PropTypes.array
};

NumberPad.defaultProps = {
  items: Array(20).fill({ value: '', label: 'empty' }),
  characterMapButtons: [{ value: '', label: 'empty' }, ...numberPadItems]
};

export default NumberPad;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
