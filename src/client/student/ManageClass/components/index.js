import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";
// components
import ManageHeader from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import ManageClassContainer from "./Container";
import { getEnrollClassAction, setFilterClassAction } from "../ducks";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;
const ContentWrapper = styled.div`
  padding: 0px 40px;
`;

const ManageClass = ({ allClasses, filterClasses, loadAllClasses, loading, setClassList }) => {
  useEffect(() => {
    loadAllClasses();
  }, []);
  const [showClass, setShowClass] = useState("ACTIVE");
  if (loading) return <Spin />;
  return (
    <Wrapper>
      <ManageHeader
        titleText="common.manageClassTitle"
        classSelect={false}
        showActiveClass={true}
        classList={allClasses}
        setClassList={setClassList}
        setShowClass={setShowClass}
      />
      <ContentWrapper>
        <SubHeader />
        <ManageClassContainer classList={filterClasses} loading={loading} showClass={showClass} />
      </ContentWrapper>
    </Wrapper>
  );
};

export default connect(
  state => ({
    allClasses: state.studentEnrollClassList.allClasses,
    filterClasses: state.studentEnrollClassList.filteredClasses,
    loading: state.studentEnrollClassList.loading
  }),
  {
    loadAllClasses: getEnrollClassAction,
    setClassList: setFilterClassAction
  }
)(ManageClass);
