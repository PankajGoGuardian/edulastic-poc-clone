import React from "react";
import { Tooltip } from "antd";
import styled from "styled-components";
import { black } from "@edulastic/colors";

const CustomTableTooltip = props => {
  const { className, overlayClassName = "", getCellContents, columnKey, ...attrs } = props;
  const tableContainer = document.getElementById("student_reports_table");

  return (
    <Tooltip
      {...attrs}
      overlayClassName={`custom-table-tooltip ${overlayClassName} ${className}`}
      getPopupContainer={() => tableContainer}
    >
      {getCellContents(props)}
    </Tooltip>
  );
};

const StyledCustomTableTooltip = styled(CustomTableTooltip)`
  max-width: 500px;

  .ant-tooltip-content {
    .ant-tooltip-arrow {
      border-top-color: white;
    }
    .ant-tooltip-inner {
      background-color: white;
      color: ${black};
      .custom-table-tooltip-value {
        font-weight: 900;
        margin-left: 5px;
      }
    }
  }
`;

export { StyledCustomTableTooltip as CustomTableTooltip };
