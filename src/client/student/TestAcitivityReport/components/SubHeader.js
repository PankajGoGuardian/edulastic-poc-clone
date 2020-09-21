import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Col } from "antd";

import { withRouter } from "react-router";
import Breadcrumb from "../../sharedComponents/Breadcrumb";
import QuestionSelect from "./QuestionSelect";

const TestActivitySubHeader = ({ title, questionLabel, isDocBased, location, isCliUser, hideQuestionSelect }) => {
  const { fromRecommendations, playListId } = location;
  let breadcrumbData = fromRecommendations
    ? [
        { title: "My Playlist", to: `/home/playlist/${playListId}` },
        { title: "Recommendation", to: `/home/playlist/${playListId}/recommendations` },
        { title }
      ]
    : [{ title: "GRADES", to: "/home/grades" }, { title }];

  if (questionLabel) {
    breadcrumbData = [...breadcrumbData, { title: questionLabel }];
  }

  return (
    <Container isDocBased={isDocBased}>
      <BreadcrumbContainer>{!isCliUser && <Breadcrumb data={breadcrumbData} />}</BreadcrumbContainer>
      {!isDocBased && !hideQuestionSelect && (
        <Col>
          <QuestionSelect />
        </Col>
      )}
    </Container>
  );
};

export default withRouter(TestActivitySubHeader);

TestActivitySubHeader.propTypes = {
  title: PropTypes.string,
  hideQuestionSelect: PropTypes.bool
};

TestActivitySubHeader.defaultProps = {
  title: "Test",
  hideQuestionSelect: false
};

const Container = styled.div`
  padding: ${props => (props.isDocBased ? "10px 25px" : "0px")};
  display: flex;
`;

const BreadcrumbContainer = styled.div`
  flex: 1;
`;
