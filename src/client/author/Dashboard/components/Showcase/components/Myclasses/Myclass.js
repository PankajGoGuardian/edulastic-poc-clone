import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Spin } from "antd";
import { TextWrapper } from "../../../styledComponents";
import { Container, CardBox } from "./styled";
import { get } from "lodash";
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

  const sortableClasses = classData
    .filter(d => d.asgnStartDate !== null && d.asgnStartDate !== undefined)
    .sort((a, b) => b.asgnStartDate - a.asgnStartDate);
  const unSortableClasses = classData.filter(d => d.asgnStartDate === null || d.asgnStartDate === undefined);

  const allClasses = [...sortableClasses, ...unSortableClasses];
  const selectedGroups = classData.filter(i => !!i.googleCode).map(i => i.googleCode);
  const allActiveClasses = allClasses.filter(c => c.active === 1);
  const ClassCards = allActiveClasses.map(item => (
    <Col xs={24} sm={24} md={12} lg={12} xl={8} key={item._id}>
      <Card data={item} />
    </Col>
  ));

  return (
    <Container>
      <TextWrapper size="20px" color="#434B5D" style={{ marginBottom: "1rem" }}>
        My classes
      </TextWrapper>
      {loading ? (
        <Spin style={{ marginTop: "80px" }} />
      ) : classData.length == 0 ? (
        <CreateClassPage
          fetchClassList={fetchClassList}
          isUserGoogleLoggedIn={isUserGoogleLoggedIn}
          allowGoogleLogin={allowGoogleLogin}
        />
      ) : (
        <Row gutter={20}>{ClassCards}</Row>
      )}
    </Container>
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
