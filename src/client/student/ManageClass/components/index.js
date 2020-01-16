import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";
// components
import ManageClassContainer from "./Container";
import { getEnrollClassAction, setFilterClassAction } from "../ducks";
import { joinClassAction } from "../ducks";
import { getUser } from "../../../author/src/selectors/user";
import { mobileWidthMax } from "@edulastic/colors";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;
const ContentWrapper = styled.div`
  padding: 0px 40px;
  @media (max-width: ${mobileWidthMax}) {
    padding: 0px 10px;
  }
`;

const ManageClass = ({ allClasses, filterClasses, loadAllClasses, loading, setClassList, joinClass, studentData }) => {
  useEffect(() => {
    loadAllClasses();
  }, []);
  const [showClass, setShowClass] = useState(true);
  if (loading) return <Spin />;
  return (
    <Wrapper>
      <ContentWrapper>
        <ManageClassContainer
          classList={filterClasses}
          loading={loading}
          showClass={showClass}
          joinClass={joinClass}
          studentData={studentData}
          classSelect={false}
          showActiveClass={true}
          allClassList={allClasses}
          setClassList={setClassList}
          setShowClass={setShowClass}
        />
      </ContentWrapper>
    </Wrapper>
  );
};

export default connect(
  state => ({
    allClasses: state.studentEnrollClassList.allClasses,
    filterClasses: state.studentEnrollClassList.filteredClasses,
    loading: state.studentEnrollClassList.loading,
    studentData: getUser(state)
  }),
  {
    loadAllClasses: getEnrollClassAction,
    setClassList: setFilterClassAction,
    joinClass: joinClassAction
  }
)(ManageClass);
