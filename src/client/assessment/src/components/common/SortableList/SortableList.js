import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { FlexContainer } from '@edulastic/common';

import SortableItem from './SortableItem';

const SortableList = SortableContainer(({ items, onRemove, onChange, columns = 1 }) => (
  <FlexContainer style={{ flexWrap: 'wrap' }} justifyContent="space-between">
    {items.map((value, index) => (
      <SortableItem
        key={index}
        index={index}
        value={value}
        columns={columns}
        onRemove={() => onRemove(index)}
        onChange={e => onChange(index, e.target.value)}
      />
    ))}
  </FlexContainer>
));

export default SortableList;
