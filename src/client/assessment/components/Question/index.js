import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";

import { Widget } from "../../styled/Widget";

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offsetTop: null,
      clientHeight: null
    };

    this.node = React.createRef();
  }

  componentDidMount = () => {
    const { fillSections, section, label } = this.props;

    const { current: node } = this.node;

    if (!node) return false;

    fillSections(section, label, node.offsetTop - (window.innerHeight - node.clientHeight) / 2, node.clientHeight);

    this.setState({
      offsetTop: node.offsetTop - (window.innerHeight - node.clientHeight) / 2,
      clientHeight: node.clientHeight
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { offsetTop, clientHeight } = this.state;

    const { fillSections, section, label, advancedAreOpen } = this.props;

    const { current: node } = this.node;

    if (!node) return false;

    if (
      (typeof prevState.offsetTop !== "undefined" || typeof prevState.clientHeight !== "undefined") &&
      (prevState.offsetTop !== offsetTop ||
        prevState.clientHeight !== clientHeight ||
        prevProps.advancedAreOpen !== advancedAreOpen) &&
      (node.offsetTop >= 0 && node.clientHeight >= 0)
    ) {
      fillSections(
        section,
        label,
        node.offsetTop === 0 ? null : node.offsetTop - (window.innerHeight - node.clientHeight) / 2,
        node.clientHeight === 0 ? null : node.clientHeight
      );

      this.setState({
        offsetTop: node.offsetTop === 0 ? null : node.offsetTop - (window.innerHeight - node.clientHeight) / 2,
        clientHeight: node.clientHeight === 0 ? null : node.clientHeight
      });
    }
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { dataCy, children, questionTextArea, advancedAreOpen } = this.props;

    return (
      <Widget
        innerRef={this.node}
        data-cy={dataCy}
        questionTextArea={questionTextArea}
        advancedAreOpen={advancedAreOpen}
      >
        {children}
      </Widget>
    );
  }
}

Question.propTypes = {
  fillSections: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  dataCy: PropTypes.string,
  questionTextArea: PropTypes.bool,
  advancedAreOpen: PropTypes.bool
};

Question.defaultProps = {
  dataCy: "",
  questionTextArea: false,
  advancedAreOpen: null
};

export default compose(
  withNamespaces("assessment"),
  connect(
    null,
    null
  )
)(Question);
