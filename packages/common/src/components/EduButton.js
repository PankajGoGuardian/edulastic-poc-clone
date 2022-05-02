import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import {
  white,
  themeColor,
  grey,
  black,
  extraDesktopWidthMax,
  smallDesktopWidth,
  themeColorBlue,
  themeColorHoverBlue,
} from '@edulastic/colors'
import { getSanitizedProps } from '@edulastic/common'
import PropTypes from 'prop-types'

const EduButton = ({ children, btnType, isGhost, ...restProps }) => {
  const blacklistedPropsDOMElements = ['features', 'groupList']
  const sanitizedProps = getSanitizedProps(
    restProps,
    blacklistedPropsDOMElements
  )
  return (
    <StyledButton type="primary" {...sanitizedProps}>
      {children}
    </StyledButton>
  )
}

EduButton.propTypes = {
  btnType: PropTypes.string,
  isGhost: PropTypes.bool,
}

EduButton.defaultProps = {
  btnType: 'primary',
  isGhost: false,
}

export default EduButton

const getStyle = ({
  height,
  width,
  justifyContent,
  fontSize,
  IconBtn,
  ml,
  mr,
  noBorder,
  style = {},
}) => {
  const defaultStyle = {
    display: 'flex',
    'align-items': 'center',
    'justify-content': justifyContent || 'space-evenly',
    fontSize: fontSize || '11px',
    fontWeight: '600',
    marginLeft: ml || '5px',
    marginRight: mr || null,
    borderRadius: '4px',
    height: height || '36px',
    padding: IconBtn ? '5px' : '5px 15px',
    textTransform: 'uppercase',
    width: width || (IconBtn ? '45px' : null),
    textShadow: 'none',
    border: noBorder && '0px',
  }
  return { ...defaultStyle, ...style }
}

const getBgColor = ({ btnType, isGhost, isBlue }) => {
  let bgColor
  if (btnType == 'primary') {
    bgColor =
      isBlue && isGhost
        ? white
        : isBlue
        ? themeColorBlue
        : isGhost
        ? white
        : themeColor
  } else if (btnType == 'secondary') {
    bgColor = isGhost ? white : grey
  }
  return bgColor
}

const getColor = ({ btnType, isGhost, isBlue }) => {
  let color
  if (btnType == 'primary') {
    color =
      isBlue && isGhost
        ? themeColorBlue
        : isBlue
        ? white
        : isGhost
        ? themeColor
        : white
  } else if (btnType == 'secondary') {
    color = black
  }
  return color
}

const getBorderColor = ({ btnType, isBlue }) => {
  if (btnType == 'primary') {
    return isBlue ? themeColorBlue : themeColor
  }
  if (btnType == 'secondary') {
    return grey
  }
}

const StyledButton = styled(Button)`
  ${getStyle};

  &.ant-btn.ant-btn-primary {
    background-color: ${getBgColor};
    border-color: ${getBorderColor};
    color: ${getColor};
    &.focus-visible,
    &:focus {
      outline: 0;
      box-shadow: 0 0 0 1px ${themeColorBlue} !important;
    }
  }

  &.ant-btn[disabled] {
    opacity: 0.3;
  }

  svg {
    fill: ${getColor};
    margin-left: 5px;
    margin-right: 5px;
    &:focus,
    &:hover {
      fill: ${getColor};
    }
    stroke: ${(props) => props.svgStrokeColor || ''};
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

  &:hover {
    &.ant-btn.ant-btn-primary {
      background-color: ${({ noHover }) =>
        noHover ? getBgColor({ isGhost: noHover }) : themeColorHoverBlue};
      border-color: ${({ noHover }) =>
        noHover ? getBgColor({ isGhost: noHover }) : themeColorHoverBlue};
      color: ${({ btnType, noHover }) =>
        getColor({ btnType, isGhost: noHover || false })};
    }

    svg {
      fill: ${({ btnType, noHover }) =>
        getColor({ btnType, isGhost: noHover || false })} !important;
      &:focus,
      &:hover {
        fill: ${({ btnType, noHover }) =>
          getColor({ btnType, isGhost: noHover || false })};
      }
    }
  }

  &:focus,
  &:active {
    &.ant-btn.ant-btn-primary {
      background-color: ${({ isGhost, isBlue }) =>
        isGhost ? white : isBlue ? themeColorBlue : themeColor};
      border-color: ${({ isBlue }) => (isBlue ? themeColorBlue : themeColor)};
      color: ${({ isBlue, isGhost }) =>
        isGhost && isBlue ? themeColorBlue : isGhost ? themeColor : white};
    }

    svg {
      fill: ${({ isBlue, isGhost }) =>
        isGhost && isBlue
          ? themeColorBlue
          : isGhost
          ? themeColor
          : white} !important;
      &:focus,
      &:hover {
        fill: ${({ btnType, noHover }) =>
          getColor({ btnType, isGhost: noHover || false })};
      }
    }
  }

  &.ant-btn a {
    display: flex;
    align-items: center;
  }

  @media (min-width: ${extraDesktopWidthMax}) {
    &.ant-btn {
      margin-left: ${(props) => props.ml || '5px'};
      margin-right: ${(props) => props.mr || '0px'};
      height: ${(props) => props.height || '36px'};
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    height: ${(props) => props.height || '30px'};
    width: ${({ width, IconBtn }) => width || (IconBtn ? '30px' : null)};
  }
`
