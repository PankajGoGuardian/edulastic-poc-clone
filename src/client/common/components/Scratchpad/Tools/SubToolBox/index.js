import React from "react";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import SubOptions from "./SubOptions";
import { SubToolBoxContainer } from "../styled";
import { options } from "../constants/controls";

const SubToolBox = ({ activeMode, ...rest }) => {
  // first time activeMode will be empty string
  // in this case will use select tool's option.
  const properties = options[activeMode] || options.selectTool;
  const { label, desc } = properties;

  return (
    <SubToolBoxContainer id="tool-properties" alignItems="center">
      <FlexContainer flex={1} alignItems="flex-start" flexDirection="column">
        <ToolTitle>
          <span>{label}</span> Tool
        </ToolTitle>
        <ToolDescription>{desc}</ToolDescription>
      </FlexContainer>
      <SubOptions activeMode={activeMode} {...rest} />
    </SubToolBoxContainer>
  );
};

export default SubToolBox;

const ToolTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #06a1c6;
  text-transform: uppercase;
  cursor: default;

  span {
    color: #333;
  }
`;

const ToolDescription = styled.span`
  white-space: nowrap;
  color: #666666;
`;
