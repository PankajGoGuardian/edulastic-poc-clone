import React from 'react';
import PropTypes from 'prop-types';

import { NUMBER_PAD_ITEMS } from '../../constants/numberPadItems';

import NumberPadItem from './components/NumberPadItem';
import { NumberPadWrapper } from './styled/NumberPadWrapper';

export const NumberPadContext = React.createContext();

const NumberPad = ({ items, onChange, characterMapButtons }) => {
  const selectHandler = index => (newValue) => {
    onChange(index, newValue);
  };

  return (
    <NumberPadWrapper>
      {items.map((item, index) => (
        <NumberPadContext.Provider key={index} value={characterMapButtons}>
          <NumberPadItem onSelect={selectHandler(index)} item={item} />
        </NumberPadContext.Provider>
      ))}
    </NumberPadWrapper>
  );
};

NumberPad.propTypes = {
  onChange: PropTypes.func.isRequired,
  characterMapButtons: PropTypes.array,
  items: PropTypes.array
};

NumberPad.defaultProps = {
  items: Array(20).fill({ value: '', label: 'empty' }),
  characterMapButtons: [{ value: '', label: 'empty' }, ...NUMBER_PAD_ITEMS]
};

export default NumberPad;
