import React from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";

import Question from "../../../components/Question";
import CorrectAnswers from "../../../components/CorrectAnswers";

const SetCorrectAnswers = ({
  t,
  onTabChange,
  chartPreview,
  fillSections,
  cleanSections,
  onChangePoints,
  currentTab,
  onAdd,
  onCloseTab,
  points,
  isCorrectAnsTab = false,
  item
}) => {
  const handleChangePoint = score => {
    if (score > 0) {
      onChangePoints(+score);
    }
  };

  const handleCloseAlter = () => {
    onCloseTab(currentTab - 1);
  };

  const handleClickTab = index => onTabChange(index);

  return (
    <Question
      section="main"
      label={t("component.correctanswers.setcorrectanswers")}
      fillSections={fillSections}
      cleanSections={cleanSections}
    >
      <CorrectAnswers
        correctTab={currentTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
        validation={item.validation}
        questionType={item?.title}
        onAdd={onAdd}
        onCloseTab={handleCloseAlter}
        onTabChange={handleClickTab}
        onChangePoints={handleChangePoint}
        points={points}
        isCorrectAnsTab={isCorrectAnsTab}
      >
        {chartPreview}
      </CorrectAnswers>
    </Question>
  );
};

SetCorrectAnswers.propTypes = {
  onTabChange: PropTypes.func.isRequired,
  onChangePoints: PropTypes.func.isRequired,
  onCloseTab: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired,
  points: PropTypes.number.isRequired,
  currentTab: PropTypes.number.isRequired,
  chartPreview: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  item: PropTypes.object.isRequired
};

SetCorrectAnswers.defaultProps = {
  chartPreview: null,
  fillSections: () => {},
  cleanSections: () => {}
};

export default withNamespaces("assessment")(SetCorrectAnswers);
