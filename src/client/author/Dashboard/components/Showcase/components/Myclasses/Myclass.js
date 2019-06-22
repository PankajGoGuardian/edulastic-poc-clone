import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Spin } from "antd";
import { TextWrapper, LinkWrapper } from "../../../styledComponents";
import { CardsContainer, CardBox } from "./styled";
import CardImage from "./components/CardImage/cardImage";
import CardTextContent from "./components/CardTextContent/cardTextContent";
import { receiveTeacherDashboardAction } from "../../../../duck";

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

const MyClasses = ({ getTeacherDashboard, classData }) => {
  useEffect(() => {
    getTeacherDashboard();
  }, []);

  const [count, setCount] = useState(3);

  const showCards = classData.slice(0, count);
  const ClassCards =
    showCards.length > 0
      ? showCards.map(item => (
          <Col span={8} key={item._id}>
            <Card data={item} />
          </Col>
        ))
      : null;

  return (
    <CardsContainer>
      <TextWrapper size="20px" color="#434B5D">
        My classes
      </TextWrapper>
      <Row gutter={15}>{classData.length == 0 ? <Spin /> : ClassCards}</Row>

      {count > 3 ? (
        <LinkWrapper size="11px" color="#00AD50" display="block" textalign="end" onClick={() => setCount(3)}>
          SEE LESS CLASSES »
        </LinkWrapper>
      ) : (
        <LinkWrapper
          size="11px"
          color="#00AD50"
          display="block"
          textalign="end"
          onClick={() => setCount(classData.length)}
        >
          {classData.length && "SEE ALL MY CLASSES »"}
        </LinkWrapper>
      )}
    </CardsContainer>
  );
};

export default connect(
  state => ({
    classData: state.dashboardTeacher.data
  }),
  {
    getTeacherDashboard: receiveTeacherDashboardAction
  }
)(MyClasses);
