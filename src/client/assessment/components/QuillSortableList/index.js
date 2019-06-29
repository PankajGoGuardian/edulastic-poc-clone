import React, { memo } from "react";
import { SortableContainer } from "react-sortable-hoc";
import { withNamespaces } from "@edulastic/localization";

import QuillSortableItem from "./components/QuillSortableItem";

// todo: union with SortableList
const QuillSortableList = SortableContainer(
  ({
    items,
    readOnly,
    firstFocus,
    onRemove,
    onChange,
    fontSize = 14,
    prefix = "prefix",
    columns = 1,
    label = "",
    canDelete = true,
    t
  }) => (
    <div data-cy="sortable-list-container" style={{ fontSize }}>
      {items.map((value, index) => (
        <QuillSortableItem
          fontSize={fontSize}
          key={index}
          index={index}
          label={label ? `${label} ${index + 1}` : ""}
          indx={prefix + index}
          placeholder={`${t("component.multiplechoice.optionPlaceholder")} ${index}`}
          value={value}
          firstFocus={firstFocus}
          rOnly={readOnly}
          canDelete={canDelete}
          columns={columns}
          onRemove={() => onRemove(index)}
          onChange={val => (typeof onChange === "function" ? onChange(index, val) : () => {})}
        />
      ))}
    </div>
  )
);

export default memo(withNamespaces("assessment")(QuillSortableList));
