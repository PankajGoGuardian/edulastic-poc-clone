import { MainContentWrapper } from "@edulastic/common";
import { IconClockDashboard } from "@edulastic/icons";
import { Layout, Spin } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getEnrollClassAction, setFilterClassAction } from "../../ManageClass/ducks";
import Header from "../../sharedComponents/Header";
import AssignmentContainer from "./Container";
import SubHeader from "./SubHeader";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;

const Assignments = ({ activeClasses, loadAllClasses, loading, currentChild }) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");

  useEffect(() => {
    loadAllClasses();
  }, [currentChild]);

  if (loading) return <Spin />;

  return (
    <Wrapper>
      <Header
        titleIcon={IconClockDashboard}
        titleText="common.dashboardTitle"
        classSelect
        showActiveClass={false}
        classList={activeEnrolledClasses}
      />
      <MainContentWrapper>
        <SubHeader />
        <AssignmentContainer />
      </MainContentWrapper>
    </Wrapper>
  );
};

export default connect(
  state => ({
    allClasses: state.studentEnrollClassList.allClasses,
    activeClasses: state.studentEnrollClassList.filteredClasses,
    loading: state.studentEnrollClassList.loading,
    currentChild: state?.user?.currentChild
  }),
  {
    loadAllClasses: getEnrollClassAction,
    setFilterClass: setFilterClassAction
  }
)(Assignments);
