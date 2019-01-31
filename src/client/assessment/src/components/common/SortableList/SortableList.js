import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { FlexContainer } from '@edulastic/common';

import SortableItem from './SortableItem';

const SortableList = SortableContainer(
  ({ items, readOnly, onRemove, onChange, prefix = 'prefix', columns = 1, label = '' }) => (
    <FlexContainer style={{ flexWrap: 'wrap' }} justifyContent="space-between">
      {items.map((value, index) => (
        <SortableItem
          key={index}
          index={index}
          label={label ? `${label} ${index + 1}` : ''}
          indx={prefix + index}
          value={value}
          rOnly={readOnly}
          columns={columns}
          onRemove={() => onRemove(index)}
          onChange={val => (typeof onChange === 'function' ? onChange(index, val) : () => {})}
        />
      ))}
    </FlexContainer>
  )
);

export default SortableList;
