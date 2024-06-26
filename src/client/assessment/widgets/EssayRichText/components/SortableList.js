import React from "react";
import { SortableContainer } from "react-sortable-hoc";

import { QlFormats } from "../styled/QlFormats";
import SortableItem from "./SortableItem";

const SortableList = SortableContainer(({ items, handleActiveChange }) => (
  <QlFormats>
    {items?.map((value, index) => (
      <SortableItem
        data-cy={`QuestionEssayRichEditFormatOption${value.value}-${value.id}`}
        item={value}
        i={index}
        index={index}
        handleActiveChange={handleActiveChange}
        key={value.id}
      />
    ))}
  </QlFormats>
));

export default SortableList;
