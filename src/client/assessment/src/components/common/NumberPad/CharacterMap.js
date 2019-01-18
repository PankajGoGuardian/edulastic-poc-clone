import React, { useContext } from 'react';
import styled from 'styled-components';

import NumberPadButton from './NumberPadButton';
import { NumberPadContext } from './NumberPad';

// eslint-disable-next-line react/prop-types
const CharacterMap = ({ onClick }) => {
  const items = useContext(NumberPadContext);

  return (
    <Wrapper style={{ flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <NumberPadButton onClick={() => onClick(item.value)} key={index}>
          {item.label}
        </NumberPadButton>
      ))}
    </Wrapper>
  );
};

export default CharacterMap;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 400px;
  max-height: 200px;
  overflow-y: auto;
`;
