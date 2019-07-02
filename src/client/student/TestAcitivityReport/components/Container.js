import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { keyBy, get } from "lodash";
import PropTypes from "prop-types";
import { AnswerContext } from "@edulastic/common";
import { test as testConstants } from "@edulastic/constants";
import AssignmentContentWrapper from "../../styled/assignmentContentWrapper";
import TestItemPreview from "../../../assessment/components/TestItemPreview";
import { getItemSelector } from "../../sharedDucks/TestItem";
import { previewShowAnswerAction } from "../../../author/TestPage/ducks";
const { releaseGradeLabels } = testConstants;
const ReportListContent = ({ item = {}, flag, testActivityById, showAnswer }) => {
  useEffect(() => {
    // TODO show answer to the user
    // if (item) showAnswer({ id: item._id });
  }, [item]);
  const { releaseScore = "" } = testActivityById;
  const questions = keyBy(get(item, "data.questions", []), "id");
  return (
    <AssignmentsContent flag={flag}>
      <AssignmentContentWrapper>
        <Wrapper>
          <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
            <TestItemPreview
              cols={item.rows || []}
              view={"preview"}
              questions={questions}
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              releaseScore={releaseScore}
              disableResponse
              isStudentReport
            />
          </AnswerContext.Provider>
        </Wrapper>
      </AssignmentContentWrapper>
    </AssignmentsContent>
  );
};
export default connect(
  (state, props) => ({
    item: getItemSelector(state),
    testActivityById: get(state, `[studentReport][byId][${props.reportId}]`, {})
  }),
  {
    showAnswer: previewShowAnswerAction
  }
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
