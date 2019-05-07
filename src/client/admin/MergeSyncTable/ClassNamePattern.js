import React, { useState, useEffect } from "react";
import { Select } from "antd";
import CancelApplyActions from "./CancelApplyActions";
import { CLASS_NAME_PATTERN_CONFIG } from "../Data";

const Option = Select.Option;

export default function ClassNamePattern({ orgId, orgType, applyClassNamesSync, classNamePattern }) {
  const [selectState, setSelectState] = useState(CLASS_NAME_PATTERN_CONFIG[classNamePattern]);

  const handleApplyClick = () =>
    applyClassNamesSync({
      orgId,
      orgType,
      classNamePattern: selectState
    });

  return (
    <>
      <h2>Edulastic Class Names</h2>
      <Select value={selectState} style={{ width: "350px" }} onChange={value => setSelectState(value)}>
        <Option value="DEFAULT">Default Clever Names</Option>
        <Option value="CNAME_TLNAME_PERIOD">Course Name - Teacher LastName - Period</Option>
        <Option value="CNAME_TLNAME_TERM">Course Name - Teacher LastName - Term</Option>
      </Select>
      <CancelApplyActions onApplyAction={handleApplyClick} />
    </>
  );
}
