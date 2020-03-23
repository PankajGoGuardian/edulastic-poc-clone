import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { IconClose, IconCalculator, IconSearch } from "@edulastic/icons";
import { Button } from "antd";
import { Tooltip } from "../../../common/utils/helpers";

const Tools = ({ changeTool, currentTool, calculateMode, handleMagnifier, enableMagnifier }) => (
  <ToolBox>
    {calculateMode && (
      <Tooltip title="Calculator">
        <ToolButton active={currentTool === 1} onClick={() => changeTool(currentTool === 1 ? 0 : 1)}>
          <CaculatorIcon />
        </ToolButton>
      </Tooltip>
    )}
    <Tooltip>
      <ToolButton active={currentTool === 2} disabled onClick={() => changeTool(2)}>
        <CloseIcon />
      </ToolButton>
    </Tooltip>
    <Tooltip>
      <ToolButton active={enableMagnifier} onClick={handleMagnifier} id="magnifier-icon">
        <IconSearch />
      </ToolButton>
    </Tooltip>
  </ToolBox>
);

export default Tools;

Tools.propTypes = {
  changeTool: PropTypes.func.isRequired,
  currentTool: PropTypes.number.isRequired,
  calculateMode: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired
};

const ToolBox = styled.div`
  margin: 0px auto;
`;

const CaculatorIcon = styled(IconCalculator)`
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

const ToolButton = styled(Button)`
  border: 1px solid #ffffff;
  margin-right: 10px;
  border-radius: 5px;

  & :hover {
    background: ${({ theme }) => theme.default.headerButtonBgHoverColor};
    & svg {
      fill: ${({ theme }) => theme.header.headerButtonHoverColor};
    }
  }

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
`;
