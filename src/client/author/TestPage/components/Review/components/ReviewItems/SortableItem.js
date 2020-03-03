import React, { useState, useEffect } from "react";
import { SortableElement } from "react-sortable-hoc";
import ReviewItem from "../ReviewItem";
import DragHandle from "./DragHandle";
import { DragCrad, ReviewItemWrapper } from "./styled";

export default SortableElement(({ item, onSelect, selected, isCollapse, removeItem, isEditable, ...rest }) => {
  const [expand, toggleExpand] = useState(false);

  const toggleExpandRow = () => toggleExpand(!expand);

  const handleSelect = e => {
    onSelect(item.key, e.target.checked);
  };

  const handleDelete = () => {
    removeItem(item.key);
  };

  const checked = selected.includes(item.key);

  useEffect(() => {
    toggleExpand(!isCollapse);
  }, [isCollapse]);

  return (
    <DragCrad>
      {!expand && <DragHandle onSelect={handleSelect} isEditable={isEditable} selected={checked} indx={item.key} />}
      <ReviewItemWrapper>
        <ReviewItem
          data={item}
          {...rest}
          isEditable={isEditable}
          onDelete={handleDelete}
          toggleExpandRow={toggleExpandRow}
          selected={checked}
          onSelect={handleSelect}
          expand={expand}
        />
      </ReviewItemWrapper>
    </DragCrad>
  );
});
