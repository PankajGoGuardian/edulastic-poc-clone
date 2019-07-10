import React, { memo } from "react";
import { SortableContainer } from "react-sortable-hoc";
import SortableItem from "./components/SortableItem";

const SortableList = SortableContainer(({ items, onRemove, onChange, defaultOptions = [] }) => (
  <div>
    {items.map((value, index) => (
      <SortableItem
        key={index}
        index={index}
        cyIndex={`_prefix_${index}`}
        value={value}
        dirty={!defaultOptions.includes(value)}
        onRemove={() => onRemove(index)}
        onChange={e => onChange(index, e)}
      />
    ))}
  </div>
));

export default memo(SortableList);
