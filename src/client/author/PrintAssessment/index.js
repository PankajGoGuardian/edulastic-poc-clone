import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col } from "antd";
import queryString from "query-string";
import html2Pdf from "html2pdf.js"

import { withRouter } from "react-router-dom";
import { testsApi } from "@edulastic/api";
import { AnswerContext, MathFormulaDisplay } from "@edulastic/common";
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
      const testItems = itemGroups.flatMap(itemGroup => itemGroup.items || []).filter(i => i);
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
  
    
  const printItems = () =>{
    const opt = {
      margin: 10,
      pagebreak: {mode: ['css', 'legacy'], before: '.__before-break', after: '.__after-break', avoid: 'img'},
      filename:     'myfile.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas: { dpi: 300, letterRendering: true},
      jsPDF:        {unit: 'pt', format: 'a4', orientation: 'p'}
    };
    // html2pdf(containerRef.current, opt);
    html2Pdf().set(opt).from(containerRef.current).toContainer().save();
    console.log('Clickeddd')
  }
      
  
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
      <div>
        <button style={{ margin: 5 }} type="button" onClick={() => printItems()}>Print with html2pdf!</button>
        <button style={{ margin: 5 }} stype="button" onClick={() => window.print()}>Print with chrome!</button>
      </div>
      <PrintAssessmentContainer ref={containerRef} size="A4">
        <div style={{ padding: "0 20px" }}>
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
        </div>
        <hr />
        {!isContentHidden ? (
          <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
            {test.questions.map((question, index) => (
              <div className="__before-break">
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
            ))}
            {!!test.answers.length && features.premium && (
            <StyledAnswerWrapper>
              <span style={{ textDecoration: "underline", fontWeight: "700", fontSize: "18px" }}>
                Answer Key of {test.title}
              </span>
              {test.answers.map(answer => (
                <AnswerContainer>
                  {answer.qLabel}.
                  <div className="answer-wrapper">
                    {answer.answers.map((ans, i) => (
                      <div style={{ display: "flex" }}>
                        <MathFormulaDisplay
                          key={i}
                          style={{ margin: "0 0 10px 10px", minHeight: "22px" }}
                          dangerouslySetInnerHTML={{ __html: ans || "" }}
                        />
                        {i !== answer.answers.length - 1 && ";"}
                      </div>
                    ))}
                  </div>
                  <hr />
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

PrintAssessment.propTypes = {
  match: PropTypes.object,
  userRole: PropTypes.string
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
  width: 21cm;
  margin: auto;
  display: block;
  margin: 0 auto;
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
    page-break-inside: avoid;
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
      div,
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
          > div {
            page-break-inside: avoid;
          }
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
