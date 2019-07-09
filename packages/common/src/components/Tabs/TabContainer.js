import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const TabContainer = ({ children, style, padding }) => {
  return (
    <Container padding={padding} style={style}>
      {children}
    </Container>
  );
};

TabContainer.propTypes = {
  children: PropTypes.any.isRequired,
  style: PropTypes.object
};

TabContainer.defaultProps = {
  style: {}
};

export default TabContainer;

const Container = styled.div`
  padding: ${props => (props.padding ? props.padding : "10px 0px")};
`;
