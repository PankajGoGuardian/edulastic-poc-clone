import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { themeColor, textColor, green, greenDark, darkGrey, desktopWidth } from "@edulastic/colors";

const getColors = ({ color, active }) => {
  const colors = {};

  switch (color) {
    case "primary":
      colors.color = themeColor;
      colors.hoverColor = themeColor;
      if (active) colors.color = themeColor;
      break;
    case "default":
      colors.color = textColor;
      colors.hoverColor = darkGrey;
      if (active) colors.color = darkGrey;
      break;
    case "success":
      colors.color = green;
      colors.hoverColor = greenDark;
      if (active) colors.color = greenDark;
      break;
    default:
      colors.color = textColor;
      colors.hoverColor = darkGrey;
      if (active) colors.color = darkGrey;
  }

  return colors;
};

const ButtonLink = ({ onClick, color, icon, children, uppercase, style, active }) => (
  <Container onClick={onClick} type="button" uppercase={uppercase} style={style} {...getColors({ color, active })}>
    {icon && children && <Icon>{icon}</Icon>}
    {icon && !children && icon}
    {children && <Text>{children}</Text>}
  </Container>
);

ButtonLink.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.string,
  color: PropTypes.string, // default, primary, success
  icon: PropTypes.any,
  uppercase: PropTypes.bool,
  style: PropTypes.object,
  active: PropTypes.bool
};

ButtonLink.defaultProps = {
  onClick: () => {},
  color: "default",
  icon: null,
  children: null,
  uppercase: true,
  style: {},
  active: false
};

export default ButtonLink;

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  font-size: 10px;

  @media (max-width: ${desktopWidth}) {
    margin-right: 10px;
  }
`;

const Container = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.2px;
  border: none;
  padding: 10px;
  text-transform: ${({ uppercase }) => (uppercase ? "uppercase" : "")};
  color: ${({ color }) => color};
  background: transparent;

  :hover {
    color: ${({ hoverColor }) => hoverColor};
    cursor: pointer;
  }
`;

const Text = styled.span`
  display: inline-block;
  padding-top: 1px;
`;
