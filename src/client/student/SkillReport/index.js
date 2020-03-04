import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { IconBarChart } from "@edulastic/icons";
import Header from "../sharedComponents/Header";
import StudentMasteryProfile from "../../author/Reports/subPages/studentProfileReport/StudentMasteryProfile";
import { getSPRFilterDataRequestAction } from "../../author/Reports/subPages/studentProfileReport/common/filterDataDucks";
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

const getTermId = (_classes, _classId) => _classes.find(c => c._id === _classId).termId || "";

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
  currentChild,
  getSPRFilterDataRequest
}) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [settings, setSettings] = useState({
    requestFilters: {
      termId: ""
    },
    selectedStudent: {
      key: userId,
      title: userName
    }
  });
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");
  const fallbackClassId = !!activeEnrolledClasses[0] ? activeEnrolledClasses[0]._id : "";

  useEffect(() => {
    resetEnrolledClassAction();
    loadAllClasses();
    setInitialLoading(false);
  }, [currentChild]);

  useEffect(() => {
    if (classId) {
      setSettings({
        ...settings,
        requestFilters: { ...settings.requestFilters, termId: getTermId(userClasses, classId || fallbackClassId) }
      });
    }
  }, [classId, currentChild]);

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      studentId: userId
    };
    if (q.termId) getSPRFilterDataRequest(q);
  }, [settings]);

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
      {loading || initialLoading ? (
        <LoaderConainer>
          <Spin />
        </LoaderConainer>
      ) : !settings.requestFilters.termId ? (
        <LoaderConainer>
          <NoDataNotification heading="No Skill Mastery" description="You don't have any Skill Mastery." />
        </LoaderConainer>
      ) : (
        <StyledDiv>
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
    resetEnrolledClassAction,
    getSPRFilterDataRequest: getSPRFilterDataRequestAction
  }
)(SkillReportContainer);

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  classId: PropTypes.node.isRequired
};

const StyledDiv = styled.div`
  padding: 0px 20px;
`;
