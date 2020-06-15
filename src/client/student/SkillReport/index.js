import { MainContentWrapper } from "@edulastic/common";
import { IconBarChart } from "@edulastic/icons";
import { Spin } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withNamespaces } from "react-i18next";
import { getSPRFilterDataRequestAction } from "../../author/Reports/subPages/studentProfileReport/common/filterDataDucks";
import StudentMasteryProfile from "../../author/Reports/subPages/studentProfileReport/StudentMasteryProfile";
import NoDataNotification from "../../common/components/NoDataNotification";
import { getClasses, getCurrentGroup, getUserId, getUserName } from "../Login/ducks";
import {
  getAllClassesSelector,
  getEnrollClassAction,
  getFilteredClassesSelector,
  getLoaderSelector,
  resetEnrolledClassAction
} from "../ManageClass/ducks";
import Header from "../sharedComponents/Header";
import MainContainer from "../styled/mainContainer";
import { LoaderConainer } from "./styled";
import { getUserRole } from "../../author/src/selectors/user";

const getTermId = (_classes, _classId) => _classes.find(c => c._id === _classId).termId || "";

const SkillReportContainer = ({
  flag,
  userId,
  userRole,
  userName,
  classId,
  loadAllClasses,
  activeClasses,
  userClasses,
  loading,
  resetEnrolledClass,
  currentChild,
  getSPRFilterDataRequest,
  t
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
  const fallbackClassId = activeEnrolledClasses[0] ? activeEnrolledClasses[0]._id : "";

  useEffect(() => {
    resetEnrolledClass();
    loadAllClasses();
    setInitialLoading(false);
  }, [currentChild]);

  useEffect(() => {
    if (classId) {
      setSettings({
        ...settings,
        requestFilters: {
          ...settings.requestFilters,
          termId: getTermId(userClasses, classId || fallbackClassId),
          groupIds: [classId]
        }
      });
    }
  }, [classId, currentChild]);

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      studentId: userId
    };
    // set groupId for student
    if (classId && userRole === "student") {
      Object.assign(q, {
        groupIds: [classId]
      });
    } else if (!classId && userRole === "student" && (activeClasses || []).length) {
      const firstActiveClassId = activeClasses?.[0]?._id;
      if (firstActiveClassId) {
        Object.assign(q, {
          groupIds: [firstActiveClassId]
        });
      }
    }
    if (q.termId) getSPRFilterDataRequest(q);
  }, [settings]);

  return (
    <MainContainer flag={flag}>
      <Header
        flag={flag}
        titleText={t("common.skillReportTitle")}
        titleIcon={IconBarChart}
        classSelect
        showActiveClass={false}
        classList={activeEnrolledClasses}
        showAllClassesOption={false}
      />
      <MainContentWrapper padding="30px">
        {loading || initialLoading ? (
          <LoaderConainer>
            <Spin />
          </LoaderConainer>
        ) : !settings.requestFilters.termId ? (
          <LoaderConainer>
            <NoDataNotification heading="No Skill Mastery" description={"You don't have any Skill Mastery."} />
          </LoaderConainer>
        ) : (
          <>
            <StudentMasteryProfile settings={settings} />
          </>
        )}
      </MainContentWrapper>
    </MainContainer>
  );
};

export default withNamespaces("header")(
  connect(
    state => ({
      flag: state.ui.flag,
      classId: getCurrentGroup(state),
      allClasses: getAllClassesSelector(state),
      activeClasses: getFilteredClassesSelector(state),
      userClasses: getClasses(state),
      userName: getUserName(state),
      userId: getUserId(state),
      currentChild: state?.user?.currentChild,
      loading: getLoaderSelector(state),
      userRole: getUserRole(state)
    }),
    {
      loadAllClasses: getEnrollClassAction,
      resetEnrolledClass: resetEnrolledClassAction,
      getSPRFilterDataRequest: getSPRFilterDataRequestAction
    }
  )(SkillReportContainer)
);

SkillReportContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  classId: PropTypes.node.isRequired
};
