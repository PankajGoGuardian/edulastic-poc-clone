import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Tab from "./Tab";
import TabContainer from "./TabContainer";

class Tabs extends Component {
  static Tab = Tab;

  static TabContainer = TabContainer;

  render() {
    const { children, onChange, value, extra, style, mb } = this.props;

    return (
      <AnswersTabContainer>
        {extra}
        <Container style={style} data-cy="tabs" mb={mb}>
          {React.Children.map(children, (child, index) => {
            if (!child) return null;
            return React.cloneElement(child, {
              onClick: () => {
                onChange(index);
              },
              active: value === index
            });
          })}
        </Container>
      </AnswersTabContainer>
    );
  }
}

Tabs.propTypes = {
  onChange: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  value: PropTypes.number.isRequired,
  extra: PropTypes.any,
  style: PropTypes.object
};

Tabs.defaultProps = {
  extra: null,
  style: {}
};

export default Tabs;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: ${({ mb }) => mb || "4px"};
`;

const AnswersTabContainer = styled.div`
  width: 100%;
`;
