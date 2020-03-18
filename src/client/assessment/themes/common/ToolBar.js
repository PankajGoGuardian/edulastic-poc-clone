import React, { Component } from "react";
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
  IconSearch
} from "@edulastic/icons";
import { extraDesktopWidthMax, mediumDesktopExactWidth } from "@edulastic/colors";
import { Tooltip } from "../../../common/utils/helpers";

const { calculatorTypes } = test;
class ToolBar extends Component {
  toolbarHandler = value => {
    const { changeTool } = this.props;
    changeTool(value);
  };

  handleCalculateMode = value => {
    const { changeTool } = this.props;
    changeTool(2);

    const { changeCaculateMode } = this.props;
    changeCaculateMode(value);
  };

  render() {
    const { settings, tool, qType, handleMagnifier, enableMagnifier, showMagnifier } = this.props;
    const { calcType } = settings;
    const isDisableCrossBtn = qType !== questionType.MULTIPLE_CHOICE;

    return (
      <Container>
        <Tooltip placement="top" title="Pointer">
          {/* hidden prop in StyledButton can hide the button enable it
           whenever required by removing them. */}
          <StyledButton
            active={tool.indexOf(0) !== -1}
            onClick={() => this.toolbarHandler(0)}
            hidden
          >
            <CursorIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Ruler">
          <StyledButton active={tool === 1} onClick={() => this.toolbarHandler(1)} hidden>
            <InRulerIcon />
          </StyledButton>
        </Tooltip>
        {calcType !== calculatorTypes.NONE && (
          <Tooltip placement="top" title="Calculator">
            <StyledButton active={tool.indexOf(2) !== -1} onClick={() => this.toolbarHandler(2)}>
              <CaculatorIcon />
            </StyledButton>
          </Tooltip>
        )}

        <Tooltip
          placement="top"
          title={
            isDisableCrossBtn ? "This option is available only for multiple choice" : "Crossout"
          }
        >
          <StyledButton
            active={tool.indexOf(3) !== -1}
            disabled={isDisableCrossBtn}
            onClick={() => this.toolbarHandler(3)}
          >
            <CloseIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Protactor">
          <StyledButton
            active={tool.indexOf(4) !== -1}
            onClick={() => this.toolbarHandler(4)}
            hidden
          >
            <ProtactorIcon />
          </StyledButton>
        </Tooltip>

        <Tooltip placement="top" title="Scratch Pad">
          <StyledButton active={tool.indexOf(5) !== -1} onClick={() => this.toolbarHandler(5)}>
            <ScratchPadIcon />
          </StyledButton>
        </Tooltip>
        {showMagnifier && <Tooltip placement="top" title="Magnify">
          <StyledButton active={enableMagnifier} onClick={handleMagnifier}>
            <IconSearch/>
          </StyledButton>
        </Tooltip>}
      </Container>
    );
  }
}

ToolBar.propTypes = {
  changeCaculateMode: PropTypes.func.isRequired,
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

export const StyledButton = styled(Button)`
  border: 1px solid #FFFFFF;
  margin-right: 3px;
  border-radius: 5px;
  ${props => props.hidden && "display:none"}
  ${({ theme, active }) => `
    background: ${
      active ? theme.default.headerButtonBgHoverColor : theme.default.headerButtonBgColor
    };
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
      background: ${
        active ? theme.default.headerButtonBgHoverColor : theme.default.headerButtonBgColor
      };
      svg{
        fill: ${active ? theme.header.headerButtonHoverColor : theme.header.headerButtonColor};
      }
    }
`
    : `
&:focus{
      background: ${
        active ? theme.default.headerButtonBgHoverColor : theme.default.headerButtonBgColor
      };
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
