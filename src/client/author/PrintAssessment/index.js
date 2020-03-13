import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import { Row, Col } from "antd";

import { withRouter } from "react-router-dom";
import { testsApi } from "@edulastic/api";
import { AnswerContext } from "@edulastic/common";
import { roleuser, test as testConstants } from "@edulastic/constants";
import { getOrderedQuestionsAndAnswers } from "./utils";
import QuestionWrapper from "../../assessment/components/QuestionWrapper";
import { getCollectionsSelector, getUserRole } from "../src/selectors/user";

const { testContentVisibility: testContentVisibilityOptions } = testConstants;

function useTestFetch(testId) {
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
      const { questions, answers } = getOrderedQuestionsAndAnswers(testItems, passages);
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

const PrintAssessment = ({ match, userRole }) => {
  const { testId } = match.params;
  const test = useTestFetch(testId);

  if (!test) {
    return <div> Loading... </div>;
  }
  const isAdmin = userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN;
  const isContentHidden =
    !isAdmin &&
    (test?.testContentVisibility === testContentVisibilityOptions.HIDDEN ||
      test?.testContentVisibility === testContentVisibilityOptions.GRADING);

  return (
    <PrintAssessmentContainer>
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
          {test.questions.map((question, index) => {
            const questionHeight = question.type == "clozeImageDropDown" ? { minHeight: "500px" } : {};
            return (
              <div style={index !== 0 ? { pageBreakInside: "avoid", ...questionHeight } : questionHeight}>
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
          <StyledAnswerWrapper>
            <span style={{ textDecoration: "underline", fontWeight: "700", fontSize: "18px" }}>
              Answer Key of {test.title}
            </span>
            {test.answers.map(answer => (
              <AnswerContainer>
                <div className="answer-wrapper">
                  {answer.qLabel}. {answer.answer}
                </div>
                <hr />
              </AnswerContainer>
            ))}
          </StyledAnswerWrapper>
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
  );
};

PrintAssessment.propTypes = {
  match: PropTypes.object,
  userRole: PropTypes.string
};

const enhance = compose(
  withRouter,
  connect(
    state => ({ collections: getCollectionsSelector(state), userRole: getUserRole(state) }),
    {}
  )
);

export default enhance(PrintAssessment);

const PrintAssessmentContainer = styled.div`
  width: 25cm;
  margin: auto;
  background-color: white;
  pointer-events: none;
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
  .answer-wrapper {
    padding: 5px 30px;
  }
`;

const StyledAnswerWrapper = styled.div`
  page-break-before: always;
  padding-top: 20px;
`;
