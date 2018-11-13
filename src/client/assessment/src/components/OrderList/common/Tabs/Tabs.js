import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class Tabs extends Component {
  render() {
    const { children, onChange, value, extra } = this.props;

    return (
      <Container>
        {React.Children.map(children, (child, index) => {
          if (!child) return null;
          return React.cloneElement(child, {
            onClick: () => {
              onChange(index);
            },
            active: value === index,
          });
        })}
        {extra}
      </Container>
    );
  }
}

Tabs.propTypes = {
  onChange: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  value: PropTypes.number.isRequired,
  extra: PropTypes.any,
};

Tabs.defaultProps = {
  extra: null,
};

export default Tabs;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;
