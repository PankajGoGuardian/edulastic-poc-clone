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
import { changeClassAction, logoutAction } from "../../Login/ducks";
import { smallDesktopWidth } from "@edulastic/colors";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;
const ContentWrapper = styled.div`
  padding: 0px 40px;
  @media (max-width: ${smallDesktopWidth}) {
    padding: 0px 20px 0px 30px;
  }
`;

const Assignments = ({ activeClasses, allClasses, loadAllClasses, changeClass, loading, location, logout }) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");

  // location is available as prop when we are navigating through link from student manage class
  useEffect(() => {
    loadAllClasses();
  }, []);

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
    allClasses: state.studentEnrollClassList.allClasses,
    activeClasses: state.studentEnrollClassList.filteredClasses,
    loading: state.studentEnrollClassList.loading
  }),
  {
    loadAllClasses: getEnrollClassAction,
    changeClass: changeClassAction,
    logout: logoutAction
  }
)(Assignments);
