/* eslint-disable func-names */
/* eslint-disable no-undef */
import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Paper, WithResources, InstructorStimulus } from "@edulastic/common";
import { compose } from "redux";
import { connect } from "react-redux";
import produce from "immer";
import { get, cloneDeep } from "lodash";

import { withTutorial } from "../../../tutorials/withTutorial";
import { CLEAR, PREVIEW, EDIT } from "../../constants/constantsForQuestions";
import ClozeMathAnswers from "./ClozeMathAnswers";
import ClozeMathPreview from "./ClozeMathPreview";
import MathFormulaOptions from "../MathFormula/components/MathFormulaOptions";
import { checkAnswerAction } from "../../../author/src/actions/testItem";
import { setQuestionDataAction } from "../../../author/src/actions/question";
import { changePreviewAction } from "../../../author/src/actions/view";
import { ContentArea } from "../../styled/ContentArea";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/Label";

import { replaceVariables, updateVariables } from "../../utils/variables";

// import ComposeQuestion from "./ComposeQuestion";
import Template from "./Template";
import ChoicesForDropDown from "./ChoicesForDropDown";
import { AnswerContext } from "@edulastic/common";

const ClozeMath = ({
  view,
  previewTab,
  item,
  setQuestionData,
  saveAnswer,
  checkAnswer,
  evaluation,
  userAnswer,
  fillSections,
  cleanSections,
  isSidebarCollapsed,
  advancedAreOpen,
  instructorStimulus,
  showQuestionNumber,
  flowLayout,
  ...restProps
}) => {
  const answerContextConfig = useContext(AnswerContext);
  let actualPreviewMode = previewTab;
  if (answerContextConfig.expressGrader && !answerContextConfig.isAnswerModifiable) {
    actualPreviewMode = "check";
  } else if (answerContextConfig.expressGrader && answerContextConfig.isAnswerModifiable) {
    actualPreviewMode = "clear";
  }

  const { col } = restProps;
  const _itemChange = (prop, uiStyle) => {
    const newItem = produce(item, draft => {
      draft[prop] = uiStyle;
      updateVariables(draft);
    });

    setQuestionData(newItem);
  };

  const _setQuestionData = newItem => {
    setQuestionData(
      produce(newItem, draft => {
        updateVariables(draft);
      })
    );
  };

  const handleKeypadMode = keypad => {
    setQuestionData(
      produce(item, draft => {
        const symbols = cloneDeep(draft.symbols);
        symbols[0] = keypad;
        draft.symbols = symbols;
        updateVariables(draft);
      })
    );
  };

  const itemForPreview = replaceVariables(item);
  const isV1Multipart = get(col, "isV1Multipart", false);
  const { qLabel } = item;

  return (
    <WithResources
      resources={[
        "https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.css",
        "https://cdnedupoc.snapwiz.net/mathquill/mathquill.min.js"
      ]}
      fallBack={<span />}
      onLoaded={() => {}}
    >
      {!flowLayout ? (
        <>
          <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
          <QuestionTitleWrapper>{showQuestionNumber && <QuestionNumber>{qLabel}</QuestionNumber>}</QuestionTitleWrapper>
        </>
      ) : null}

      {view === EDIT && (
        <ContentArea data-cy="question-area" isSidebarCollapsed={isSidebarCollapsed}>
          {/* <ComposeQuestion
            item={item}
            setQuestionData={_setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          /> */}
          <Template
            item={item}
            setQuestionData={_setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          <ClozeMathAnswers
            id="answers"
            item={item}
            setQuestionData={_setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
            onChangeKeypad={handleKeypadMode}
          />
          <ChoicesForDropDown item={item} fillSections={fillSections} cleanSections={cleanSections} />

          <MathFormulaOptions
            onChange={_itemChange}
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
        <Paper isV1Multipart={isV1Multipart} style={{ height: "100%", overflow: "visible" }}>
          <ClozeMathPreview
            type={actualPreviewMode}
            item={itemForPreview}
            stimulus={item.stimulus}
            options={item.options || {}}
            responseIds={item.response_ids}
            saveAnswer={saveAnswer}
            check={checkAnswer}
            userAnswer={userAnswer}
            evaluation={evaluation}
            {...restProps}
          />
        </Paper>
      )}
    </WithResources>
  );
};

ClozeMath.propTypes = {
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  previewTab: PropTypes.string,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool
};

ClozeMath.defaultProps = {
  previewTab: CLEAR,
  userAnswer: [],
  item: {},
  evaluation: [],
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  showQuestionNumber: false,
  flowLayout: false
};

const enhance = compose(
  withTutorial("clozeMath"),
  connect(
    (state, { item }) => ({
      evaluation: state.evaluation[item.id],
      isSidebarCollapsed: state.authorUi.isSidebarCollapsed
    }),
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction,
      changePreview: changePreviewAction
    }
  )
);

export default enhance(ClozeMath);
