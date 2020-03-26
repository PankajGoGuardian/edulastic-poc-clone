import { title } from "@edulastic/colors";
import { MainContentWrapper } from "@edulastic/common";
import { Col, Row, Spin } from "antd";
import { get } from "lodash";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { receiveSearchCourseAction } from "../../../../../Courses/ducks";
import { fetchClassListAction } from "../../../../../ManageClass/ducks";
import { getDictCurriculumsAction } from "../../../../../src/actions/dictionaries";
import { receiveTeacherDashboardAction } from "../../../../duck";
import { TextWrapper } from "../../../styledComponents";
import CardImage from "./components/CardImage/cardImage";
import CardTextContent from "./components/CardTextContent/cardTextContent";
import CreateClassPage from "./components/CreateClassPage/createClassPage";
import { CardBox } from "./styled";
import Launch from "../../../LaunchHangout/Launch";

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
  allowGoogleLogin
}) => {
  useEffect(() => {
    getTeacherDashboard();
    getDictCurriculums();
    receiveSearchCourse({ districtId });
  }, []);

  const sortableClasses = classData
    .filter(d => d.asgnStartDate !== null && d.asgnStartDate !== undefined)
    .sort((a, b) => b.asgnStartDate - a.asgnStartDate);
  const unSortableClasses = classData.filter(d => d.asgnStartDate === null || d.asgnStartDate === undefined);

  const allClasses = [...sortableClasses, ...unSortableClasses];
  const allActiveClasses = allClasses.filter(c => c.active === 1);
  const ClassCards = allActiveClasses.map(item => (
    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6} key={item._id}>
      <Card data={item} />
    </Col>
  ));

  return (
    <MainContentWrapper padding="30px">
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
          allowGoogleLogin={allowGoogleLogin}
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
      allowGoogleLogin: get(state, "user.user.orgData.allowGoogleClassroom"),
      fetchClassListLoading: state.manageClass.fetchClassListLoading,
      districtId: get(state, "user.user.orgData.districtId"),
      loading: state.dashboardTeacher.loading
    }),
    {
      fetchClassList: fetchClassListAction,
      receiveSearchCourse: receiveSearchCourseAction,
      getDictCurriculums: getDictCurriculumsAction,
      getTeacherDashboard: receiveTeacherDashboardAction
    }
  )
)(MyClasses);
