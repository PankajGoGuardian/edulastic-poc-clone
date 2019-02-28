import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import SortableItem from "./components/SortableItem";

const SortableList = React.memo(
  SortableContainer(({ items, dirty, onRemove, onChange }) => (
    <div>
      {items.map((value, index) => (
        <SortableItem
          key={index}
          cyIndex={`_prefix_${index}`}
          value={value}
          dirty={dirty}
          onRemove={() => onRemove(index)}
          onChange={e => onChange(index, e)}
        />
      ))}
    </div>
  ))
);

export default SortableList;
