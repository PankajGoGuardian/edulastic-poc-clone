import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { roleuser as userRoles } from "@edulastic/constants";
import { getUserRole, getUserFeatures } from "../../../author/src/selectors/user";

import { Widget } from "../../styled/Widget";

const { TEACHER, DISTRICT_ADMIN, SCHOOL_ADMIN } = userRoles;

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

    if (this.showSection()) {
      const { current: node } = this.node;
      if (typeof node !== "object") return false;
      if (visible === false) return false;

      fillSections(section, label, node, sectionId);

      // fix me
      // i keep running indefinitely
      // not sure why it is required.
      this.setState({
        intervalID: setInterval(() => {
          this.updateVariablesOfSection();
        }, 1000)
      });

      this.setState({
        el: node
      });
    }
  };

  showSection = () => {
    const { userRole, isPowerTeacher, isPremiumUser, section, label, features } = this.props;

    // show all tools except advanced section and 'Solution' section
    if (section !== "advanced" || label === "Solution") {
      return true;
    }
    let showAdvancedTools = true;

    // allowed for teacher/DA/SA having premium feature and enabled power tools
    if (
      (userRole === TEACHER && !features.isPublisherAuthor && !features.isCurator) ||
      [DISTRICT_ADMIN, SCHOOL_ADMIN].includes(userRole)
    ) {
      showAdvancedTools = false;
      if (isPremiumUser && isPowerTeacher) {
        showAdvancedTools = true;
      }
    }
    return showAdvancedTools;
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
    if (!this.showSection()) {
      return null;
    }

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
    state => ({
      userRole: getUserRole(state),
      isPowerTeacher: get(state, ["user", "user", "isPowerTeacher"], false),
      isPremiumUser: get(state, ["user", "user", "features", "premium"], false),
      features: getUserFeatures(state)
    }),
    null
  )
)(Question);
