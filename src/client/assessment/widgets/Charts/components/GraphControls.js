/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import produce from "immer";
import { withNamespaces } from "@edulastic/localization";
import Question from "../../../components/Question";
import { Subtitle } from "../../../styled/Subtitle";
import { Tools } from "./Tools";

import { setQuestionDataAction, getQuestionDataSelector } from "../../../../author/QuestionEditor/ducks";

const allControls = ["undo", "redo", "reset", "delete"];
const GraphControls = ({ t, advancedAreOpen, fillSections, cleanSections, item, setQuestionData }) => {
  const setTool = tool => {
    setQuestionData(
      produce(item, draft => {
        if (!draft.controls) {
          draft.controls = [];
        }
        if (draft.controls.indexOf(tool) === -1) {
          draft.controls.push(tool);
        } else {
          draft.controls.splice(draft.controls.indexOf(tool), 1);
        }
        draft.controls = allControls.filter(con => draft.controls.includes(con));
      })
    );
  };
  return (
    <Question
      section="advanced"
      label={t("component.options.graphControls")}
      advancedAreOpen={advancedAreOpen}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Subtitle id={getFormattedAttrId(`${item?.title}-${t("component.options.graphControls")}`)}>
        {t("component.options.graphControls")}
      </Subtitle>
      <Tools setTool={setTool} tools={item.controls || []} controls={allControls} />
    </Question>
  );
};

GraphControls.propTypes = {
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};
GraphControls.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      item: getQuestionDataSelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(GraphControls);
