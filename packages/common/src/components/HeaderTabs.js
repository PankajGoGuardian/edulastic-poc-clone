import {
  largeDesktopWidth,
  mobileWidthMax,
  white,
  desktopWidth,
  mediumDesktopExactWidth,
  smallDesktopWidth
} from "@edulastic/colors";
import { PropTypes } from "prop-types";
import React from "react";
import { withRouter } from "react-router";
import styled from "styled-components";

const HeaderTabs = ({
  id,
  key,
  onClickHandler,
  to,
  disabled,
  dataCy,
  isActive,
  icon,
  linkLabel,
  history,
  ...restProps
}) => {
  const handleOnClick = () => {
    if (to && to !== "#") {
      // we are sending a place to route
      history.push(to);
    } else if (typeof onClickHandler === "function") {
      // call the onClickHandler passed from component
      onClickHandler();
    }
  };

  return (
    <StyledLink id={id} key={key} to={to} onClick={handleOnClick} disabled={disabled} data-cy={dataCy} {...restProps}>
      <StyledAnchor isActive={isActive} hasIcon={!!icon}>
        {icon}
        <LinkLabel hasIcon={!!icon}>{linkLabel}</LinkLabel>
      </StyledAnchor>
    </StyledLink>
  );
};

HeaderTabs.propTypes = {
  id: PropTypes.string.isRequired,
  to: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  dataCy: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  linkLabel: PropTypes.any.isRequired,
  icon: PropTypes.any.isRequired,
  onClickHandler: PropTypes.func
};

HeaderTabs.defaultProps = {
  to: "#",
  onClickHandler: () => {}
};

export default withRouter(HeaderTabs);

export const StyledTabs = styled.div`
  min-width: 300px;
  display: flex;
  align-items: center;
  align-self: flex-end;
  justify-content: center;

  @media (min-width: ${largeDesktopWidth}) {
    min-width: 480px;
    padding-left: 0px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    min-width: 500px;
  }
`;

export const StyledLink = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  ${restProps => restProps.style};
  cursor: pointer;

  @media (max-width: ${mobileWidthMax}) {
    flex-basis: 100%;
  }
`;

export const StyledAnchor = styled.div`
  display: flex;
  font-size: 11px;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  color: ${props => (props.isActive ? "#2F4151" : "#87929B")};
  border: 1px solid ${props => (props.isActive ? "#2f4151" : "#E5E5E5")};
  border-bottom-color: ${props => props.isActive && white};
  width: auto;
  padding: 0px 40px;
  text-align: center;
  height: ${props => (props.isActive ? "51px" : "50px")};
  margin: 0 2px;
  margin-bottom: ${props => (props.isActive ? "-1px" : "0px")};
  border-radius: 4px 4px 0px 0px;
  background-color: ${props => (props.isActive ? white : "#E5E5E5")};
  position: relative;
  svg {
    fill: ${props => (props.isActive ? "#2F4151" : "#87929B")};
    margin-right: 20px;
    display: none;
    &:hover {
      fill: ${props => (props.isActive ? "#2F4151" : "#87929B")};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 0px 18px;
    svg {
      display: flex;
    }
  }

  @media (max-width: ${smallDesktopWidth}) and (min-width: ${desktopWidth}) {
    padding: 0px 30px;
    height: ${props => (props.isActive ? "36px" : "35px")};
    & svg {
      display: block;
      margin-right: ${({ hasIcon }) => (hasIcon ? "0px" : "")};
    }
  }

  @media (max-width: ${mobileWidthMax}) {
    flex-basis: 100%;
  }
`;

export const LinkLabel = styled.div`
  padding: 0px;
  white-space: nowrap;

  @media (max-width: ${smallDesktopWidth}) and (min-width: ${desktopWidth}) {
    display: ${({ hasIcon }) => (hasIcon ? "none" : "")};
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: ${({ hasIcon }) => (hasIcon ? "0 15px 0 0" : "0 15px")};
  }
  @media (max-width: ${desktopWidth}) {
    white-space: wrap;
  }
`;
