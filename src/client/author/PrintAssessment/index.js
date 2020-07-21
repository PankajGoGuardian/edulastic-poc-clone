import React, { useEffect, useState, useRef } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col } from "antd";
import queryString from "query-string";

import { withRouter } from "react-router-dom";
import { testsApi } from "@edulastic/api";
import { AnswerContext, MathFormulaDisplay, PrintActionWrapper, FlexContainer } from "@edulastic/common";
import { roleuser, test as testConstants } from "@edulastic/constants";
import { getOrderedQuestionsAndAnswers, formatQuestionLists } from "./utils";
import QuestionWrapper from "../../assessment/components/QuestionWrapper";
import { getCollectionsSelector, getUserRole, getUserFeatures } from "../src/selectors/user";

const { testContentVisibility: testContentVisibilityOptions } = testConstants;

function useTestFetch(testId, type, filterQuestions) {
  const [testDetails, setTestDetails] = useState(null);

  useEffect(() => {
    testsApi.getById(testId).then(test => {
      const {
        passages,
        itemGroups = [],
        title,
        authors = [],
        collections = [],
        createdBy = {},
        testContentVisibility
      } = test;
      const testItems = itemGroups.flatMap(itemGroup => itemGroup.items || []);
      const { questions, answers } = getOrderedQuestionsAndAnswers(testItems, passages, type, filterQuestions);
      setTestDetails({
        title,
        collections,
        authors,
        questions,
        answers,
        createdBy,
        testContentVisibility
      });
      document.title = test.title;
    });
  }, []);

  return testDetails;
}

const PrintAssessment = ({ match, userRole, features, location }) => {
  const containerRef = useRef(null);
  const query = queryString.parse(location.search);
  const { type, qs } = query;
  const filterQuestions = type === "custom" ? formatQuestionLists(qs) : [];
  const { testId } = match.params;
  const test = useTestFetch(testId, type, filterQuestions);

  if (!test) {
    return <div> Loading... </div>;
  }
  const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
  const isContentHidden =
    !isAdmin &&
    (test?.testContentVisibility === testContentVisibilityOptions.HIDDEN ||
      test?.testContentVisibility === testContentVisibilityOptions.GRADING);

  return (
    <>
      <PrintActionWrapper />
      <PrintAssessmentContainer className="page" ref={containerRef}>
        <StyledHeader>
          <StyledTitle>
            <b>
              <Color>Edu</Color>
            </b>
            lastic
          </StyledTitle>
          <Row type="flex" className="print-assessment-title-container">
            <Col>
              <span> {test.title}</span>
            </Col>
          </Row>
          <span> Created By {test?.createdBy?.name} </span> <br />
        </StyledHeader>
        <hr />
        {!isContentHidden ? (
          <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
            {test.questions.map((question, index) => {
              const questionHeight = question.type == "clozeImageDropDown" ? { minHeight: "500px" } : {};
              return (
                <div style={questionHeight}>
                  <QuestionWrapper
                    view="preview"
                    type={question.type}
                    previewTab="clear"
                    qIndex={index}
                    data={{ ...question, smallSize: true }}
                    isPrint
                    isPrintPreview
                  />
                  <hr />
                </div>
              );
            })}
            {!!test.answers.length && features.premium && (
              <StyledAnswerWrapper>
                <StyledAnswerText>
                  Answer Key of {test.title}
                </StyledAnswerText>
                {test.answers.map(answer => (
                  <AnswerContainer>
                    {answer.qLabel}.
                    <div className="answer-wrapper">
                      {answer.answers.map((ans, i) => {
                        const stringifyContent = Array.isArray(ans) ? ans.join(", ") : ans;
                        return (
                          <FlexContainer>
                            <StyledMathFormulaDisplay
                              key={i}
                              dangerouslySetInnerHTML={{ __html: stringifyContent || "" }}
                            />
                            {i !== answer.answers.length - 1 && ";"}
                          </FlexContainer>
                        );
                      })}
                    </div>
                  </AnswerContainer>
                ))}
              </StyledAnswerWrapper>
            )}
          </AnswerContext.Provider>
        ) : (
          <div>
            <b>
              View of Items is restricted by the admin if content visibility is set to &quot;Always hidden&quot; OR
              &quot;Hide prior to grading&quot;
            </b>
          </div>
        )}
      </PrintAssessmentContainer>
    </>
  );
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      collections: getCollectionsSelector(state),
      userRole: getUserRole(state),
      features: getUserFeatures(state)
    }),
    {}
  )
);

export default enhance(PrintAssessment);

const PrintAssessmentContainer = styled.div`
  width: 250mm;
  min-height: 297mm;
  padding: 1mm;
  margin: auto;
  background-color: white;
  * {
    -webkit-print-color-adjust: exact !important; /* Chrome, Safari */
    color-adjust: exact !important; /*Firefox*/
  }
  .print-assessment-title-container {
    .ant-col {
      flex: 1;
      font-size: 20px;
      font-weight: bold;
    }
  }

  .matchlist-wrapper img {
    display: block;
  }
  .question-wrapper {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: 0;
    padding-right: 0;
    .sort-list-wrapper {
      margin: auto;
    }
    .responseboxContainer {
      width: 100%;
    }
    .cloze-image-dropdown-response {
      overflow-x: hidden;
    }
  }
  .multiple-choice-wrapper {
    .multiplechoice-optionlist {
      > div {
        margin-bottom: 5px !important;
      }
      label {
        margin-bottom: 0px !important;
      }
    }
  }
  .classification-preview {
    overflow: hidden !important;
    .classification-preview-wrapper {
      align-items: center;
      overflow: hidden !important;
      > div {
        max-width: 100%;
        width: 100%;
      }
      .choice-items-wrapper {
        flex-direction: column !important;
      }
      .classification-preview-wrapper-response {
        > div {
          height: auto !important;
          width: auto !important;
        }
        div {
          position: relative !important;
          transform: none !important;
          text-align: center;
        }
        .table-layout {
          flex-wrap: wrap;
          justify-content: flex-start;
        }
      }
    }
  }
  .__print-question-main-wrapper {
    display: inline-table;
    width: 100%;
  }
  @page {
    margin: 10px;
  }
`;

const StyledTitle = styled.p`
  font-size: 30px;
  text-align: left;
  font-weight: normal;
  padding: 15px 0 10px 0px;
  margin: 0;
`;

export const Color = styled.span`
  color: #58b294;
`;

const AnswerContainer = styled.div`
  display: flex;
  padding: 5px 30px;
  .answer-wrapper {
    display: flex;
    flex-direction: column;
    .math-formula-display {
      margin-bottom: 0 !important;
    }
  }
`;

const StyledAnswerWrapper = styled.div`
  page-break-before: always;
  padding-top: 20px;
`;

const StyledHeader = styled.div`
  padding: 0 20px;
`;

const StyledMathFormulaDisplay = styled(MathFormulaDisplay)`
  margin: 0 0 10px 10px;
  min-height: 22px;
`;

const StyledAnswerText = styled.span`
  text-decoration: underline;
  font-weight: 700;
  font-size: 18px;
`;