import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";

// components
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction } from "../../ManageClass/ducks";
import { smallDesktopWidth, mobileWidthMax } from "@edulastic/colors";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;
const ContentWrapper = styled.div`
  padding: 0px 40px;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 0px 20px 0px 30px;
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 0px 10px;
  }
`;

const Assignments = ({ activeClasses, loadAllClasses, loading, location, allClasses }) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");

  useEffect(() => {
    loadAllClasses();
  }, []);

  if (loading) return <Spin />;

  return (
    <Wrapper>
      <Header
        titleText="common.reportsTitle"
        classSelect={true}
        showActiveClass={false}
        classList={activeEnrolledClasses}
      />
      <ContentWrapper>
        <SubHeader />
        <AssignmentContainer />
      </ContentWrapper>
    </Wrapper>
  );
};

export default connect(
  state => ({
    activeClasses: state.studentEnrollClassList.filteredClasses,
    loading: state.studentEnrollClassList.loading,
    allClasses: state.studentEnrollClassList.allClasses
  }),
  {
    loadAllClasses: getEnrollClassAction
  }
)(Assignments);
