import React, { useState, useEffect } from "react";
import { SortableElement } from "react-sortable-hoc";
import ReviewItem from "../ReviewItem";
import DragHandle from "./DragHandle";
import { DragCrad, ReviewItemWrapper } from "./styled";

const Item = SortableElement(props => {
  const { onSelect, data, isEditable, selected, expand } = props;
  return (
    <DragCrad>
      {!expand && <DragHandle onSelect={onSelect} isEditable={isEditable} selected={selected} indx={data.key} />}
      <ReviewItemWrapper>
        <ReviewItem {...props} />
      </ReviewItemWrapper>
    </DragCrad>
  );
});

export default props => {
  const { item, onSelect, selected, isCollapse, removeItem, disabled, ...rest } = props;
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
    <Item
      {...rest}
      data={item}
      selected={checked}
      expand={expand}
      disabled={disabled || expand}
      onDelete={handleDelete}
      toggleExpandRow={toggleExpandRow}
      onSelect={handleSelect}
    />
  );
};
