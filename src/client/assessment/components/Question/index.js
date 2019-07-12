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
      clientHeight: null,
      timerID: null
    };

    this.node = React.createRef();
  }

  componentDidMount = () => {
    const { fillSections, section, label, visible } = this.props;

    const { current: node } = this.node;

    const additionalOffset =
      node.clientHeight >= window.innerHeight / 2 ? 0 : (window.innerHeight - node.clientHeight) / 2.1;

    if (!node) return false;
    if (visible === false) return false;

    fillSections(
      section,
      label,
      node.offsetTop <= 0 ? null : node.offsetTop - (window.innerHeight - node.clientHeight) / 2.1,
      node.clientHeight <= 0 ? null : node.clientHeight
    );

    this.setState({
      offsetTop: node.offsetTop <= 0 ? null : node.offsetTop - additionalOffset,
      clientHeight: node.clientHeight <= 0 ? null : node.clientHeight
    });

    this.updateVariablesOfSection();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { offsetTop, clientHeight, visible } = this.state;

    const { fillSections, section, label, advancedAreOpen } = this.props;

    const { current: node } = this.node;

    if (!node) return false;
    if (visible === false) return false;

    if (
      (typeof prevState.offsetTop !== "undefined" || typeof prevState.clientHeight !== "undefined") &&
      (prevState.offsetTop !== offsetTop ||
        prevState.clientHeight !== clientHeight ||
        prevProps.advancedAreOpen !== advancedAreOpen) &&
      (node.offsetTop > 0 && node.clientHeight > 0)
    ) {
      const additionalOffset =
        node.clientHeight >= window.innerHeight / 2 ? 0 : (window.innerHeight - node.clientHeight) / 2.1;

      fillSections(
        section,
        label,
        node.offsetTop <= 0 ? null : node.offsetTop - additionalOffset,
        node.clientHeight <= 0 ? null : node.clientHeight
      );

      this.setState({
        offsetTop: node.offsetTop <= 0 ? null : node.offsetTop - additionalOffset,
        clientHeight: node.clientHeight <= 0 ? null : node.clientHeight
      });
    }
  };

  componentWillUnmount() {
    const { timerID } = this.state;
    const { cleanSections } = this.props;

    cleanSections();
    clearInterval(timerID);
  }

  updateVariablesOfSection = () => {
    const { offsetTop, clientHeight } = this.state;
    const { fillSections, section, label } = this.props;

    const { current: node } = this.node;

    if (!node) return false;

    const timerID = setInterval(() => {
      const additionalOffset =
        node.clientHeight >= window.innerHeight / 2 ? 0 : (window.innerHeight - node.clientHeight) / 2.1;

      if (
        (typeof node.offsetTop !== "undefined" || typeof node.clientHeight !== "undefined") &&
        (node.offsetTop !== offsetTop || node.clientHeight !== clientHeight) &&
        (node.offsetTop > 0 && node.clientHeight > 0)
      ) {
        fillSections(
          section,
          label,
          node.offsetTop <= 0 ? null : node.offsetTop - additionalOffset,
          node.clientHeight <= 0 ? null : node.clientHeight
        );
      }
    }, 2000);

    this.setState({ timerID });
  };

  render() {
    const { dataCy, children, questionTextArea, advancedAreOpen, position, visible } = this.props;

    return (
      <Widget
        innerRef={this.node}
        data-cy={dataCy}
        questionTextArea={questionTextArea}
        advancedAreOpen={advancedAreOpen}
        position={position}
        visible={visible}
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
  advancedAreOpen: PropTypes.bool,
  visible: PropTypes.bool,
  position: PropTypes.string
};

Question.defaultProps = {
  dataCy: "",
  questionTextArea: false,
  visible: true,
  advancedAreOpen: null,
  position: "relative"
};

export default compose(
  withNamespaces("assessment"),
  connect(
    null,
    null
  )
)(Question);
