import React from "react";
import { SortableHandle } from "react-sortable-hoc";
import { QuestionNumberLabel, CheckboxLabel } from "@edulastic/common";
import { FaBars } from "react-icons/fa";
import { DragHandler } from "./styled";

export default React.memo(
  SortableHandle(({ selected, onSelect, isEditable, indx }) => (
    <DragHandler>
      <QuestionNumberLabel width={28} height={28}>
        {indx + 1}
      </QuestionNumberLabel>
      {isEditable && <FaBars />}
      {isEditable && <CheckboxLabel checked={selected} onChange={onSelect} />}
    </DragHandler>
  ))
);
