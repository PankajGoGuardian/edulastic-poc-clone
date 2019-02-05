import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import SortableItem from './components/SortableItem';

const SortableList = React.memo(
  SortableContainer(({ items, onRemove, onChange }) => (
    <div>
      {items.map((value, index) => (
        <SortableItem
          key={index}
          index={index}
          value={value}
          onRemove={() => onRemove(index)}
          onChange={e => onChange(index, e)}
        />
      ))}
    </div>
  ))
);

export default SortableList;
