import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { darkBlue, lightBlue, greenDark, lightGreen, white, grey } from "@edulastic/colors";
import { Dropdown, Tag } from "antd";

const Tags = ({ tags = [], labelStyle, type, show, isStandards, isPlaylist = false, completed = false }) => {
  if (!tags.length) return null;

  const visibleTags = tags.slice(0, show);
  const hiddenTags = tags.slice(show);

  const popup = (
    <PopupContainer>
      {hiddenTags.map((tag, i) => (
        <Label popupContainer style={labelStyle} key={i} type={type}>
          {isStandards || typeof tag === "string" ? tag : tag.tagName}
        </Label>
      ))}
    </PopupContainer>
  );

  return (
    <Labels completed={completed} isPlaylist={isPlaylist}>
      {visibleTags.map((tag, i) => (
        <Label style={labelStyle} key={i} type={type}>
          {isStandards || typeof tag === "string" ? tag : tag.tagName}
        </Label>
      ))}
      {hiddenTags && !!hiddenTags.length && (
        <Dropdown overlay={popup}>
          <Label style={labelStyle} type={type}>
            <span>{hiddenTags.length} +</span>
          </Label>
        </Dropdown>
      )}
    </Labels>
  );
};

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  labelStyle: PropTypes.object,
  type: PropTypes.string,
  show: PropTypes.number
};

Tags.defaultProps = {
  labelStyle: {},
  type: "primary", // primary, secondary
  show: 2
};

export default Tags;

const getLabelStyle = type => {
  switch (type) {
    case "secondary":
      return `
        color: ${greenDark};
        background: ${lightGreen};
      `;
    case "primary":
      return `
      color: #4aac8b;
      background: #d7faee;
    `;
    default:
      return `
      color: ${darkBlue};
      background: ${lightBlue};
    `;
  }
};

const Labels = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: ${({ isPlaylist }) => isPlaylist && "flex-start"};
  justify-content: ${({ isPlaylist }) => isPlaylist && "flex-start"};
  width: ${({ isPlaylist }) => isPlaylist && "100%"};
  margin: 4px 0 4px ${({ completed, isPlaylist }) => (isPlaylist ? (completed ? "8px" : "56px") : 0)};
`;

const PopupContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: ${white};
  padding: 10px;
  border: 1px solid ${grey};
  border-radius: 5px;
  max-width: 350px;
  max-height: 200px;
  overflow: auto;
`;

const Label = styled(Tag)`
  position: relative;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 700;
  ${props => getLabelStyle(props.type)};
  border: none;
  margin: 0 3px ${({ popupContainer }) => (popupContainer ? "6px" : 0)} 0;
`;
