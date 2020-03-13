import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import { PaddingDiv } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { setQuestionDataAction } from "../../../author/QuestionEditor/ducks";
import { PREVIEW, EDIT } from "../../constants/constantsForQuestions";

import { replaceVariables } from "../../utils/variables";

import { ContentArea } from "../../styled/ContentArea";
import { changePreviewAction } from "../../../author/src/actions/view";
import { getFontSize } from "../../utils/helpers";

import Authoring from "./components/Authoring";
import QuestionSolution from "./components/QuestionSolution";
import LayoutDisplayOptions from "./components/LayoutDisplayOptions";
import Preview from "./components/Preview";
import { EmptyWrapper, CodeReviewWrapper } from "./styled";
import "./ace";

const Coding = ({
  item,
  view,
  smallSize,
  item: templateItem,
  fillSections,
  cleanSections,
  flowLayout,
  setQuestionData,
  saveAnswer,
  userAnswer
}) => {
  const getRenderData = () => {
    const item = view === EDIT ? templateItem : replaceVariables(templateItem);

    const previewStimulus = {
      stimulus: item.stimulus,
      stimulusBody: item.stimulusBody,
      languages: item.languages,
      codeStubs: item.codeStubs,
      editorConfig: item.editorConfig,
      layout: item.layout,
      id: item.id
    };
    return {
      previewStimulus,
      itemForEdit: item,
      uiStyle: item.uiStyle
    };
  };

  const { previewStimulus, itemForEdit, uiStyle } = getRenderData();
  const fontSize = getFontSize(uiStyle?.fontsize);

  return (
    <React.Fragment>
      <PaddingDiv>
        {view === EDIT && (
          <ContentArea>
            <Authoring
              item={itemForEdit}
              fillSections={fillSections}
              fontSize={fontSize}
              cleanSections={cleanSections}
            />
            <QuestionSolution
              item={item}
              fillSections={fillSections}
              fontSize={fontSize}
              cleanSections={cleanSections}
              setQuestionData={setQuestionData}
            />
            <LayoutDisplayOptions
              item={item}
              fillSections={fillSections}
              fontSize={fontSize}
              cleanSections={cleanSections}
              setQuestionData={setQuestionData}
            />
          </ContentArea>
        )}
        {view === PREVIEW && (
          <CodeReviewWrapper isV1Multipart flowLayout={flowLayout}>
            <Preview
              view={view}
              smallSize={smallSize}
              question={previewStimulus}
              uiStyle={uiStyle}
              flowLayout={flowLayout}
              styleType="primary"
              fontSize={fontSize}
              saveAnswer={saveAnswer}
              userAnswer={userAnswer}
            />
          </CodeReviewWrapper>
        )}
      </PaddingDiv>
    </React.Fragment>
  );
};

Coding.propTypes = {
  view: PropTypes.string.isRequired,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func
};

Coding.defaultProps = {
  item: {
    options: []
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  fillSections: () => {},
  cleanSections: () => {},
  flowLayout: false
};

const enhance = compose(
  withRouter,
  withNamespaces("assessment"),
  connect(
    null,
    { setQuestionData: setQuestionDataAction, changeView: changePreviewAction }
  )
);

const CodingContainer = enhance(Coding);

export { CodingContainer as Coding };
