import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Col } from "antd";

import { withRouter } from "react-router";
import Breadcrumb from "../../sharedComponents/Breadcrumb";
import QuestionSelect from "./QuestionSelect";

const TestActivitySubHeader = ({ title, isDocBased, location, isCliUser }) => {
  const { fromRecommendations, playListId } = location;
  const breadcrumbData = fromRecommendations
    ? [
        { title: "My Playlist", to: `/home/playlist/${playListId}` },
        { title: "Recommendation", to: `/home/playlist/${playListId}/recommendations` },
        { title }
      ]
    : [{ title: "GRADES", to: "/home/grades" }, { title }];
  return (
    <Container isDocBased={isDocBased}>
      <BreadcrumbContainer>{!isCliUser && <Breadcrumb data={breadcrumbData} />}</BreadcrumbContainer>
      {!isDocBased && (
        <QuestionSelectDesktop>
          <QuestionSelect />
        </QuestionSelectDesktop>
      )}
    </Container>
  );
};

export default withRouter(TestActivitySubHeader);

TestActivitySubHeader.propTypes = {
  title: PropTypes.string
};

TestActivitySubHeader.defaultProps = {
  title: "Test"
};

const Container = styled.div`
  padding: ${props => (props.isDocBased ? "10px 25px" : "0px")};
  display: flex;
`;

const QuestionSelectDesktop = styled(Col)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const BreadcrumbContainer = styled.div`
  flex: 1;
`;
