import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { white, themeColor, grey, black, mediumDesktopExactWidth } from "@edulastic/colors";
import PropTypes from "prop-types";

const EduButton = ({ children, ...restProps }) => (
  <StyledButton type="primary" {...restProps}>
    {children}
  </StyledButton>
);

EduButton.propTypes = {
  btnType: PropTypes.string,
  isGhost: PropTypes.bool
};

EduButton.defaultProps = {
  btnType: "primary",
  isGhost: false
};

export default EduButton;

const getStyle = ({ height, width, fontSize, IconBtn, style = {} }) => {
  const defaultStyle = {
    display: "flex",
    "align-items": "center",
    "justify-content": "space-evenly",
    fontSize: fontSize || "11px",
    fontWeight: "600",
    marginLeft: "10px",
    borderRadius: "4px",
    height: height || "45px",
    padding: IconBtn ? "5px" : "5px 15px",
    textTransform: "uppercase",
    width: width || (IconBtn ? "45px" : null),
    textShadow: "none"
  };
  return Object.assign({}, defaultStyle, style);
};

const getBgColor = ({ btnType, isGhost }) => {
  let bgColor;
  if (btnType == "primary") {
    bgColor = isGhost ? white : themeColor;
  } else if (btnType == "secondary") {
    bgColor = isGhost ? white : grey;
  }
  return bgColor;
};

const getColor = ({ btnType, isGhost }) => {
  let color;
  if (btnType == "primary") {
    color = isGhost ? themeColor : white;
  } else if (btnType == "secondary") {
    color = black;
  }
  return color;
};

const getBorderColor = ({ btnType }) => {
  if (btnType == "primary") {
    return themeColor;
  }
  if (btnType == "secondary") {
    return grey;
  }
};

const StyledButton = styled(Button)`
  ${getStyle};

  &.ant-btn.ant-btn-primary {
    background-color: ${getBgColor};
    border-color: ${getBorderColor};
    color: ${getColor};
  }

  svg {
    fill: ${getColor};
    margin-left: 5px;
    margin-right: 5px;
    &:focus,
    &:hover {
      fill: ${getColor};
    }
    stroke: ${props => props.svgStrokeColor || ""};
  }

  span {
    margin-left: 5px;
    margin-right: 5px;
  }

  i {
    margin-left: 5px;
    margin-right: 5px;
    font-size: 16px;
  }

  &:focus,
  &:hover {
    &.ant-btn.ant-btn-primary {
      background-color: ${({ btnType, noHover }) => getBgColor({ btnType, isGhost: noHover || false })};
      border-color: ${({ btnType, noHover }) => getBorderColor({ btnType, isGhost: noHover || false })};
      color: ${({ btnType, noHover }) => getColor({ btnType, isGhost: noHover || false })};
    }

    svg {
      fill: ${({ btnType, noHover }) => getColor({ btnType, isGhost: noHover || false })} !important;
      &:focus,
      &:hover {
        fill: ${({ btnType, noHover }) => getColor({ btnType, isGhost: noHover || false })};
      }
    }
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    &.ant-btn {
      margin-left: 5px;
      height: ${props => props.height || "36px"};
    }
  }
`;
