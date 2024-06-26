import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  themeColorLight,
  themeColor,
  inputBgGrey,
  linkColor1,
  greyThemeLighter,
  greyThemeLight
} from "@edulastic/colors";

class TextField extends Component {
  state = {
    referenceEditable: false
  };

  onIconClick = () => {
    const { referenceEditable } = this.state;
    this.setState({ referenceEditable: !referenceEditable });
  };

  render() {
    const {
      icon,
      height,
      width,
      style,
      containerStyle,
      onChange,
      onBlur,
      type,
      minimum,
      maximum,
      ...restProps
    } = this.props;
    const { referenceEditable } = this.state;
    return (
      <Container height={height} width={width} style={containerStyle}>
        <Field
          disabled={!referenceEditable}
          type={!type ? "text" : type}
          style={style}
          min={!minimum ? null : minimum}
          max={!maximum ? null : maximum}
          referenceEditable={referenceEditable}
          {...restProps}
          onChange={onChange}
          onBlur={e => {
            this.onIconClick();
            onBlur(e);
          }}
        />
        {icon && <Icon onClick={this.onIconClick}>{icon}</Icon>}
      </Container>
    );
  }
}

TextField.propTypes = {
  icon: PropTypes.any,
  height: PropTypes.string,
  width: PropTypes.string,
  style: PropTypes.object,
  containerStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func
};

TextField.defaultProps = {
  icon: null,
  height: "45px",
  width: "100%",
  style: {},
  containerStyle: {},
  onBlur: () => {}
};

export default TextField;

const Container = styled.span`
  position: relative;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

const Icon = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  top: 2px;
  right: 13px;

  svg {
    fill: ${themeColor};
    width: 17px;
    height: 17px;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Field = styled.input`
  border: 1px solid ${greyThemeLight};
  background: ${greyThemeLighter};
  border-radius: 4px;
  min-height: 100%;
  width: 100%;
  padding: 10px 35px;
  color: ${linkColor1};
  outline: none;
  font-size: 13px;
  letter-spacing: 0.2px;
  text-align: center;
  ::placeholder {
    font-style: italic;
    color: #b1b1b1;
  }
  ${({ style }) => style};
  }}
`;
