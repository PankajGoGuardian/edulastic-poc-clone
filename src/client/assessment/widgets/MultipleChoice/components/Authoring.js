import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ComposeQuestion from "./ComposeQuestion";
import MultipleChoiceOptions from "./MultipleChoiceOptions";

class Authoring extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func
  };

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {}
  };

  render() {
    const { item, setQuestionData, fillSections, cleanSections, fontSize } = this.props;

    return (
      <Fragment>
        <ComposeQuestion
          item={item}
          fillSections={fillSections}
          setQuestionData={setQuestionData}
          cleanSections={cleanSections}
          fontSize={fontSize}
        />
        <MultipleChoiceOptions
          item={item}
          fillSections={fillSections}
          setQuestionData={setQuestionData}
          cleanSections={cleanSections}
          fontSize={fontSize}
        />
      </Fragment>
    );
  }
}

export default Authoring;
