import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const TabContainer = React.forwardRef((props, ref) => {
  const { children, style, padding, className } = props;
  return (
    <Container ref={ref} padding={padding} style={style} className={className}>
      {children}
    </Container>
  );
});

TabContainer.propTypes = {
  children: PropTypes.any.isRequired,
  style: PropTypes.object
};

TabContainer.defaultProps = {
  style: {}
};

export default TabContainer;

const Container = styled.div`
  width: 100%;
  padding: ${props => (props.padding ? props.padding : "10px 0px")};
`;
