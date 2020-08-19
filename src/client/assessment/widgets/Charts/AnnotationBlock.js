import React from "react";
import { withNamespaces } from "react-i18next";
import PropTypes from "prop-types";

import Question from "../../components/Question";
import Annotations from "../../components/Annotations/Annotations";

function AnnotationsContainer({ cleanSections, fillSections, item, setQuestionData, t }) {
  return (
    <Question
      section="main"
      label={t("common.options.annotations")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <Annotations question={item} setQuestionData={setQuestionData} editable />
    </Question>
  );
}

AnnotationsContainer.propTypes = {
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  item: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export const AnnotationBlock = withNamespaces("assessment")(AnnotationsContainer);
