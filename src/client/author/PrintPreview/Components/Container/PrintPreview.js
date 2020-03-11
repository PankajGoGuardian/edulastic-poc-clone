import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import queryString from "query-string";
import * as moment from "moment";
import { mobileWidthMax } from "@edulastic/colors";
import StudentQuestionContainer from "../StudentQuestionContiner/StudentQuestionContainer";

import {
  PrintPreviewBack,
  PrintPreviewContainer,
  PagePrinterHeader,
  TestInfo,
  InfoItem,
  StyledTitle,
  Color
} from "./styled";

// actions
import { fetchPrintPreviewEssentialsAction } from "../../ducks";
// selectors
import {
  getClassResponseSelector,
  getClassStudentResponseSelector,
  getTestActivitySelector,
  getAdditionalDataSelector,
  getAssignmentClassIdSelector
} from "../../../ClassBoard/ducks";

class PrintPreview extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchPrintPreviewEssentialsAction, match, location } = this.props;
    const { assignmentId, classId } = match.params;
    const selectedStudents = queryString.parse(location.search, { arrayFormat: "comma" });

    let _selectedStudents;
    if (typeof selectedStudents.selectedStudents === "string") {
      _selectedStudents = [selectedStudents.selectedStudents];
    } else {
      _selectedStudents = selectedStudents.selectedStudents;
    }

    fetchPrintPreviewEssentialsAction({ assignmentId, classId, selectedStudents: _selectedStudents });
  }

  render() {
    const { testActivity, classResponse, classStudentResponse, additionalData } = this.props;
    const testName = additionalData ? additionalData.testName : "";
    const { assignmentIdClassId } = this.props;

    const nDueDate = additionalData ? additionalData.endDate : "";
    const dueDate = moment(nDueDate).format("MMMM DD, YYYY | hh:mm A");

    let renderClassStudentsResponse = [];
    if (classStudentResponse && Object.keys(classStudentResponse).length > 0) {
      classStudentResponse.map(studentResponse => {
        const renderStudentResponse = (
          <StudentQuestionContainer
            testActivity={testActivity}
            assignmentIdClassId={assignmentIdClassId}
            classResponse={classResponse}
            studentResponse={studentResponse}
            additionalData={additionalData}
          />
        );
        renderClassStudentsResponse.push(renderStudentResponse);
      });
    }

    return (
      <PrintPreviewBack>
        <PrintPreviewContainer>
          <StyledTitle>
            <b>
              <Color>Edu</Color>
            </b>
            lastic
          </StyledTitle>
          <QuestionContentArea>{renderClassStudentsResponse}</QuestionContentArea>
        </PrintPreviewContainer>
      </PrintPreviewBack>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      testActivity: getTestActivitySelector(state),
      assignmentIdClassId: getAssignmentClassIdSelector(state),
      classResponse: getClassResponseSelector(state),
      classStudentResponse: getClassStudentResponseSelector(state),
      additionalData: getAdditionalDataSelector(state)
    }),
    {
      fetchPrintPreviewEssentialsAction
    }
  )
);

export default enhance(PrintPreview);

/* eslint-disable react/require-default-props */
PrintPreview.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  classResponse: PropTypes.object,
  classStudentResponse: PropTypes.object,
  testActivity: PropTypes.array,
  additionalData: PropTypes.object,
  loadClassStudentResponse: PropTypes.func,
  creating: PropTypes.object,
  assignmentIdClassId: PropTypes.object,
  loadClassResponses: PropTypes.func
};

const QuestionContentArea = styled.div`
  .test-item-col {
    width: 100%;
    .question-container {
      flex-wrap: wrap;

      @media (max-width: ${mobileWidthMax}) {
        flex-direction: row;
      }
      .responseboxContainer {
        width: calc(100% - 30px);
        +div {
          width: 100%;
        }
      }
      .question-content-wrapper {
        > div {
          width: 100%;
        }
        .sort-list-wrapper {
          >div >div {
            margin: auto;
          }
        }
      }
    }
    .question-tab-container {
      padding: 0!important;
      .multiple-choice-wrapper {
        .multiplechoice-optionlist {
          >div {
            //margin-bottom: 5px!important;
          }
        }
      }
      svg.delete-drag-drop {
        display: none;
      }
      .chart-wrapper {
        svg g {
          line: {
            fill: none;
          }
        }
      }
    }
    .classification-preview {
      overflow: hidden!important;
      .classification-preview-wrapper {
        align-items: center;
        overflow: hidden!important;
        >div {
          max-width: 100%;
          width: 100%;
        }
        .choice-items-wrapper {
          flex-direction: column!important;
        }
        .classification-preview-wrapper-response {
          >div {
            height: auto!important;
            width: auto!important;
            >div {
              page-break-inside: avoid;
            }
          }
          div {
            position: relative!important;
            transform: none!important;
            text-align: center;
          }
        }
        .answer-draggable-wrapper {
          width: 100%!important;
        }
      }
    }
  }
`;
