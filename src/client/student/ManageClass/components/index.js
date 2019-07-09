import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout } from "antd";
// components
import ManageHeader from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import ManageClassContainer from "./Container";
import { getEnrollClassAction } from "../ducks";

const Wrapper = styled(Layout)`
  width: 100%;
`;

const ManageClass = ({ enrollClassList, loadEnrollClasses, loading }) => {
  useEffect(() => {
    loadEnrollClasses();
  }, []);
  return (
    <Wrapper>
      <ManageHeader titleText="common.manageClassTitle" classSelect={false} showActiveClass={true} />
      <SubHeader />
      <ManageClassContainer classList={enrollClassList} loading={loading} />
    </Wrapper>
  );
};

export default connect(
  state => ({
    enrollClassList: state.studentEnrollClassList.enrollClasslist,
    loading: state.studentEnrollClassList.loading
  }),
  {
    loadEnrollClasses: getEnrollClassAction
  }
)(ManageClass);
