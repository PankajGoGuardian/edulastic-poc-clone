import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  blue,
  white,
  darkBlue,
  textColor,
  grey,
  green,
  greenDark,
  black,
} from '@edulastic/colors';

const getRadius = (variant) => {
  switch (variant) {
    case 'fab':
      return '50%';
    case 'extendedFab':
      return '20px';
    default:
      return '10px';
  }
};

const getTextTransparentColor = (color) => {
  switch (color) {
    case 'primary':
      return {
        color: blue,
        hoverColor: darkBlue,
      };
    case 'default':
      return {
        color: textColor,
        hoverColor: black,
      };
    case 'success':
      return {
        color: green,
        hoverColor: greenDark,
      };
    default:
      return {
        color: blue,
        hoverColor: darkBlue,
      };
  }
};

const getColors = ({ color, variant, outlined }) => {
  let colors = {};

  switch (color) {
    case 'primary':
      colors.backgroundColor = blue;
      colors.color = white;
      colors.hoverColor = white;
      colors.backgroundColorHover = darkBlue;
      if (outlined) {
        colors.backgroundColor = white;
        colors.color = blue;
        colors.hoverColor = white;
        colors.backgroundColorHover = darkBlue;
        colors.borderColor = darkBlue;
      }
      break;
    case 'default':
      colors.backgroundColor = white;
      colors.color = textColor;
      colors.hoverColor = textColor;
      colors.backgroundColorHover = grey;
      break;
    case 'success':
      colors.backgroundColor = green;
      colors.color = white;
      colors.hoverColor = white;
      colors.backgroundColorHover = greenDark;
      break;
    default:
      colors.backgroundColor = white;
      colors.color = textColor;
      colors.hoverColor = textColor;
      colors.backgroundColorHover = grey;
  }

  if (variant === 'transparent') {
    colors = getTextTransparentColor(color);
    colors.backgroundColor = 'transparent';
    colors.backgroundColorHover = 'transparent';
  }

  return colors;
};

const Button = ({ onClick, color, icon, children, uppercase, variant, outlined, style }) => (
  <Container
    onClick={onClick}
    type="button"
    uppercase={uppercase}
    variant={variant}
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
  children: PropTypes.string,
  color: PropTypes.string, // default, primary, success
  icon: PropTypes.any,
  uppercase: PropTypes.bool,
  variant: PropTypes.string, // fab, extendedFab, transparent
  outlined: PropTypes.bool,
  style: PropTypes.object,
};

Button.defaultProps = {
  color: 'default',
  icon: null,
  children: null,
  uppercase: true,
  variant: 'contained',
  outlined: false,
  style: {},
};

export default Button;

const Icon = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  font-size: 16px;
`;

const Container = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  min-height: 40px;
  min-width: 130px;
  border-radius: ${({ variant }) => getRadius(variant)};
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.2px;
  border: ${({ borderColor }) => (borderColor ? `1px solid ${borderColor}` : 'none')};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : '')};
  color: ${({ color }) => color};
  background: ${({ backgroundColor }) => backgroundColor};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  min-height: 40px;
  cursor: pointer;

  :hover, :hover span {
    background: ${({ backgroundColorHover }) => backgroundColorHover};
    color: ${({ hoverColor }) => hoverColor}
  }

  & i, & svg {
    position: absolute;
    top: 0;
    left: 10px;
    height: 100% !important;
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  &:hover svg {
    fill: #ffffff;
  }
`;
