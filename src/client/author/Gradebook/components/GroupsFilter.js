import React from "react";
import styled from "styled-components";

// components
import { Row, Col, Tooltip } from "antd";
import { IconFolderAll, IconFolderDeactive, IconFolderNew } from "@edulastic/icons";

// constants
import { greyThemeDark1, fadedGrey, themeColor } from "@edulastic/colors";

const GroupContainer = ({ name, Icon, onClick, isActive }) => (
  <StyledCol span={24} padding="9px 18px" onClick={onClick} isActive={isActive}>
    <Icon />
    <StyledSpan fontStyle="11px/15px" padding="0 0 0 20px">
      <Tooltip placement="right" title={name}>
        {name}
      </Tooltip>
    </StyledSpan>
  </StyledCol>
);

const GroupsFilter = ({ current, options, onClick }) => {
  return (
    <Row type="flex" justify="center" style={{ width: "100%" }}>
      <Col span={24} style={{ display: "flex", alignItems: "center" }}>
        <StyledSpan fontStyle="12px/17px" weight="Bold">
          Student Groups
        </StyledSpan>
        <IconFolderNew style={{ marginLeft: "15px", height: "25px", width: "25px" }} onClick={() => {}} />
      </Col>
      <GroupContainer Icon={props => <IconFolderAll {...props} />} name="All Students" onClick={() => onClick([])} />
      {options.map(item => (
        <GroupContainer
          {...item}
          Icon={props => <IconFolderDeactive {...props} />}
          isActive={current[0] && current[0].id === item.id}
          onClick={() => onClick([item])}
        />
      ))}
    </Row>
  );
};

export default GroupsFilter;

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: ${props => props.padding};
  svg {
    path {
      fill: ${props => props.isActive && themeColor};
    }
  }
  &:hover,
  &:focus {
    background: ${fadedGrey};
  }
`;

const StyledSpan = styled.span`
  font: ${props => props.fontStyle} Open Sans;
  font-weight: ${props => props.weight || 600};
  padding: ${props => props.padding};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  max-width: 80%;
  text-transform: uppercase;
  color: ${greyThemeDark1};
`;
