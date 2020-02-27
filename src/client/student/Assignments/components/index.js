import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";
import { isEmpty } from "lodash";
// components
import { smallDesktopWidth, mobileWidthMax } from "@edulastic/colors";
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction } from "../../ManageClass/ducks";
import { changeClassAction, logoutAction } from "../../Login/ducks";

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

  // location is available as prop when we are navigating through link from student manage class
  useEffect(() => {
    loadAllClasses();
  }, [currentChild]);

  if (loading) return <Spin />;
  const { classItem = {} } = location;

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
    changeClass: changeClassAction,
    logout: logoutAction
  }
)(Assignments);
