import React from "react";
import { Tooltip } from "antd";
import styled from "styled-components";
import { black } from "@edulastic/colors";

const CustomTableTooltip = props => {
  let { className, overlayClassName, getCellContents, ...attrs } = props;
  return (
    <Tooltip {...attrs} overlayClassName={`custom-table-tooltip ${overlayClassName} ${className}`}>
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
