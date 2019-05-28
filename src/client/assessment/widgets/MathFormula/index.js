import React, { Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";

import { Paper } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { replaceVariables, updateVariables } from "../../utils/variables";

import { ContentArea } from "../../styled/ContentArea";

import { CLEAR, PREVIEW, EDIT } from "../../constants/constantsForQuestions";
import { latexKeys } from "./constants";

import MathFormulaAnswers from "./MathFormulaAnswers";
import MathFormulaOptions from "./components/MathFormulaOptions";
import MathFormulaPreview from "./MathFormulaPreview";
import ComposeQuestion from "./ComposeQuestion";
import Template from "./Template";

const EmptyWrapper = styled.div``;

const MathFormula = ({
  view,
  testItem,
  previewTab,
  item,
  evaluation,
  setQuestionData,
  saveAnswer,
  smallSize,
  userAnswer,
  advancedAreOpen,
  fillSections,
  cleanSections,
  isSidebarCollapsed,
  ...restProps
}) => {
  const Wrapper = testItem ? EmptyWrapper : Paper;

  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, draft => {
        draft[prop] = uiStyle;
        updateVariables(draft, latexKeys);
      })
    );
  };

  const itemForPreview = useMemo(() => replaceVariables(item, latexKeys), [item]);
  const studentTemplate =
    itemForPreview.template && itemForPreview.template.replace(/\\embed\{response\}/g, "\\MathQuillMathField{}");

  return (
    <Fragment>
      {view === EDIT && (
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
          <ComposeQuestion
            item={item}
            setQuestionData={setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <Template
            item={item}
            setQuestionData={setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <MathFormulaAnswers
            item={item}
            setQuestionData={setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <MathFormulaOptions
            onChange={handleItemChangeChange}
            uiStyle={item.ui_style}
            item={item}
            responseContainers={item.response_containers}
            textBlocks={item.text_blocks}
            stimulusReview={item.stimulus_review}
            instructorStimulus={item.instructor_stimulus}
            metadata={item.metadata}
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper style={{ height: "100%", overflow: "visible" }}>
          <MathFormulaPreview
            type={previewTab}
            studentTemplate={studentTemplate}
            item={itemForPreview}
            saveAnswer={saveAnswer}
            evaluation={evaluation}
            smallSize={smallSize}
            userAnswer={userAnswer}
            fillSections={fillSections}
            cleanSections={cleanSections}
            {...restProps}
          />
        </Wrapper>
      )}
    </Fragment>
  );
};

MathFormula.propTypes = {
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  testItem: PropTypes.bool,
  item: PropTypes.object,
  evaluation: PropTypes.any.isRequired,
  userAnswer: PropTypes.any,
  smallSize: PropTypes.bool,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

MathFormula.defaultProps = {
  previewTab: CLEAR,
  testItem: false,
  item: {},
  userAnswer: null,
  smallSize: false,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {}
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction
    }
  )
);

const MathFormulaContainer = enhance(MathFormula);

export { MathFormulaContainer as MathFormula };
