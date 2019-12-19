import React, { Component, memo } from "react";
import PropTypes from "prop-types";
import produce from "immer";
import { compose } from "redux";
import { connect } from "react-redux";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { updateVariables } from "../../utils/variables";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

import Options from "./Options";
import ProtractorView from "./ProtractorView";

class Details extends Component {
  render() {
    const { item, smallSize, setQuestionData, t, fillSections, advancedLink, cleanSections, ...restProps } = this.props;

    const handleItemChangeChange = (prop, value) => {
      setQuestionData(
        produce(item, draft => {
          draft[prop] = value;
          updateVariables(draft);
        })
      );
    };

    return (
      <Question
        section="main"
        label={t("component.protractor.details")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.protractor.details")}`)}>
          {t("component.protractor.details")}
        </Subtitle>
        {advancedLink}
        <Options onChange={handleItemChangeChange} item={item} />
        <ProtractorView smallSize={smallSize} item={item} {...restProps} />
      </Question>
    );
  }
}

Details.propTypes = {
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func,
  fillSections: PropTypes.func,
  advancedLink: PropTypes.any
};

Details.defaultProps = {
  advancedLink: null,
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
