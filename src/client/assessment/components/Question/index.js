import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { debounce } from "lodash";

import { withNamespaces } from "@edulastic/localization";

import { Widget } from "../../styled/Widget";

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      el: null
    };

    this.node = React.createRef();
  }

  componentDidMount = () => {
    const { fillSections, section, label, visible } = this.props;

    const { current: node } = this.node;

    if (!node) return false;
    if (visible === false) return false;

    fillSections(section, label, node);

    this.setState({
      el: node
    });

    this.updateVariablesOfSection();
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  updateVariablesOfSection = () => {
    const { el } = this.state;
    const { fillSections, section, label } = this.props;

    const { current: node } = this.node;

    if (!node) return false;

    debounce(() => {
      if (node.clientHeight !== el.clientHeight || node !== el) {
        fillSections(section, label, node);

        this.setState({
          el: node
        });
      }
    }, 100);
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
