import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";

// components
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction } from "../../ManageClass/ducks";

const Wrapper = styled(Layout)`
  width: 100%;
`;

const Assignments = ({ allClasses, loadAllClasses, loading }) => {
  useEffect(() => {
    loadAllClasses();
  }, []);
  if (loading) return <Spin />;
  return (
    <Wrapper>
      <Header titleText="common.dashboardTitle" classSelect={true} showActiveClass={false} classList={allClasses} />
      <SubHeader />
      <AssignmentContainer />
    </Wrapper>
  );
};

export default connect(
  state => ({
    allClasses: state.studentEnrollClassList.allClasses,
    loading: state.studentEnrollClassList.loading
  }),
  {
    loadAllClasses: getEnrollClassAction
  }
)(Assignments);
