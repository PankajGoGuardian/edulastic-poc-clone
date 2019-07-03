import React, { memo } from "react";
import { SortableElement } from "react-sortable-hoc";
import { IconTrash } from "@edulastic/icons";
import { red, themeColor } from "@edulastic/colors";

import { FlexContainer } from "@edulastic/common";
import { SortableItemContainer } from "../../QuillSortableList/styled/SortableItemContainer";
import DragHandle from "../../QuillSortableList/components/DragHandle";
import FocusInput from "./FocusInput";

const SortableItem = SortableElement(({ cyIndex, fontSize, columns = 1, value, dirty, onRemove, onChange }) => (
  <SortableItemContainer fontSize={fontSize} columns={columns} data-cy={`choice${cyIndex}`}>
    <FlexContainer style={{ flex: 1 }}>
      <div className="main">
        <DragHandle index={cyIndex} />
        <div style={{ width: "100%" }}>
          <FocusInput
            style={{ background: "transparent", width: "100%" }}
            data-cy={`edit${cyIndex}`}
            type="text"
            dirty={dirty}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      <IconTrash
        style={{ cursor: "pointer" }}
        data-cy="deleteButton"
        cIndex={cyIndex}
        onClick={onRemove}
        color={themeColor}
        hoverColor={red}
        width={20}
        height={20}
      />
    </FlexContainer>
  </SortableItemContainer>
));
export default memo(SortableItem);
