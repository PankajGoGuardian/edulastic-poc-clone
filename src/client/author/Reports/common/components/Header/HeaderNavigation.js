import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { themeColorLight, themeColorSecondaryLighter, smallDesktopWidth } from "@edulastic/colors";

const HeaderNavigation = ({ navigationItems, activeItemKey }) => {
  return (
    <TabsContainer>
      {navigationItems.map(item => {
        const isActive = activeItemKey == item.key;
        return (
          <StyledLink isActive={isActive} to={item.location}>
            {item.title}
          </StyledLink>
        );
      })}
    </TabsContainer>
  );
};

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
  background-color: ${props => (props.isActive ? themeColorLight : themeColorSecondaryLighter)};
  border-radius: 3px;
  font-weight: 600;
  margin: 0px 3px;
  color: white;
  font-size: 12px;
  height: 40px;

  &:hover {
    color: white;
  }

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 10px;
  }
`;
