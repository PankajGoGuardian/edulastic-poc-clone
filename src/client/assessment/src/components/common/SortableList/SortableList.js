import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { FlexContainer } from '@edulastic/common';

import SortableItem from './SortableItem';

const SortableList = SortableContainer(
  ({ items, onRemove, onChange, prefix = 'prefix', columns = 1 }) => (
    <FlexContainer style={{ flexWrap: 'wrap' }} justifyContent="space-between">
      {items.map((value, index) => (
        <SortableItem
          key={index}
          index={index}
          indx={prefix + index}
          value={value}
          columns={columns}
          onRemove={() => onRemove(index)}
          onChange={val => onChange(index, val)}
        />
      ))}
    </FlexContainer>
  )
);

export default SortableList;
