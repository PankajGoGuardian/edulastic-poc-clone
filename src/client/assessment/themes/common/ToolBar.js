import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button } from "antd";
import { test, questionType } from "@edulastic/constants";
import {
  IconCursor,
  IconInRuler,
  IconCalculator,
  IconClose,
  IconProtactor,
  IconScratchPad,
  IconMagnify
} from "@edulastic/icons";
import { extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";
import { Tooltip } from "../../../common/utils/helpers";
import TimedTestTimer from "./TimedTestTimer";

const { calculatorTypes } = test;

const ActionButton = ({ title, icon, ...rest }) => (
  <Tooltip placement="top" title={title}>
    <ButtonWithStyle {...rest}>{icon}</ButtonWithStyle>
  </Tooltip>
);

const ToolBar = ({
  settings,
  tool,
  qType,
  handleMagnifier,
  enableMagnifier,
  timedAssignment,
  utaId,
  groupId,
  changeTool
}) => {
  const { calcType, showMagnifier, enableScratchpad } = settings;
  const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE;

  const toolbarHandler = value => () => {
    changeTool(value);
  };

  return (
    <Container>
      <ActionButton
        title="Pointer"
        icon={<CursorIcon />}
        active={tool.includes(0)}
        onClick={toolbarHandler(0)}
        hidden
      />

      <ActionButton title="Ruler" icon={<InRulerIcon />} active={tool.includes(1)} onClick={toolbarHandler(1)} hidden />

      {calcType !== calculatorTypes.NONE && (
        <ActionButton
          title="Calculator"
          icon={<CaculatorIcon />}
          active={tool.includes(2)}
          onClick={toolbarHandler(2)}
        />
      )}

      <ActionButton
        title={isDisableCrossBtn ? "This option is available only for multiple choice" : "Crossout"}
        icon={<CloseIcon />}
        active={tool.includes(3)}
        onClick={toolbarHandler(3)}
        disabled={isDisableCrossBtn}
      />

      <ActionButton
        title="Protactor"
        icon={<ProtactorIcon />}
        active={tool.includes(4)}
        onClick={toolbarHandler(4)}
        hidden
      />

      {enableScratchpad && (
        <ActionButton
          title="Scratch Pad"
          icon={<ScratchPadIcon />}
          active={tool.includes(5)}
          onClick={toolbarHandler(5)}
        />
      )}

      {showMagnifier && (
        <ActionButton title="Magnify" icon={<IconMagnify />} active={enableMagnifier} onClick={handleMagnifier} />
      )}

      {timedAssignment && <TimedTestTimer utaId={utaId} groupId={groupId} />}
    </Container>
  );
};

ToolBar.propTypes = {
  tool: PropTypes.array.isRequired,
  changeTool: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  qType: PropTypes.string.isRequired
};

export default ToolBar;

export const Container = styled.div`
  margin-left: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  span {
    line-height: 11px;
  }
`;

export const ButtonWithStyle = styled(Button)`
  border: 1px solid #FFFFFF;
  margin-right: 3px;
  border-radius: 5px;
  ${props => props.hidden && "display:none"}
  ${({ theme, active }) => `
    background: ${active ? theme.default.headerButtonBgHoverColor : theme.default.headerButtonBgColor};
    height: ${theme.default.headerToolbarButtonWidth};
    width: ${theme.default.headerToolbarButtonHeight};

    svg {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      fill: ${active ? theme.header.headerButtonHoverColor : theme.header.headerButtonColor};
    }

    :disabled {
      opacity: 0.4;
      background: ${theme.default.headerButtonBgColor};
    }
  `}

${({ theme, active }) =>
  window.isIOS
    ? `
      &:focus, &:hover{
            background: ${active ? theme.default.headerButtonBgHoverColor : theme.default.headerButtonBgColor};
            svg{
              fill: ${active ? theme.header.headerButtonHoverColor : theme.header.headerButtonColor};
            }
          }
      `
    : `
      &:focus{
      background: ${active ? theme.default.headerButtonBgHoverColor : theme.default.headerButtonBgColor};
      svg{
        fill: ${active ? theme.header.headerButtonHoverColor : theme.header.headerButtonColor};
      }
    }
    &:hover,
    &:active {
      background: ${theme.default.headerButtonBgHoverColor};

      svg {
        fill: ${theme.header.headerButtonHoverColor};
      }
    }

`}

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
    width: 40px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    margin-right: 10px;
  }
`;

const CursorIcon = styled(IconCursor)`
  ${({ theme }) => `
    width: ${theme.default.headerCursorIconWidth};
    height: ${theme.default.headerCursorIconHeight};
  `}
`;

const InRulerIcon = styled(IconInRuler)`
  ${({ theme }) => `
    width: ${theme.default.headerInRulerIconWidth};
    height: ${theme.default.headerInRulerIconHeight};
  `}
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

const ProtactorIcon = styled(IconProtactor)`
  ${({ theme }) => `
    width: ${theme.default.headerProtactorIconWidth};
    height: ${theme.default.headerProtactorIconHeight};
  `}
`;

const ScratchPadIcon = styled(IconScratchPad)`
  ${({ theme }) => `
    width: ${theme.default.headerScratchPadIconWidth};
    height: ${theme.default.headerScratchPadIconHeight};
  `}
`;
