import React, { memo } from "react";

import { SortableContainer } from "react-sortable-hoc";
import isObject from "lodash/isObject";
import { withNamespaces } from "@edulastic/localization";

import QuillSortableItem from "./components/QuillSortableItem";
import { SortableListContainer } from "./styled/SortableItemContainer";

// todo: union with SortableList
const QuillSortableList = SortableContainer(
  ({
    items,
    readOnly,
    firstFocus,
    onRemove,
    onChange,
    toolbarSize,
    fontSize = 14,
    prefix = "prefix",
    columns = 1,
    label = "",
    styleType = "",
    canDelete = true,
    t,
    centerContent,
    imageDefaultWidth,
    placeholder,
    defaultLabel,
    className
  }) => (
    <SortableListContainer data-cy="sortable-list-container" className={className}>
      {items.map((item, index) => (
        <QuillSortableItem
          fontSize={fontSize}
          key={index}
          centerContent={centerContent}
          index={index}
          label={defaultLabel === false ? "" : label ? `${label} ${index + 1}` : ""}
          indx={prefix + index}
          placeholder={placeholder || `${t("component.multiplechoice.optionPlaceholder")} #${index + 1}`}
          value={isObject(item) ? item.value : item}
          firstFocus={firstFocus}
          rOnly={readOnly}
          canDelete={canDelete}
          columns={columns}
          styleType={styleType}
          onRemove={() => onRemove(index, item?.id)}
          onChange={val => (typeof onChange === "function" ? onChange(index, val, item?.id) : () => {})}
          toolbarSize={toolbarSize}
          imageDefaultWidth={imageDefaultWidth}
        />
      ))}
    </SortableListContainer>
  )
);

export default memo(withNamespaces("assessment")(QuillSortableList));
