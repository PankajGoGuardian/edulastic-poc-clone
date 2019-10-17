import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Spin } from "antd";

import Header from "../sharedComponents/Header";
import SkillReportMainContent from "./WrapperAndSummary";

import MainContainer from "../styled/mainContainer";
import {
  fetchSkillReportByClassID as fetchSkillReportAction,
  stateSelector as skillReportSelector,
  getSkillReportLoaderSelector
} from "./ducks";
import { getClasses, getCurrentGroup } from "../Login/ducks";
import { getEnrollClassAction, getAllClassesSelector, getFilteredClassesSelector } from "../ManageClass/ducks";
import NoDataNotification from "../../common/components/NoDataNotification";
import { LoaderConainer } from "./styled";

const SkillReportContainer = ({
  flag,
  skillReport,
  fetchSkillReport,
  classId,
  loadAllClasses,
  activeClasses,
  userClasses,
  loading
}) => {
  const activeEnrolledClasses = (activeClasses || []).filter(c => c.status == "1");

  useEffect(() => {
    loadAllClasses();
  }, []);

  useEffect(() => {
    if (classId) {
      const curriculumId = (userClasses.find(c => c._id === classId).standardSets[0] || {})._id;
      fetchSkillReport({ classId, curriculumId });
    }
  }, [classId]);

  return (
    <MainContainer flag={flag}>
      <Header
        flag={flag}
        titleText="common.skillReportTitle"
        classSelect={true}
        showActiveClass={false}
        classList={activeEnrolledClasses}
        showAllClassesOption={false}
      />
      {loading ? (
        <LoaderConainer>
          <Spin />
        </LoaderConainer>
      ) : isEmpty(skillReport.reports) ? (
        <LoaderConainer>
          <NoDataNotification heading={"No Skill Reports "} description={"You don't have any skill reports."} />
        </LoaderConainer>
      ) : (
        <SkillReportMainContent skillReport={skillReport} />
      )}
    </MainContainer>
  );
};

export default connect(
  state => ({
    flag: state.ui.flag,
    skillReport: skillReportSelector(state),
    classId: getCurrentGroup(state),
    allClasses: getAllClassesSelector(state),
    activeClasses: getFilteredClassesSelector(state),
    loading: getSkillReportLoaderSelector(state),
    userClasses: getClasses(state)
  }),
  {
    fetchSkillReport: fetchSkillReportAction,
    loadAllClasses: getEnrollClassAction
  }
)(SkillReportContainer);

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  skillReport: PropTypes.object.isRequired,
  fetchSkillReport: PropTypes.func.isRequired,
  classId: PropTypes.node.isRequired
};
