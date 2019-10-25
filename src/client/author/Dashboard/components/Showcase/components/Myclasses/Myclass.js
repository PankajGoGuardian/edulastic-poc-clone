import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { title } from "@edulastic/colors";
import { Row, Col, Spin } from "antd";
import { TextWrapper } from "../../../styledComponents";
import { Container, CardBox } from "./styled";
import CardImage from "./components/CardImage/cardImage";
import CardTextContent from "./components/CardTextContent/cardTextContent";
import { receiveTeacherDashboardAction } from "../../../../duck";
import CreateClassPage from "./components/CreateClassPage/createClassPage";
import { fetchClassListAction } from "../../../../../ManageClass/ducks";
import { getDictCurriculumsAction } from "../../../../../src/actions/dictionaries";
import { receiveSearchCourseAction } from "../../../../../Courses/ducks";

const Card = ({ data }) => {
  return (
    <CardBox data-cy={data.name}>
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
  history,
  isUserGoogleLoggedIn,
  getDictCurriculums,
  receiveSearchCourse,
  districtId,
  allowGoogleLogin
}) => {
  const [showAllCards, setShowAllCards] = useState(false);

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
    <Container>
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
    </Container>
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
