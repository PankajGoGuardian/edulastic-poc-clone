import React, { Component } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

class QuestionSection extends Component {
  componentDidMount() {
    const { fillSections, section, label } = this.props;
    const node = ReactDOM.findDOMNode(this);
    fillSections(section, label, node.offsetTop);
  }

  componentWillUnmount() {
    this.props.cleanSections();
  }

  render() {
    const { children, marginLast } = this.props;
    return <Section marginLast={marginLast}>{children}</Section>;
  }
}

const Section = styled.section`
  padding: 20px 35px;
  margin-bottom: 30px;
  border-radius: 4px;
  background-color: #f8f8f8;

  &:last-of-type {
    margin-bottom: ${props => (props.marginLast ? `${props.marginLast}px` : "30px")};
  }
`;

export default QuestionSection;
