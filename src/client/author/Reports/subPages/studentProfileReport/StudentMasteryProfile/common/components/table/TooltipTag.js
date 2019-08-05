import React from "react";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import { StyledTag } from "../../styled";

const TooltipTag = ({ standard }) => {
  const toolTipText = () => (
    <div>
      <TableTooltipRow title={"Domain : "} value={standard.domain} />
      <TableTooltipRow title={"Domain Description : "} value={standard.domainName} />
      <TableTooltipRow title={"Standard : "} value={standard.standard} />
      <TableTooltipRow title={"Standard Description : "} value={standard.standardName} />
      <TableTooltipRow title={"Mastery Status : "} value={standard.masteryName} />
    </div>
  );

  const { color = "#cccccc" } = standard.scale;

  return (
    <CustomTableTooltip
      placement="top"
      title={toolTipText()}
      getCellContents={() => <StyledTag color={color}>{standard.standard}</StyledTag>}
    />
  );
};

export default TooltipTag;
