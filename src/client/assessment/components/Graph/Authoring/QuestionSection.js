import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";

class QuestionSection extends Component {
  componentDidMount() {
    const { fillSections, section, label, deskHeight } = this.props;
    const node = ReactDOM.findDOMNode(this);
    fillSections(
      section,
      label,
      node.offsetTop,
      deskHeight ? node.scrollHeight + deskHeight : node.scrollHeight,
      deskHeight ? true : false,
      deskHeight
    );
  }

  componentWillUnmount() {
    this.props.cleanSections();
  }

  render() {
    const { children, marginLast, padding, bgColor, advancedAreOpen } = this.props;
    return (
      <Section marginLast={marginLast} bgColor={bgColor} padding={padding} advancedAreOpen={advancedAreOpen}>
        {children}
      </Section>
    );
  }
}

QuestionSection.propTypes = {
  section: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  marginLast: PropTypes.number,
  padding: PropTypes.string,
  bgColor: PropTypes.string,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool.isRequired
};

const Section = styled.section`
  padding: ${props => (props.padding ? props.padding : "30px")};
  margin-bottom: 30px;
  border-radius: 4px;
  background-color: ${props => (props.bgColor ? props.bgColor : `#f8f8f8`)};
  display: ${props => (props.advancedAreOpen ? "block" : `none`)};

  &:last-of-type {
    margin-bottom: ${props => (props.marginLast ? `${props.marginLast}px` : "30px")};
  }
`;

export default QuestionSection;
