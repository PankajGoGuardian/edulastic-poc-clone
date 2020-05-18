import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  darkBlue,
  lightBlue,
  greenDark,
  lightGreen,
  white,
  grey,
  lightGreen6,
  extraDesktopWidthMax
} from "@edulastic/colors";
import { Dropdown, Tag } from "antd";

const Tags = ({
  tags = [],
  labelStyle,
  type,
  show,
  isStandards,
  isPlaylist = false,
  completed = false,
  margin,
  showTitle = false,
  isGrayTags,
  isCustomTags,
  flexWrap
}) => {
  if (!tags.length) return null;

  const visibleTags = tags.slice(0, show);
  const hiddenTags = tags.slice(show);
  const className = isGrayTags ? "gray-tags" : isCustomTags ? "custom-tags" : "";

  const popup = (
    <PopupContainer>
      {hiddenTags.map((tag, i) => (
        <Label className={className} popupContainer style={labelStyle} key={i} type={type}>
          {isStandards || typeof tag === "string" ? tag : tag.tagName}
        </Label>
      ))}
    </PopupContainer>
  );

  return (
    <Labels completed={completed} isPlaylist={isPlaylist} margin={margin} flexWrap={flexWrap}>
      {visibleTags.map((tag, i) => (
        <Label
          className={className}
          style={labelStyle}
          key={i}
          type={type}
          {...(showTitle ? { title: tag?.tagName || tag } : {})}
        >
          {isStandards || typeof tag === "string" ? tag : tag.tagName}
        </Label>
      ))}
      {hiddenTags && !!hiddenTags.length && (
        <Dropdown getPopupContainer={triggerNode => triggerNode.parentNode} overlay={popup}>
          <Label className={className} style={labelStyle} type={type}>
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
      color: ${greenDark};
      background: ${lightGreen6};
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
  flex-wrap: ${({ flexWrap }) => flexWrap || "wrap"};
  align-items: ${({ isPlaylist }) => isPlaylist && "flex-start"};
  justify-content: ${({ isPlaylist }) => isPlaylist && "flex-start"};
  width: ${({ isPlaylist }) => isPlaylist && "auto"};
  margin: ${({ margin, completed, isPlaylist }) =>
    margin || `4px 0px 4px ${isPlaylist ? (completed ? "8px" : "56px") : 0}`};
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
  line-height: 16px;
  margin: 0 3px ${({ popupContainer }) => (popupContainer ? "6px" : "3px")} 0;
  height: 24px;

  &.gray-tags {
    padding: 4px 15px;
    display: inline-block;
    background: #b3bcc4;
    color: #676e74;
    font-size: 10px;
    &:hover {
      opacity: 1;
    }
  }

  &.custom-tags {
    font-size: 10px;
    max-width: 40%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 8px;
    height: 20px;
    padding: 2px 10px;
  }
`;
