import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  blue, white, darkBlue, textColor, grey, green, greenDark,
} from '../../utilities/css';

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

const Button = ({
  onClick, color, icon, children, uppercase, variant, outlined, style,
}) => {
  const colors = {};
  if (color === 'primary') {
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
  }
  if (color === 'default') {
    colors.backgroundColor = white;
    colors.color = textColor;
    colors.hoverColor = textColor;
    colors.backgroundColorHover = grey;
  }
  if (color === 'success') {
    colors.backgroundColor = green;
    colors.color = white;
    colors.hoverColor = white;
    colors.backgroundColorHover = greenDark;
  }
  return (
    <Container
      onClick={onClick}
      type="button"
      uppercase={uppercase}
      variant={variant}
      style={style}
      {...colors}
    >
      {icon && children && <Icon>{icon}</Icon>}
      {icon && !children && icon}
      {children}
    </Container>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string,
  color: PropTypes.string, // default, primary, success
  icon: PropTypes.any,
  uppercase: PropTypes.bool,
  variant: PropTypes.string, // fab, extendedFab
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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  min-height: 40px;
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

  :hover {
    background: ${({ backgroundColorHover }) => backgroundColorHover};
    color: ${({ hoverColor }) => hoverColor}
    cursor: pointer;
  }
`;
