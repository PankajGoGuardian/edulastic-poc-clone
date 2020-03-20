import React, { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { keyBy, get } from "lodash";
import PropTypes from "prop-types";
import { Button } from "antd";
import { AnswerContext } from "@edulastic/common";
import { test as testConstants } from "@edulastic/constants";
import AssignmentContentWrapper from "../../styled/assignmentContentWrapper";
import TestItemPreview from "../../../assessment/components/TestItemPreview";
import { getItemSelector, itemHasUserWorkSelector } from "../../sharedDucks/TestItem";
import TestPreviewModal from "../../../author/Assignments/components/Container/TestPreviewModal";
import { getQuestionsSelector } from "../../../author/sharedDucks/questions";
import { getEvaluationSelector } from "../../../assessment/selectors/answers";

const { releaseGradeLabels } = testConstants;

const ReportListContent = ({
  item = {},
  flag,
  testActivityById,
  hasUserWork,
  passages = [],
  questions,
  evaluation
}) => {
  const [showModal, setModal] = useState(false);
  const { releaseScore = "" } = testActivityById;
  const resources = keyBy(get(item, "data.resources", []), "id");

  let allWidgets = { ...questions, ...resources };
  let itemRows = get(item, "rows", []);
  if (item.passageId && passages.length) {
    const passage = passages.find(p => p._id === item.passageId) || {};
    itemRows = [passage.structure, ...itemRows];
    const passageData = keyBy(passage.data, "id");
    // we store userWork based on testItemId
    // so need to pass testItemId to the passage to show proper highlights (EV-10361)
    Object.keys(passageData).forEach(key => {
      passageData[key].testItemId = item._id;
    });
    allWidgets = { ...allWidgets, ...passageData };
  }
  const preview = releaseScore === releaseGradeLabels.WITH_ANSWERS ? "show" : "check";
  const closeModal = () => setModal(false);
  const hasCollapseButtons =
    itemRows.length > 1 && itemRows.flatMap(_item => _item.widgets).find(_item => _item.widgetType === "resource");
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
              hideHintButton
              showExplanation
              showCollapseBtn
              disableResponse
              isStudentReport
              viewComponent="studentReport"
              evaluation={evaluation}
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
          showScratchPad={hasUserWork && showModal}
          isShowStudentWork
          LCBPreviewModal
          isStudentReport
        />
      </AnswerContext.Provider>
    </AssignmentsContent>
  );
};
export default connect(
  state => ({
    item: getItemSelector(state),
    questions: getQuestionsSelector(state),
    passages: state.studentReport.passages,
    hasUserWork: itemHasUserWorkSelector(state),
    testActivityById: get(state, `[studentReport][testActivity]`, {}),
    evaluation: getEvaluationSelector(state, {})
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
  margin: ${props => (props.hasCollapseButtons ? "0px 30px 30px 45px" : "20px 0px")};
`;
