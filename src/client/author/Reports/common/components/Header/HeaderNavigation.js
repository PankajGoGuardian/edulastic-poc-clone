import { greyThemeDark2, smallDesktopWidth, white } from "@edulastic/colors";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderNavigation = ({ navigationItems, activeItemKey }) => (
  <TabsContainer>
    {navigationItems.map(item => {
      const isActive = activeItemKey === item.key;
      return (
        <StyledLink isActive={isActive} to={item.location}>
          {item.title}
        </StyledLink>
      );
    })}
  </TabsContainer>
);

HeaderNavigation.propTypes = {
  navigationItems: PropTypes.array,
  activeItemKey: PropTypes.string
};

HeaderNavigation.defaultProps = {
  navigationItems: [],
  activeItemKey: ""
};

export default HeaderNavigation;

const TabsContainer = styled.div`
  display: flex;
`;

const StyledLink = styled(Link)`
  display: block;
  padding: 0px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.isActive ? "#b3bcc4" : "#f2f3f2")};
  color: ${props => (props.isActive ? white : greyThemeDark2)};
  border-radius: 3px;
  font-weight: 600;
  margin: 0px 3px;
  font-size: 12px;
  height: 40px;

  &:hover {
    color: white;
  }

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 10px;
  }
`;
