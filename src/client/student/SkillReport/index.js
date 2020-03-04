import React, { useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin } from "antd";

import Header from "../sharedComponents/Header";
import StudentProfileReportsFilters from "../../author/Reports/subPages/studentProfileReport/common/components/filter/StudentProfileReportsFilters";
import StudentMasteryProfile from "../../author/Reports/subPages/studentProfileReport/StudentMasteryProfile";

import MainContainer from "../styled/mainContainer";
import { getUserId, getUserName, getClasses, getCurrentGroup } from "../Login/ducks";
import {
  getEnrollClassAction,
  getAllClassesSelector,
  getFilteredClassesSelector,
  getLoaderSelector,
  resetEnrolledClassAction
} from "../ManageClass/ducks";
import NoDataNotification from "../../common/components/NoDataNotification";
import { LoaderConainer } from "./styled";
import { IconBarChart } from "@edulastic/icons";

const SkillReportContainer = ({
  flag,
  userId,
  userName,
  classId,
  loadAllClasses,
  activeClasses,
  userClasses,
  loading,
  resetEnrolledClassAction,
  currentChild
}) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");
  const fallbackClassId = !!activeEnrolledClasses[0] ? activeEnrolledClasses[0]._id : "";

  const getTermId = (_classes, _classId) => _classes.find(c => c._id === _classId).termId || "";

  const settings = {
    requestFilters: {
      termId: getTermId(userClasses, classId || fallbackClassId)
    },
    selectedStudent: {
      key: userId,
      title: userName
    }
  };

  useEffect(() => {
    resetEnrolledClassAction();
    loadAllClasses();
  }, [currentChild]);

  useEffect(() => {
    if (classId) {
      settings.requestFilters.termId = getTermId(userClasses, classId);
    }
  }, [classId, currentChild]);

  return (
    <MainContainer flag={flag}>
      <Header
        flag={flag}
        titleText="common.skillReportTitle"
        titleIcon={IconBarChart}
        classSelect
        showActiveClass={false}
        classList={activeEnrolledClasses}
        showAllClassesOption={false}
      />
      {loading ? (
        <LoaderConainer>
          <Spin />
        </LoaderConainer>
      ) : !settings.requestFilters.termId ? (
        <LoaderConainer>
          <NoDataNotification heading={"No Skill Mastery"} description={"You don't have any Skill Mastery."} />
        </LoaderConainer>
      ) : (
        <StyledDiv>
          <StudentProfileReportsFilters
            onGoClick={() => {}}
            location={{ pathname: userId, search: `termId=${settings.requestFilters.termId}` }}
            style={{ display: "none" }}
            performanceBandRequired={true}
            standardProficiencyRequired={true}
          />
          <StudentMasteryProfile settings={settings} />
        </StyledDiv>
      )}
    </MainContainer>
  );
};

export default connect(
  state => ({
    flag: state.ui.flag,
    classId: getCurrentGroup(state),
    allClasses: getAllClassesSelector(state),
    activeClasses: getFilteredClassesSelector(state),
    userClasses: getClasses(state),
    userName: getUserName(state),
    userId: getUserId(state),
    currentChild: state?.user?.currentChild,
    loading: getLoaderSelector(state)
  }),
  {
    loadAllClasses: getEnrollClassAction,
    resetEnrolledClassAction
  }
)(SkillReportContainer);

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  classId: PropTypes.node.isRequired
};

const StyledDiv = styled.div`
  padding: 0px 20px;
`;
