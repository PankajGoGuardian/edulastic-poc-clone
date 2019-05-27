import React from "react";
import styled from "styled-components";
import { Row, Col, Card, Button } from "antd";
import { IconCircleCheck, IconCalculator } from "@edulastic/icons";
import { springGreen, white, blue } from "@edulastic/colors";
import Header from "./Header";

const Schedule = () => (
  <>
    <Header />
    <ScheduleBody type="flex" align="middle">
      <Col xs={16} offset={4}>
        <Row type="flex" align="middle">
          <Col md={24}>
            <TitleWrapper>
              <IconCircleCheck width={50} height={50} />
              <h1>You&apos;r sample teacher account is now ready</h1>
            </TitleWrapper>
            <Description>
              Use this acccount to see how teachers can easily create assessments and get instant data. <br />
              To see how to administer common assessments and samples of school and district reports, click
              <br />
              &quot;Schedule a Demo&quot; below
            </Description>
          </Col>
        </Row>
        <Row>
          <Col xs={10}>
            <StyledCardContaner data-cy="schedule-card" bordered={false}>
              <IconCalculator width={60} height={60} />
              <h1>Schedule a Demo</h1>
              <p>
                Get a walktrough of Edulastic
                <br />
                Enterprise including common
                <br />
                assessments and school
                <br />
                and district reports
              </p>
              <ScheduleBtn>Schedule a Demo</ScheduleBtn>
            </StyledCardContaner>
          </Col>
          <Col xs={10} offset={4}>
            <StyledCardContaner data-cy="teacher-card" bordered={false}>
              <IconCalculator width={60} height={60} />
              <h1>Explore As a Teacher</h1>
              <p>
                Create and assign assessments
                <br />
                using our 41K+ question bank
                <br />
                and see the instant data
              </p>
              <TeacherBtn>Continue to a teacher account</TeacherBtn>
            </StyledCardContaner>
          </Col>
        </Row>
      </Col>
    </ScheduleBody>
  </>
);

export default Schedule;

const ScheduleBody = styled(Row)`
  margin-top: 80px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    font-weight: 700;
    font-size: 32px;
  }

  svg {
    fill: ${springGreen};
  }
`;
const Description = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 500;
`;

const StyledCard = styled(Card)`
  border-radius: 10px;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  min-height: 380px;
  margin-top: 32px;

  .ant-card-body {
    padding: 24px 32px;
  }
  svg {
    fill: ${springGreen};
    margin-left: 64px;
  }
  h1 {
    font-weight: 800;
    text-align: center;
  }
  p {
    font-size: 20px;
    text-align: center;
    font-weight: 500;
  }
`;

const StyledCardContaner = styled(StyledCard)`
  svg {
    fill: ${springGreen};
  }
`;

const commonBtn = styled(Button)`
  font-weight: 600;
  font-size: 12px;
  border-radius: 4px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  min-width: 55%;
  color: ${white};
  border: 0px;
  margin: 16px auto;

  &:hover {
    color: ${white};
  }
`;

const ScheduleBtn = styled(commonBtn)`
  background: ${springGreen};
  &:hover {
    background: ${springGreen};
  }
`;

const TeacherBtn = styled(commonBtn)`
  background: ${blue};
  bottom: -32px;
  &:hover {
    background: ${blue};
  }
`;
