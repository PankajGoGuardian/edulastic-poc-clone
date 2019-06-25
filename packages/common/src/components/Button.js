import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { themeColor, white, textColor, grey, green, greenDark, black } from "@edulastic/colors";

const getRadius = variant => {
  switch (variant) {
    case "fab":
      return "50%";
    case "extendedFab":
      return "20px";
    case "create":
      return "4px";
    default:
      return "10px";
  }
};

const getShadow = shadow => {
  switch (shadow) {
    case "default":
      return "0 2px 5px 0 rgba(0, 0, 0, 0.07)";
    case "primary":
      return "0 2px 4px 0 rgba(201, 201, 126, 0.5)";
    case "none":
    default:
      return "none";
  }
};

const getTextTransparentColor = color => {
  switch (color) {
    case "primary":
      return {
        color: themeColor,
        hoverColor: themeColor
      };
    case "default":
      return {
        color: textColor,
        hoverColor: black
      };
    case "success":
      return {
        color: green,
        hoverColor: greenDark
      };
    default:
      return {
        color: themeColor,
        hoverColor: themeColor
      };
  }
};

const getColors = ({ color, variant, outlined }) => {
  let colors = {};

  switch (color) {
    case "primary":
      colors.backgroundColor = themeColor;
      colors.color = white;
      colors.hoverColor = white;
      colors.backgroundColorHover = themeColor;
      if (outlined) {
        colors.backgroundColor = white;
        colors.color = themeColor;
        colors.hoverColor = white;
        colors.backgroundColorHover = themeColor;
        colors.borderColor = themeColor;
      }
      break;
    case "default":
      colors.backgroundColor = white;
      colors.color = textColor;
      colors.hoverColor = textColor;
      colors.backgroundColorHover = grey;
      break;
    case "success":
      colors.backgroundColor = green;
      colors.color = white;
      colors.hoverColor = white;
      colors.backgroundColorHover = greenDark;
      break;
    case "secondary":
      colors.backgroundColor = white;
      colors.color = themeColor;
      colors.hoverColor = themeColor;
      colors.borderColor = white;
      colors.backgroundColorHover = white;
      break;
    default:
      colors.backgroundColor = white;
      colors.color = textColor;
      colors.hoverColor = textColor;
      colors.backgroundColorHover = grey;
  }

  if (variant === "transparent") {
    colors = getTextTransparentColor(color);
    colors.backgroundColor = "transparent";
    colors.backgroundColorHover = "transparent";
  }

  return colors;
};

const Button = ({
  onClick,
  color,
  icon,
  children,
  uppercase,
  variant,
  outlined,
  style,
  disabled,
  shadow,
  className
}) => (
  <Container
    className={className}
    disabled={disabled}
    onClick={onClick}
    type="button"
    uppercase={uppercase}
    variant={variant}
    shadow={shadow}
    style={style}
    {...getColors({ color, outlined, variant })}
  >
    {icon && children && <Icon>{icon}</Icon>}
    {icon && !children && icon}
    <span>{children}</span>
  </Container>
);

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  color: PropTypes.string, // default, primary, success
  icon: PropTypes.any,
  uppercase: PropTypes.bool,
  variant: PropTypes.string, // fab, extendedFab, transparent
  shadow: PropTypes.string, // none, default, primary
  outlined: PropTypes.bool,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

Button.defaultProps = {
  color: "default",
  icon: null,
  children: null,
  uppercase: true,
  variant: "contained",
  outlined: false,
  shadow: "default",
  style: {},
  disabled: false,
  className: ""
};

export default Button;

const Icon = styled.div`
  display: inline-flex;
  align-items: left;
  font-size: 16px;
`;

const Container = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  min-height: ${({ variant }) => (variant === "create" ? `45px` : "40px")};
  min-width: ${({ variant }) => (variant === "create" ? `194px` : "130px")};
  border-radius: ${({ variant }) => getRadius(variant)};
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.2px;
  border: ${({ borderColor }) => (borderColor ? `1px solid ${borderColor}` : "none")};
  text-transform: ${({ uppercase }) => (uppercase ? "uppercase" : "")};
  color: ${({ color }) => color};
  background: ${({ backgroundColor, disabled }) => (disabled ? grey : backgroundColor)};
  box-shadow: ${({ shadow }) => getShadow(shadow)};

  &:hover {
    background: ${({ backgroundColorHover }) => backgroundColorHover};
    color: ${({ hoverColor }) => hoverColor};
    cursor: pointer;
    border-color: ${props => props.theme.themeButtonBgColor};
  }

  &:focus {
    border-color: ${props => props.theme.themeButtonBgColor};
    outline-color: ${props => props.theme.themeButtonBgColor};
  }
`;
