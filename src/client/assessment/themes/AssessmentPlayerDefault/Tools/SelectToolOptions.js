import React from "react";
import { IconExpandArrowIn, IconExpandArrowOut, IconCut, IconInverse, IconInverseOut } from "@edulastic/icons";
import { white } from "@edulastic/colors";
import { Tooltip } from "../../../../common/utils/helpers";
import { customizeIcon, StyledButton } from "./styled";

const ExpandArrowInIcon = customizeIcon(IconExpandArrowIn);
const ExpandArrowOutIcon = customizeIcon(IconExpandArrowOut);
const CutIcon = customizeIcon(IconCut);
const InverseIcon = customizeIcon(IconInverse);
const InverseOutIcon = customizeIcon(IconInverseOut);

const optionsList = [
  { mode: "", icon: ExpandArrowInIcon },
  { mode: "", icon: ExpandArrowOutIcon },
  { mode: "", icon: CutIcon },
  { mode: "", icon: InverseIcon },
  { mode: "", icon: InverseOutIcon }
];

export default () =>
  optionsList.map((button, i) => (
    <Tooltip placement="right" title={button.label}>
      <StyledButton key={i}>
        <button.icon color={white} />
      </StyledButton>
    </Tooltip>
  ));
