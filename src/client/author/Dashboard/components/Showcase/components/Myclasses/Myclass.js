import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Spin } from "antd";
import { get } from "lodash";
import { TextWrapper, LinkWrapper } from "../../../styledComponents";
import { CardsContainer, CardBox } from "./styled";
import CardImage from "./components/CardImage/cardImage";
import CardTextContent from "./components/CardTextContent/cardTextContent";
import { receiveTeacherDashboardAction } from "../../../../duck";
import CreateClassPage from "./components/CreateClassPage/createClassPage";
import {
  fetchClassListAction,
  getGoogleCourseListSelector,
  updateGoogleCourseListAction,
  syncClassAction
} from "../../../../../ManageClass/ducks";
import ClassSelectModal from "../../../../../ManageClass/components/ClassListContainer/ClassSelectModal";
import { getDictCurriculumsAction } from "../../../../../src/actions/dictionaries";
import { receiveSearchCourseAction } from "../../../../../Courses/ducks";

const Card = ({ data }) => {
  return (
    <CardBox>
      <Row>
        <CardImage data={data} />
      </Row>
      <Row>
        <CardTextContent data={data} />
      </Row>
    </CardBox>
  );
};

const MyClasses = ({
  getTeacherDashboard,
  classData,
  loading,
  fetchClassList,
  syncClass,
  updateGoogleCourseList,
  state,
  isUserGoogleLoggedIn,
  courseList,
  googleCourseList,
  getDictCurriculums,
  receiveSearchCourse,
  districtId,
  fetchClassListLoading,
  syncClassLoading,
  allowGoogleLogin
}) => {
  const [showAllCards, setShowAllCards] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);

  useEffect(() => {
    if (!fetchClassListLoading) setIsModalVisible(true);
    else {
      setIsModalVisible(false);
    }
  }, [fetchClassListLoading]);

  useEffect(() => {
    if (!syncClassLoading && isModalVisible) {
      getTeacherDashboard();
      setIsModalVisible(false);
    }
  }, [syncClassLoading]);

  useEffect(() => {
    getTeacherDashboard();
    getDictCurriculums();
    receiveSearchCourse({ districtId });
    setIsModalVisible(false);
  }, []);

  const sortableCards = classData
    .filter(d => d.asgnStartDate !== null && d.asgnStartDate !== undefined)
    .sort((a, b) => b.asgnStartDate - a.asgnStartDate);
  const unSortablecards = classData.filter(d => d.asgnStartDate === null || d.asgnStartDate === undefined);

  const allCards = [...sortableCards, ...unSortablecards];
  const selectedGroups = classData.filter(i => !!i.googleCode).map(i => i.googleCode);

  const ClassCards = allCards.map(item => (
    <Col xs={24} sm={24} md={12} lg={12} xl={8} key={item._id}>
      <Card data={item} />
    </Col>
  ));

  return (
    <CardsContainer>
      <ClassSelectModal
        style={{ width: "700px" }}
        visible={isModalVisible}
        close={closeModal}
        groups={googleCourseList}
        state={state}
        courseList={courseList}
        syncClassLoading={syncClassLoading}
        updateGoogleCourseList={updateGoogleCourseList}
        syncClass={syncClass}
        selectedGroups={selectedGroups}
      />
      <TextWrapper size="20px" color="#434B5D">
        My classes
      </TextWrapper>
      {loading ? (
        <Spin style={{ marginTop: "120px" }} />
      ) : classData.length == 0 ? (
        <CreateClassPage
          fetchClassList={fetchClassList}
          isUserGoogleLoggedIn={isUserGoogleLoggedIn}
          allowGoogleLogin={allowGoogleLogin}
        />
      ) : (
        <Row gutter={20}>{ClassCards}</Row>
      )}
    </CardsContainer>
  );
};

export default connect(
  state => ({
    classData: state.dashboardTeacher.data,
    isUserGoogleLoggedIn: get(state, "user.user.isUserGoogleLoggedIn"),
    allowGoogleLogin: get(state, "user.user.orgData.allowGoogleClassroom"),
    fetchClassListLoading: state.manageClass.fetchClassListLoading,
    state: state,
    districtId: get(state, "user.user.orgData.districtId"),
    courseList: get(state, "coursesReducer.searchResult"),
    syncClassLoading: get(state, "manageClass.syncClassLoading", false),
    googleCourseList: getGoogleCourseListSelector(state),
    loading: state.dashboardTeacher.loading
  }),
  {
    fetchClassList: fetchClassListAction,
    syncClass: syncClassAction,
    receiveSearchCourse: receiveSearchCourseAction,
    getDictCurriculums: getDictCurriculumsAction,
    updateGoogleCourseList: updateGoogleCourseListAction,
    getTeacherDashboard: receiveTeacherDashboardAction
  }
)(MyClasses);
