import { MainContentWrapper, MainHeader, EduButton } from "@edulastic/common";
import { IconClockDashboard } from "@edulastic/icons";
import { Row, Layout, Spin } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getEnrollClassAction, setFilterClassAction } from "../../ManageClass/ducks";
import ClassSelect, { StudentSlectCommon } from "../../sharedComponents/ClassSelector";
import AssignmentContainer from "./Container";
import SubHeader from "./SubHeader";
import HangoutsModal from "./HangoutsModal";
import { withNamespaces } from "react-i18next";

const Wrapper = styled(Layout)`
  width: 100%;
  background-color: ${props => props.theme.sectionBackgroundColor};
`;

const Assignments = ({ activeClasses, loadAllClasses, loading, currentChild, t }) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");

  const classListWithHangouts = activeEnrolledClasses.filter(c => c.hangoutLink);

  const [showHangoutsModal, setShowHangoutsModal] = useState(false);

  useEffect(() => {
    loadAllClasses();
  }, [currentChild]);

  if (loading) return <Spin />;

  return (
    <Wrapper>
      <HangoutsModal
        title="Join Hangouts"
        visible={showHangoutsModal}
        classList={classListWithHangouts}
        setShowHangoutsModal={setShowHangoutsModal}
        footer={null}
        onCancel={() => setShowHangoutsModal(false)}
      />
      <MainHeader Icon={IconClockDashboard} headingText={t("common.dashboardTitle")}>
        <Row type="flex" align="middle">
          <StudentSlectCommon />
          <ClassSelect t={t} classList={activeEnrolledClasses} showAllClassesOption />
          {classListWithHangouts.length && (
            <EduButton height="40px" style={{ "margin-left": "10px" }} onClick={() => setShowHangoutsModal(true)}>
              Join Hangouts
            </EduButton>
          )}
        </Row>
      </MainHeader>
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
      allClasses: state.studentEnrollClassList.allClasses,
      activeClasses: state.studentEnrollClassList.filteredClasses,
      loading: state.studentEnrollClassList.loading,
      currentChild: state?.user?.currentChild
    }),
    {
      loadAllClasses: getEnrollClassAction,
      setFilterClass: setFilterClassAction
    }
  )(Assignments)
);
