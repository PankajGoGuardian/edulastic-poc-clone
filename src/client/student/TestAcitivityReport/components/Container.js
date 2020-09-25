import React, { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { keyBy, get } from "lodash";
import PropTypes from "prop-types";
import { Button } from "antd";
import { AnswerContext } from "@edulastic/common";
import { test as testConstants } from "@edulastic/constants";
import Work from "../../../author/AssessmentPage/components/Worksheet/Worksheet";
import AssignmentContentWrapper from "../../styled/assignmentContentWrapper";
import TestItemPreview from "../../../assessment/components/TestItemPreview";
import {
  getItemSelector,
  itemHasUserWorkSelector,
  questionActivityFromFeedbackSelector,
  userWorkFromQuestionActivitySelector
} from "../../sharedDucks/TestItem";
import { getTestEntitySelector } from "../../../author/TestPage/ducks";
import TestPreviewModal from "../../../author/Assignments/components/Container/TestPreviewModal";
import { getQuestionsArraySelector, getQuestionsSelector } from "../../../author/sharedDucks/questions";
import { getEvaluationSelector } from "../../../assessment/selectors/answers";

const { releaseGradeLabels } = testConstants;

const ReportListContent = ({
  item = {},
  flag,
  test,
  testActivityById,
  hasUserWork,
  passages = [],
  questions,
  questionsById,
  evaluation,
  questionActivity,
  userWork
}) => {
  const { isDocBased, docUrl, annotations, pageStructure, freeFormNotes = {} } = test;
  if (isDocBased) {
    const props = {
      docUrl,
      annotations,
      questions,
      freeFormNotes,
      questionsById,
      pageStructure
    };

    return <Work key="review" review {...props} viewMode="report" />;
  }

  const [showModal, setModal] = useState(false);
  const { releaseScore = "" } = testActivityById;
  const resources = keyBy(get(item, "data.resources", []), "id");

  let allWidgets = { ...questionsById, ...resources };
  let itemRows = get(item, "rows", []);
  let passage = {};
  if (item.passageId && passages.length) {
    passage = passages.find(p => p._id === item.passageId) || {};
    itemRows = [passage.structure, ...itemRows];
    const passageData = keyBy(passage.data, "id");
    // we store userWork based on testItemId
    // so need to pass testItemId to the passage to show proper highlights (EV-10361)
    Object.keys(passageData).forEach(key => {
      passageData[key].testItemId = item._id;
    });
    allWidgets = { ...allWidgets, ...passageData };
  }
  const passageId = passage._id;
  const preview = releaseScore === releaseGradeLabels.WITH_ANSWERS ? "show" : "check";
  const closeModal = () => setModal(false);
  const hasCollapseButtons =
    itemRows?.length > 1 && itemRows.flatMap(_item => _item?.widgets)?.find(_item => _item?.widgetType === "resource");

  const { scratchPad: { attachments } = {} } = questionActivity;

  return (
    <AssignmentsContent flag={flag} hasCollapseButtons={hasCollapseButtons}>
      <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
        <AssignmentContentWrapper hasCollapseButtons={hasCollapseButtons}>
          <Wrapper>
            {hasUserWork && <Button onClick={() => setModal(true)}> Show My Work </Button>}

            <TestItemPreview
              view="preview"
              preview={preview}
              cols={itemRows || []}
              questions={allWidgets}
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              releaseScore={releaseScore}
              showFeedback
              isGrade
              showCollapseBtn
              disableResponse
              isStudentReport
              viewComponent="studentReport"
              evaluation={evaluation}
              passageTestItemID={passageId}
              history={userWork}
              attachments={attachments}
              itemLevelScoring={item?.itemLevelScoring}
            />
            {/* we may need to bring hint button back */}
            {/* <PaddingDiv>
              <Hints questions={get(item, [`data`, `questions`], [])} />
            </PaddingDiv> */}
          </Wrapper>
        </AssignmentContentWrapper>
        <TestPreviewModal
          isModalVisible={showModal}
          closeTestPreviewModal={closeModal}
          passages={passages}
          test={{ itemGroups: [{ items: [item] }] }}
          showScratchPad={userWork && showModal}
          isShowStudentWork
          LCBPreviewModal
          isStudentReport
          studentReportModal
          questionActivities={[questionActivity]}
          testActivityId={testActivityById._id}
        />
      </AnswerContext.Provider>
    </AssignmentsContent>
  );
};
export default connect(
  state => ({
    item: getItemSelector(state),
    test: getTestEntitySelector(state),
    questions: getQuestionsArraySelector(state),
    questionsById: getQuestionsSelector(state),
    passages: state.studentReport.passages,
    hasUserWork: itemHasUserWorkSelector(state),
    testActivityById: get(state, `[studentReport][testActivity]`, {}),
    evaluation: getEvaluationSelector(state, {}),
    questionActivity: questionActivityFromFeedbackSelector(state),
    userWork: userWorkFromQuestionActivitySelector(state)
  }),
  null
)(ReportListContent);

ReportListContent.propTypes = {
  flag: PropTypes.bool.isRequired,
  item: PropTypes.array
};

ReportListContent.defaultProps = {
  item: []
};

const Wrapper = styled.div`
  padding: 5px;
`;

const AssignmentsContent = styled.div`
  border-radius: 10px;
  z-index: 0;
  position: relative;
  margin: ${props => (props.hasCollapseButtons ? "0px 30px 30px 45px" : "0px 0px 20px")};
`;
