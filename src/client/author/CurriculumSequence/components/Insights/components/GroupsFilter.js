import React from "react";
import { connect } from "react-redux";
import { Row, Col, Tooltip } from "antd";
import styled from "styled-components";
import { getUserRole } from "../../../../src/selectors/user";

import { greyThemeDark1, fadedGrey, themeColor } from "@edulastic/colors";
import { IconFolderAll, IconFolderDeactive, IconFolderNew } from "@edulastic/icons";

const GroupContainer = ({ id, name, Icon, onClickAction, isActive }) => (
  <StyledCol key={`group_filter_${id}`} span={24} padding="9px 18px" onClick={onClickAction} isActive={isActive}>
    <Icon />
    <StyledSpan fontStyle="11px/15px" padding="0 0 0 20px">
      <Tooltip placement="right" title={name}>
        {name}
      </Tooltip>
    </StyledSpan>
  </StyledCol>
);

const GroupsFilter = ({ current, options, onClickAction, userRole }) => {
  return (
    <StyledRow type="flex" justify="center">
      <Col span={24}>
        <StyledSpan fontStyle="12px/17px" weight="Bold">
          Groups
        </StyledSpan>
      </Col>
      {!["district-admin", "school-admin"].find(x => x === userRole) && (
        <GroupContainer
          Icon={props => <IconFolderAll {...props} />}
          name="All Students"
          onClickAction={() => onClickAction([])}
        />
      )}
      {options.map(item => (
        <GroupContainer
          {...item}
          Icon={props => <IconFolderDeactive {...props} />}
          isActive={current[0] && current[0].id === item.id}
          onClickAction={() => onClickAction([item])}
        />
      ))}
    </StyledRow>
  );
};

const enhance = connect(state => ({
  userRole: getUserRole(state)
}));

export default enhance(GroupsFilter);

const StyledRow = styled(Row)`
  width: 100%;
`;

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
