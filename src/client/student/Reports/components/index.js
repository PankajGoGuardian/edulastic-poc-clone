import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Layout, Spin } from "antd";

// components
import { IconReport } from "@edulastic/icons";
import { MainContentWrapper } from "@edulastic/common";
import { withNamespaces } from "react-i18next";
import Header from "../../sharedComponents/Header";
import SubHeader from "./SubHeader";
import AssignmentContainer from "./Container";
import { getEnrollClassAction } from "../../ManageClass/ducks";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;

const Assignments = ({ activeClasses, loadAllClasses, loading, currentChild, isCliUser, t }) => {
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
        hideSideMenu={isCliUser}
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
      currentChild: state?.user?.currentChild,
      isCliUser: state?.user?.isCliUser
    }),
    {
      loadAllClasses: getEnrollClassAction
    }
  )(Assignments)
);
