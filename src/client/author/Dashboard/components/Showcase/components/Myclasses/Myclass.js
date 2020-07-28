import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

// components
import { Col, Row, Spin } from "antd";
import { MainContentWrapper } from "@edulastic/common";
import { title } from "@edulastic/colors";
import { TextWrapper } from "../../../styledComponents";
import { CardBox } from "./styled";
import CardImage from "./components/CardImage/cardImage";
import CardTextContent from "./components/CardTextContent/cardTextContent";
import CreateClassPage from "./components/CreateClassPage/createClassPage";
import Launch from "../../../LaunchHangout/Launch";
import ClassSelectModal from "../../../../../ManageClass/components/ClassListContainer/ClassSelectModal";

// static data

// ducks
import { getDictCurriculumsAction } from "../../../../../src/actions/dictionaries";
import { receiveSearchCourseAction } from "../../../../../Courses/ducks";
import {
  fetchClassListAction,
  fetchCleverClassListRequestAction,
  syncClassesWithCleverAction,
  getCleverClassListSelector
} from "../../../../../ManageClass/ducks";
import { receiveTeacherDashboardAction } from "../../../../duck";
import {
  getGoogleAllowedInstitionPoliciesSelector,
  getCleverSyncEnabledInstitutionPoliciesSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector
} from "../../../../../src/selectors/user";
import { getFormattedCurriculumsSelector } from "../../../../../src/selectors/dictionaries";

const Card = ({ data }) => (
  <CardBox data-cy={data.name}>
    <Row>
      <CardImage data={data} />
    </Row>
    <Row>
      <CardTextContent data={data} />
    </Row>
  </CardBox>
);

const MyClasses = ({
  getTeacherDashboard,
  classData,
  loading,
  fetchClassList,
  history,
  isUserGoogleLoggedIn,
  getDictCurriculums,
  receiveSearchCourse,
  districtId,
  googleAllowedInstitutions,
  courseList,
  cleverSyncEnabledInstitutions,
  loadingCleverClassList,
  cleverClassList,
  getStandardsListBySubject,
  fetchCleverClassList,
  syncCleverClassList,
  defaultGrades = [],
  defaultSubjects = []
}) => {
  const [showCleverSyncModal, setShowCleverSyncModal] = useState(false);

  useEffect(() => {
    // fetch clever classes on modal display
    if (showCleverSyncModal) {
      fetchCleverClassList();
    }
  }, [showCleverSyncModal]);

  useEffect(() => {
    getTeacherDashboard();
    getDictCurriculums();
    receiveSearchCourse({ districtId, active: 1 });
  }, []);

  const sortableClasses = classData
    .filter(d => d.asgnStartDate !== null && d.asgnStartDate !== undefined)
    .sort((a, b) => b.asgnStartDate - a.asgnStartDate);
  const unSortableClasses = classData.filter(d => d.asgnStartDate === null || d.asgnStartDate === undefined);

  const allClasses = [...sortableClasses, ...unSortableClasses];
  const allActiveClasses = allClasses.filter(c => c.active === 1 && c.type === "class");
  const ClassCards = allActiveClasses.map(item => (
    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={item._id}>
      <Card data={item} />
    </Col>
  ));

  return (
    <MainContentWrapper padding="30px">
      <ClassSelectModal
        type="clever"
        visible={showCleverSyncModal}
        onSubmit={syncCleverClassList}
        onCancel={() => setShowCleverSyncModal(false)}
        loading={loadingCleverClassList}
        classListToSync={cleverClassList}
        courseList={courseList}
        getStandardsListBySubject={getStandardsListBySubject}
        refreshPage="dashboard"
        existingGroups={allClasses}
        defaultGrades={defaultGrades}
        defaultSubjects={defaultSubjects}
      />
      <TextWrapper size="20px" color={title} style={{ marginBottom: "1rem" }}>
        My Classes
      </TextWrapper>
      {loading ? (
        <Spin style={{ marginTop: "80px" }} />
      ) : allActiveClasses.length == 0 ? (
        <CreateClassPage
          fetchClassList={fetchClassList}
          history={history}
          isUserGoogleLoggedIn={isUserGoogleLoggedIn}
          allowGoogleLogin={googleAllowedInstitutions.length > 0}
          enableCleverSync={cleverSyncEnabledInstitutions.length > 0}
          setShowCleverSyncModal={setShowCleverSyncModal}
        />
      ) : (
        <Row gutter={20}>{ClassCards}</Row>
      )}
      <Launch />
    </MainContentWrapper>
  );
};

export default compose(
  withRouter,
  connect(
    state => ({
      classData: state.dashboardTeacher.data,
      isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn"),
      googleAllowedInstitutions: getGoogleAllowedInstitionPoliciesSelector(state),
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
      districtId: state.user.user?.orgData?.districtIds?.[0],
      loading: state.dashboardTeacher.loading,
      courseList: get(state, "coursesReducer.searchResult"),
      cleverSyncEnabledInstitutions: getCleverSyncEnabledInstitutionPoliciesSelector(state),
      loadingCleverClassList: get(state, "manageClass.loadingCleverClassList"),
      cleverClassList: getCleverClassListSelector(state),
      getStandardsListBySubject: subject => getFormattedCurriculumsSelector(state, { subject }),
      defaultGrades: getInterestedGradesSelector(state),
      defaultSubjects: getInterestedSubjectsSelector(state)
    }),
    {
      fetchClassList: fetchClassListAction,
      receiveSearchCourse: receiveSearchCourseAction,
      getDictCurriculums: getDictCurriculumsAction,
      getTeacherDashboard: receiveTeacherDashboardAction,
      fetchCleverClassList: fetchCleverClassListRequestAction,
      syncCleverClassList: syncClassesWithCleverAction
    }
  )
)(MyClasses);
