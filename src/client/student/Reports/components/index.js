import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";

// components
import { smallDesktopWidth, mobileWidthMax } from "@edulastic/colors";
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction } from "../../ManageClass/ducks";
import { IconReport } from "@edulastic/icons";
import { MainContentWrapper } from "@edulastic/common";
import { withNamespaces } from "react-i18next";

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

const Assignments = ({ activeClasses, loadAllClasses, loading, currentChild, t }) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");

  useEffect(() => {
    loadAllClasses();
  }, [currentChild]);

  if (loading) return <Spin />;

  return (
    <Wrapper>
      <Header
        titleText={t("common.reportsTitle")}
        titleIcon={IconReport}
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

export default withNamespaces("header")(
  connect(
    state => ({
      activeClasses: state.studentEnrollClassList.filteredClasses,
      loading: state.studentEnrollClassList.loading,
      allClasses: state.studentEnrollClassList.allClasses,
      currentChild: state?.user?.currentChild
    }),
    {
      loadAllClasses: getEnrollClassAction
    }
  )(Assignments)
);
