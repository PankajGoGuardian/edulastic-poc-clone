import React, { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { keyBy, get } from "lodash";
import PropTypes from "prop-types";
import { Button } from "antd";
import { AnswerContext, PaddingDiv, Hints } from "@edulastic/common";
import { test as testConstants } from "@edulastic/constants";
import AssignmentContentWrapper from "../../styled/assignmentContentWrapper";
import TestItemPreview from "../../../assessment/components/TestItemPreview";
import { getItemSelector, itemHasUserWorkSelector } from "../../sharedDucks/TestItem";
import TestPreviewModal from "../../../author/Assignments/components/Container/TestPreviewModal";
const { releaseGradeLabels } = testConstants;

const ReportListContent = ({ item = {}, flag, testActivityById, hasUserWork, passages = [] }) => {
  const [showModal, setModal] = useState(false);
  const { releaseScore = "" } = testActivityById;
  const questions = keyBy(get(item, "data.questions", []), "id");
  const resources = keyBy(get(item, "data.resources", []), "id");

  let allWidgets = { ...questions, ...resources };
  let itemRows = get(item, "rows", []);
  if (item.passageId && passages.length) {
    const passage = passages.find(p => p._id === item.passageId) || {};
    itemRows = [passage.structure, ...itemRows];
    allWidgets = { ...allWidgets, ...keyBy(passage.data, "id") };
  }
  const preview = releaseScore === releaseGradeLabels.WITH_ANSWERS ? "show" : "clear";
  const closeModal = () => setModal(false);
  const hasCollapseButtons =
    itemRows.length > 1 && itemRows.flatMap(item => item.widgets).find(item => item.widgetType === "resource");
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
              showFeedback={true}
              showCollapseBtn
              disableResponse
              isStudentReport
              viewComponent="studentReport"
            />
            <PaddingDiv>
              <Hints questions={get(item, [`data`, `questions`], [])} />
            </PaddingDiv>
          </Wrapper>
        </AssignmentContentWrapper>
        <TestPreviewModal
          isModalVisible={showModal}
          closeTestPreviewModal={closeModal}
          test={{ testItems: [item] }}
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
    passages: state.studentReport.passages,
    hasUserWork: itemHasUserWorkSelector(state),
    testActivityById: get(state, `[studentReport][testActivity]`, {})
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
  padding: 1rem 0rem;
`;

const AssignmentsContent = styled.div`
  border-radius: 10px;
  z-index: 0;
  position: relative;
  @media (min-width: 1200px) {
    margin: ${props => (props.hasCollapseButtons ? "0px 30px 30px 30px" : "30px 30px")};
  }
  @media (max-width: 1060px) {
    padding: 1.3rem 2rem 5rem 2rem;
  }
  @media (max-width: 480px) {
    padding: 1rem 1rem 0rem 1rem;
  }
`;
