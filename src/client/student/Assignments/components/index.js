import { MainContentWrapper, MainHeader, EduButton } from "@edulastic/common";
import { IconClockDashboard, IconHangouts } from "@edulastic/icons";
import { white, themeColor } from "@edulastic/colors";
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
  const [selectedGroupId, selectGroupId] = useState("");

  const selectedGroup = classListWithHangouts.find(c => c._id === selectedGroupId);
  const hangoutLink = selectedGroup?.hangoutLink;

  useEffect(() => {
    loadAllClasses();
  }, [currentChild]);

  if (loading) return <Spin />;

  return (
    <Wrapper>
      <HangoutsModal
        isStudent
        visible={showHangoutsModal}
        onCancel={() => setShowHangoutsModal(false)}
        title="Join Hangouts"
        onSelect={selectGroupId}
        selected={selectedGroup}
        classList={classListWithHangouts}
        description="Select the class that you want to join for the Hangouts session."
        hangoutLink={hangoutLink}
      />
      <MainHeader Icon={IconClockDashboard} headingText={t("common.dashboardTitle")}>
        <Row type="flex" align="middle">
          {!!classListWithHangouts.length && (
            <StyledEduButton
              height="40px"
              style={{ "margin-right": "20px" }}
              isGhost
              onClick={() => setShowHangoutsModal(true)}
            >
              <IconHangouts height={23} width={20} />
              Join Hangouts
            </StyledEduButton>
          )}
          <StudentSlectCommon />
          <ClassSelect t={t} classList={activeEnrolledClasses} showAllClassesOption />
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

const StyledEduButton = styled(EduButton)`
  margin-left: 10px;
  span {
    margin: 0 15px;
  }
  svg {
    .b {
      fill: ${white};
    }
  }
  &:hover,
  &:focus {
    .b {
      fill: ${themeColor};
    }
  }
`;
