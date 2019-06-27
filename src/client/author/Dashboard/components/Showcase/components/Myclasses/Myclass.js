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
  const [showAllCards, setShowAllCards] = useState(false);

  const sortableCards = classData
    .filter(d => d.asgnStartDate !== null && d.asgnStartDate !== undefined)
    .sort((a, b) => b.asgnStartDate - a.asgnStartDate);
  const unSortablecards = classData.filter(d => d.asgnStartDate === null || d.asgnStartDate === undefined);

  const allCards = [...sortableCards, ...unSortablecards];
  const latestAssingments = allCards.slice(0, 3);
  let ClassCards;

  if (!showAllCards) {
    ClassCards = latestAssingments.map(item => (
      <Col span={8} key={item._id}>
        <Card data={item} />
      </Col>
    ));
  } else {
    ClassCards = allCards.map(item => (
      <Col span={8} key={item._id}>
        <Card data={item} />
      </Col>
    ));
  }

  return (
    <CardsContainer>
      <TextWrapper size="20px" color="#434B5D">
        My classes
      </TextWrapper>
      <Row gutter={15}>{classData.length == 0 ? <Spin /> : ClassCards}</Row>

      {showAllCards ? (
        <LinkWrapper size="11px" color="#00AD50" display="block" textalign="end" onClick={() => setShowAllCards(false)}>
          SEE LESS CLASSES »
        </LinkWrapper>
      ) : (
        <LinkWrapper size="11px" color="#00AD50" display="block" textalign="end" onClick={() => setShowAllCards(true)}>
          SEE ALL MY CLASSES »
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
