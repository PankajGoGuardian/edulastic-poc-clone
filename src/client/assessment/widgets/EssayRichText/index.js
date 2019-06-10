import React, { Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
//import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { CLEAR, EDIT, PREVIEW } from "../../constants/constantsForQuestions";
import { replaceVariables } from "../../utils/variables";

import EditEssayRichText from "./EditEssayRichText";
import EssayRichTextPreview from "./EssayRichTextPreview";

/**
 * FIXME: undetectable circular dependency issues. for now putting the action definition directly
 */
export const UPDATE_QUESTION = "[author questions] update questions";
export const setQuestionDataAction = question => ({
  type: UPDATE_QUESTION,
  payload: question
});

const EssayRichText = props => {
  const { item, view } = props;

  const itemForPreview = useMemo(() => replaceVariables(item), [item]);

  return (
    <Fragment>
      {view === EDIT && <EditEssayRichText {...props} />}
      {view === PREVIEW && <EssayRichTextPreview key={itemForPreview.id} {...props} item={itemForPreview} />}
    </Fragment>
  );
};

EssayRichText.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  smallSize: PropTypes.bool,
  item: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool
};

EssayRichText.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  item: {},
  userAnswer: [],
  testItem: false,
  evaluation: "",
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const EssayRichTextContainer = connect(
  null,
  { setQuestionData: setQuestionDataAction }
)(EssayRichText);

export { EssayRichTextContainer as EssayRichText };
