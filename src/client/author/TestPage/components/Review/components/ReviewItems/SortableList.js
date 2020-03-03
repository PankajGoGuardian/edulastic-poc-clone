import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import SortableItem from "./SortableItem";

export default SortableContainer(({ items, isEditable, ...rest }) => (
  <div>
    {items.map((item, index) => (
      <SortableItem
        key={`item-${index}`}
        disabled={!isEditable}
        isEditable={isEditable}
        index={index}
        item={item}
        {...rest}
      />
    ))}
  </div>
));
