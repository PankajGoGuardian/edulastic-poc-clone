import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";
import { Tooltip } from "../../../../common/utils/helpers";
import { test, questionType } from "@edulastic/constants";
import { IconCalculator, IconClose, IconScratchPad } from "@edulastic/icons";
import { extraDesktopWidthMax, white } from "@edulastic/colors";
import { Container } from "./styled";
import { themes } from "../../../../theme";
import TimedTestTimer from "../../common/TimedTestTimer";

const {
  playerSkin: { parcc }
} = themes;
const { tools } = parcc;

const { calculatorTypes } = test;
const ToolBar = ({
  settings = {},
  tool = [],
  changeCaculateMode,
  changeTool,
  qType,
  isDocbased = false,
  timedAssignment,
  utaId,
  groupId
}) => {
  const toolbarHandler = value => changeTool(value);

  const handleCalculateMode = value => {
    changeTool(2);
    changeCaculateMode(value);
  };

  const { calcType } = settings;
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE;

  return (
    <Container>
      {calcType !== calculatorTypes.NONE && (
        <Tooltip placement="top" title="Calculator">
          <StyledButton active={tool.indexOf(2) !== -1} onClick={() => toolbarHandler(2)}>
            <CaculatorIcon />
          </StyledButton>
        </Tooltip>
      )}

      {!isDocbased && (
        <Tooltip
          placement="top"
          title={isDisableCrossBtn ? "This option is available only for multiple choice" : "Crossout"}
        >
          <StyledButton active={tool.indexOf(3) !== -1} disabled={isDisableCrossBtn} onClick={() => toolbarHandler(3)}>
            <CloseIcon />
          </StyledButton>
        </Tooltip>
      )}

      {!isDocbased && (
        <Tooltip placement="top" title="Scratch Pad">
          <StyledButton active={tool.indexOf(5) !== -1} onClick={() => toolbarHandler(5)}>
            <ScratchPadIcon />
          </StyledButton>
        </Tooltip>
      )}
      {timedAssignment && (
        <TimedTestTimer utaId={utaId} groupId={groupId} fgColor={tools.svgColor} bgColor={tools.color} />
      )}
    </Container>
  );
};

ToolBar.propTypes = {
  changeCaculateMode: PropTypes.func.isRequired,
  tool: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  qType: PropTypes.string.isRequired
};

export default ToolBar;

export const StyledButton = styled(Button)`
  border: none;
  margin-right: 3px;
  border-radius: 5px;
  height: 40px;
  width: 40px;
  ${props => props.hidden && "display:none"};
  background: ${({ active }) => (active ? tools.active.background : tools.color)}!important;

  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    fill: ${({ active }) => (active ? tools.active.svgColor : tools.svgColor)};
  }
  &:hover {
    background: ${tools.active.background}!important;
    svg {
      fill: ${white};
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-right: 5px;
  }
`;

export const CaculatorIcon = styled(IconCalculator)`
  ${({ theme }) => `
    width: ${theme.default.headerCaculatorIconWidth};
    height: ${theme.default.headerCaculatorIconHeight};
  `}
`;

const CloseIcon = styled(IconClose)`
  ${({ theme }) => `
    width: ${theme.default.headerCloseIconWidth};
    height: ${theme.default.headerCloseIconHeight};
  `}
`;

const ScratchPadIcon = styled(IconScratchPad)`
  ${({ theme }) => `
    width: ${theme.default.headerScratchPadIconWidth};
    height: ${theme.default.headerScratchPadIconHeight};
  `}
`;
