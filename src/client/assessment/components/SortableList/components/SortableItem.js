import React from "react";
import { SortableElement } from "react-sortable-hoc";

import { SortableItemContainer } from "../styled/SortableItemContainer";
import DragHandle from "./DragHandle";
import DeleteButton from "./DeleteButton";
import FocusInput from "./FocusInput";

const SortableItem = React.memo(
  SortableElement(({ cyIndex, value, dirty, onRemove, onChange }) => (
    <SortableItemContainer data-cy={`choice${cyIndex}`}>
      <div className="main">
        <DragHandle />
        <div>
          <FocusInput
            style={{ background: "transparent" }}
            data-cy={`edit${cyIndex}`}
            type="text"
            dirty={dirty}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      <DeleteButton cIndex={cyIndex} onDelete={onRemove} />
    </SortableItemContainer>
  ))
);

export default SortableItem;
