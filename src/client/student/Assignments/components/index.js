import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";
import { isEmpty } from "lodash";
// components
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction } from "../../ManageClass/ducks";
import { changeClassAction } from "../../Login/ducks";

const Wrapper = styled(Layout)`
  width: 100%;
`;

const Assignments = ({ activeClasses, loadAllClasses, changeClass, loading, location }) => {
  useEffect(() => {
    loadAllClasses();
  }, []);
  if (loading) return <Spin />;
  const { classItem = {} } = location;
  const activeEnrolledClasses = activeClasses.filter(c => c.status === "1");
  if (!isEmpty(classItem)) {
    const { _id } = classItem;
    changeClass(_id);
    const isExist = activeEnrolledClasses.find(item => item._id === classItem._id);
    if (!isExist) {
      activeEnrolledClasses.push(classItem);
    }
  }
  return (
    <Wrapper>
      <Header
        titleText="common.dashboardTitle"
        classSelect={true}
        showActiveClass={false}
        classList={activeEnrolledClasses}
      />
      <SubHeader />
      <AssignmentContainer />
    </Wrapper>
  );
};

export default connect(
  state => ({
    // allClasses: state.studentEnrollClassList.allClasses,
    activeClasses: state.studentEnrollClassList.filteredClasses,
    loading: state.studentEnrollClassList.loading
  }),
  {
    loadAllClasses: getEnrollClassAction,
    changeClass: changeClassAction
  }
)(Assignments);
