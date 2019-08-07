import React, { useEffect, useState } from "react";
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
const { releaseGradeLabels } = testConstants;

const ReportListContent = ({ item = {}, flag, testActivityById, hasUserWork }) => {
  const [showModal, setModal] = useState(false);
  const { releaseScore = "" } = testActivityById;
  const questions = keyBy([...get(item, "data.questions", []), ...get(item, "data.resources", [])], "id");
  const preview = releaseScore === releaseGradeLabels.WITH_ANSWERS ? "show" : "clear";

  const closeModal = () => setModal(false);

  return (
    <AssignmentsContent flag={flag}>
      <AssignmentContentWrapper>
        <Wrapper>
          {hasUserWork && <Button onClick={() => setModal(true)}> Show My Work </Button>}
          <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
            <TestItemPreview
              view="preview"
              preview={preview}
              cols={item.rows || []}
              questions={questions}
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              releaseScore={releaseScore}
              showFeedback={true}
              showCollapseBtn
              disableResponse
              isStudentReport
            />
          </AnswerContext.Provider>
        </Wrapper>
      </AssignmentContentWrapper>
      <TestPreviewModal
        isModalVisible={showModal}
        hideModal={closeModal}
        test={{ testItems: [item] }}
        LCBPreviewModal
      />
    </AssignmentsContent>
  );
};
export default connect(
  state => ({
    item: getItemSelector(state),
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
    margin: 30px 30px;
  }
  @media (max-width: 1060px) {
    padding: 1.3rem 2rem 5rem 2rem;
  }
  @media (max-width: 480px) {
    padding: 1rem 1rem 0rem 1rem;
  }
`;
