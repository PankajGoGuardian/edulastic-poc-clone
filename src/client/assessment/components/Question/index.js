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
      el: null,
      intervalID: null
    };

    this.node = React.createRef();
  }

  componentDidMount = () => {
    const { fillSections, section, label, sectionId, visible } = this.props;

    const { current: node } = this.node;

    if (!node) return false;
    if (visible === false) return false;

    fillSections(section, label, node, sectionId);

    this.setState({
      intervalID: setInterval(() => {
        this.updateVariablesOfSection();
      }, 1000)
    });

    this.setState({
      el: node
    });
  };

  componentWillUnmount() {
    const { cleanSections, sectionId } = this.props;
    const { intervalID } = this.state;

    cleanSections(sectionId);
    clearInterval(intervalID);
  }

  updateVariablesOfSection = () => {
    const { el } = this.state;
    const { fillSections, section, label } = this.props;

    const { current: node } = this.node;

    if (!node) return false;

    if (node.clientHeight !== el.clientHeight || node.offsetTop !== el.offsetTop) {
      fillSections(section, label, node);

      this.setState({
        el: node
      });
    }
  };

  render() {
    const {
      dataCy,
      children,
      questionTextArea,
      advancedAreOpen,
      position,
      visible,
      overflowHandlers,
      styles = {}
    } = this.props;

    return (
      <Widget
        ref={this.node}
        data-cy={dataCy}
        questionTextArea={questionTextArea}
        advancedAreOpen={advancedAreOpen}
        position={position}
        visible={visible}
        overflowHandlers={overflowHandlers}
        style={styles}
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
  position: PropTypes.string,
  overflowHandlers: PropTypes.object
};

Question.defaultProps = {
  dataCy: "",
  questionTextArea: false,
  visible: true,
  advancedAreOpen: null,
  position: "relative",
  overflowHandlers: {}
};

export default compose(
  withNamespaces("assessment"),
  connect(
    null,
    null
  )
)(Question);
