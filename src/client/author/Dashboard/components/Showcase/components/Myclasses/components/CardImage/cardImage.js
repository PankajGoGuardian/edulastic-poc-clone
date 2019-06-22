import React from "react";
import { Row, Col } from "antd";
import cardImg from "../../../../../../assets/images/cardImg.png";
import rightArrow from "../../../../../../assets/svgs/right-arrow.svg";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { TextWrapper } from "../../../../../styledComponents";

import { Image, OverlayText, IconWrapper } from "./styled";

const CardImage = ({ data, history }) => {
  const { name, grade, studentCount, subject, thumbnail } = data;

  const gotoManageClass = () => {
    history.push("/author/manageClass");
  };

  return (
    <>
      <Image src={thumbnail || cardImg} />
      <OverlayText>
        <Row>
          <Col span={18}>
            <Row>
              <TextWrapper color="#FFFFFF" size="15px" fw="bold">
                {name}
              </TextWrapper>
            </Row>
            <Row>
              <TextWrapper color="#FFFFFF" size="12px" fw="SemiBold">
                Grade {grade} | {subject}
              </TextWrapper>
            </Row>
            <Row>
              <TextWrapper color="#FFFFFF" size="12px" fw="SemiBold">
                {studentCount} {studentCount > 1 ? "Students" : "Student"}
              </TextWrapper>
            </Row>
          </Col>
          <Col span={6}>
            <IconWrapper bgcolor="#FFFFFF" width="34px" height="34px" padding="0.5">
              <img src={rightArrow} alt="" onClick={gotoManageClass} />
            </IconWrapper>
          </Col>
        </Row>
      </OverlayText>
    </>
  );
};

const enhance = compose(withRouter);
export default enhance(CardImage);
