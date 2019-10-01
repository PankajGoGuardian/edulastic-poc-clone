import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";
import { isEmpty, uniqBy } from "lodash";

// components
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction } from "../../ManageClass/ducks";

const Wrapper = styled(Layout)`
  width: 100%;
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
      <SubHeader />
      <AssignmentContainer />
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
