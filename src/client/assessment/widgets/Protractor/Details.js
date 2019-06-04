import React, { Component, memo } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import ReactDOM from "react-dom";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import { Widget } from "../../styled/Widget";

import Options from "./Options";
import ProtractorView from "./ProtractorView";

class Details extends Component {
  componentDidMount = () => {
    const { fillSections, t } = this.props;
    const node = ReactDOM.findDOMNode(this);

    fillSections("main", t("component.protractor.details"), node.offsetTop, node.scrollHeight);
  };

  componentWillUnmount() {
    const { cleanSections } = this.props;

    cleanSections();
  }

  render() {
    const { item, smallSize, setQuestionData, t, ...restProps } = this.props;

    const handleItemChangeChange = (prop, value) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = value;
          updateVariables(draft);
        })
      );
    };

    return (
      <Widget>
        <Subtitle>{t("component.protractor.details")}</Subtitle>
        <Options onChange={handleItemChangeChange} item={item} />
        <ProtractorView smallSize={smallSize} item={item} {...restProps} />
      </Widget>
    );
  }
}

Details.propTypes = {
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func,
  fillSections: PropTypes.func
};

Details.defaultProps = {
  cleanSections: () => {},
  fillSections: () => {}
};

export default compose(
  withNamespaces("assessment"),
  memo,
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
)(Details);
