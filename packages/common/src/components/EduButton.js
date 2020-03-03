import React from "react";
import { Button } from "antd";
import styled from "styled-components";
import { white, themeColor, grey, black } from "@edulastic/colors";
import PropTypes from "prop-types";

const EduButton = ({ children, ...restProps }) => {
  return <StyledButton {...restProps}>{children}</StyledButton>;
};

EduButton.propTypes = {
  btnType: PropTypes.string,
  ghost: PropTypes.bool
};

EduButton.defaultProps = {
  btnType: "primary",
  isGhost: false
};

export default EduButton;

const getStyle = ({ height, width, fontSize, style = {} }) => {
  const defaultStyle = {
    display: "flex",
    "align-items": "center",
    "justify-content": "space-evenly",
    fontSize: fontSize ? fontSize : "11px",
    fontWeight: "600",
    marginLeft: "10px",
    borderRadius: "4px",
    height: height ? height : "45px",
    padding: "5px 15px",
    width: width ? width : null
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
  } else if (btnType == "secondary") {
    return grey;
  }
};

const StyledButton = styled(props => <Button type="primary" {...props} />)`
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
    stroke: ${getBorderColor};
  }

  span {
    margin-left: 5px;
    margin-right: 5px;
  }

  i {
    margin-left: 5px;
    margin-right: 5px;
    font-size: 22px;
  }

  &:focus,
  &:hover {
    &.ant-btn.ant-btn-primary {
      background-color: ${({ btnType }) => getBgColor({ btnType, isGhost: false })};
      border-color: ${({ btnType }) => getBorderColor({ btnType, isGhost: false })};
      color: ${({ btnType }) => getColor({ btnType, isGhost: false })};
    }

    svg {
      fill: ${({ btnType }) => getColor({ btnType, isGhost: false })};
      &:focus,
      &:hover {
        fill: ${({ btnType }) => getColor({ btnType, isGhost: false })};
      }
    }

    i {
      font-size: 22px;
    }
  }
`;
