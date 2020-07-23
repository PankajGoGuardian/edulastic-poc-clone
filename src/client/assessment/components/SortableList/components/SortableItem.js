import React, { memo } from "react";
import { SortableElement } from "react-sortable-hoc";
import { red, greyThemeDark2 } from "@edulastic/colors";

import { FlexContainer } from "@edulastic/common";
import { SortableItemContainer } from "../../QuillSortableList/styled/SortableItemContainer";
import DragHandle from "../../QuillSortableList/components/DragHandle";
import FocusInput from "./FocusInput";
import { IconTrash } from "../styled/IconTrash";

const SortableItem = SortableElement(({ cyIndex, fontSize, columns = 1, value, dirty, onRemove, onChange }) => (
  <SortableItemContainer fontSize={fontSize} columns={columns} data-cy={`choice${cyIndex}`}>
    <FlexContainer alignItems="center" flex="1">
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
      <IconTrash data-cy="deleteButton" cIndex={cyIndex} onClick={onRemove} color={greyThemeDark2} hoverColor={red} />
    </FlexContainer>
  </SortableItemContainer>
));
export default memo(SortableItem);
