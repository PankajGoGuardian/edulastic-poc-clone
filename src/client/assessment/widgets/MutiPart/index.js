import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";

import { PREVIEW } from "../../constants/constantsForQuestions";
import { replaceVariables } from "../../utils/variables";

import MutiPartRichText from "./MutiPartRichText";

const MultiPart = props => {
  const { item, view } = props;
  const itemForPreview = useMemo(() => replaceVariables(item), [item]);
  return <MutiPartRichText {...props} readyOnly={PREVIEW === view} item={itemForPreview} />;
};

MultiPart.propTypes = {
  view: PropTypes.string.isRequired,
  item: PropTypes.object
};

MultiPart.defaultProps = {
  item: {}
};

const MultiPartContainer = connect(
  null,
  { setQuestionData: setQuestionDataAction }
)(MultiPart);

export { MultiPartContainer as MultiPart };
