import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { darkBlue, lightBlue, greenDark, lightGreen, white, grey } from "@edulastic/colors";
import { Dropdown } from "antd";

const Tags = ({ tags = [], labelStyle, type, show, isStandards }) => {
  if (!tags.length) return null;

  const visibleTags = tags.slice(0, show);
  const hiddenTags = tags.slice(show);

  const popup = (
    <PopupContainer>
      {hiddenTags.map((tag, i) => (
        <Label style={labelStyle} key={i} type={type}>
          {isStandards ? tag : tag.tagName}
        </Label>
      ))}
    </PopupContainer>
  );

  return (
    <Labels>
      {visibleTags.map((tag, i) => (
        <Label style={labelStyle} key={i} type={type}>
          {isStandards ? tag : tag.tagName}
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

const Label = styled.span`
  position: relative;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 4px 10px;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 3px;
  margin-bottom: ${({ marginBottom }) => marginBottom || "3px"};
  font-weight: 700;
  ${props => getLabelStyle(props.type)};
`;
