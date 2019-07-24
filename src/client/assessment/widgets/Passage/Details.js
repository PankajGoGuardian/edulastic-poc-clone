import React, { memo, Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";

import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { Subtitle } from "../../styled/Subtitle";
import Question from "../../components/Question";

import Options from "./components/Options";
import PassageView from "./PassageView";

class Details extends Component {
  render() {
    const { item, setQuestionData, fillSections, cleanSections, t } = this.props;

    return (
      <Question
        section="main"
        label={t("component.passage.details")}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle>{t("component.passage.details")}</Subtitle>
        <Options setQuestionData={setQuestionData} item={item} />

        <PassageView item={item} />
      </Question>
    );
  }
}

Details.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Details.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
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
