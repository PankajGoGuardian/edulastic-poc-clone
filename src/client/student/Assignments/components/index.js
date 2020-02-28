import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";
// components
import { smallDesktopWidth, mobileWidthMax } from "@edulastic/colors";
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction, setFilterClassAction } from "../../ManageClass/ducks";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;
const ContentWrapper = styled.div`
  padding: 20px 40px;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 20px 30px;
  }
  @media (max-width: ${mobileWidthMax}) {
    padding: 10px 20px;
  }
`;


const Assignments = ({ activeClasses, loadAllClasses, changeClass, loading, location, currentChild }) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");

  useEffect(() => {
    loadAllClasses();
  }, [currentChild]);

  if (loading) return <Spin />;

  return (
    <Wrapper>
      <Header
        titleText="common.dashboardTitle"
        classSelect
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
    allClasses: state.studentEnrollClassList.allClasses,
    activeClasses: state.studentEnrollClassList.filteredClasses,
    loading: state.studentEnrollClassList.loading,
    currentChild: state ?.user ?.currentChild,
  }),
  {
    loadAllClasses: getEnrollClassAction,
    setFilterClass: setFilterClassAction
  }
)(Assignments);
