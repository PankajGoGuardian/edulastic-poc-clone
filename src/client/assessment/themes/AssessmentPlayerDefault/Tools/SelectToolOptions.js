import React from "react";
import { IconExpandArrowIn, IconExpandArrowOut, IconCut, IconInverse, IconInverseOut } from "@edulastic/icons";
import { white } from "@edulastic/colors";
import { drawTools } from "@edulastic/constants";
import { Tooltip } from "../../../../common/utils/helpers";
import { customizeIcon, StyledButton } from "./styled";

const ExpandArrowInIcon = customizeIcon(IconExpandArrowIn);
const ExpandArrowOutIcon = customizeIcon(IconExpandArrowOut);
const CutIcon = customizeIcon(IconCut);
const InverseIcon = customizeIcon(IconInverse);
const InverseOutIcon = customizeIcon(IconInverseOut);

const optionsList = [
  { mode: drawTools.COPY, icon: ExpandArrowInIcon, label: "Copy" },
  { mode: drawTools.PASTE, icon: ExpandArrowOutIcon, label: "Paste" },
  { mode: drawTools.CUT, icon: CutIcon, label: "Cut" },
  { mode: drawTools.MOVE_BEHIND, icon: InverseIcon, label: "Move behind" },
  { mode: drawTools.MOVE_FORWARD, icon: InverseOutIcon, label: "Move forward" }
];

export default ({ onChangeEditTool }) =>
  optionsList.map((button, i) => (
    <Tooltip placement="right" title={button.label} key={i}>
      <StyledButton onClick={() => onChangeEditTool(button.mode)}>
        <button.icon color={white} />
      </StyledButton>
    </Tooltip>
  ));
