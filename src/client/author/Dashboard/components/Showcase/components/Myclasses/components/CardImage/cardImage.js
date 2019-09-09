import React from "react";
import { Row, Col, Tooltip } from "antd";
import cardImg from "../../../../../../assets/images/cardImg.png";
import rightArrow from "../../../../../../assets/svgs/right-arrow.svg";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { TextWrapper } from "../../../../../styledComponents";

import {
  Image,
  OverlayText,
  IconWrapper,
  TextDiv,
  SpanLeftMargin,
  SpanRightMargin,
  RowWrapperGrade,
  RowWrapperSTudentCount
} from "./styled";

const CardImage = ({ data, history }) => {
  const { name, grades = [], studentCount, subject, thumbnail } = data;

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
              <Tooltip title={name} placement="topLeft">
                <TextDiv data-cy="name">{name}</TextDiv>
              </Tooltip>
            </Row>
            <RowWrapperGrade>
              <TextWrapper color="#FFFFFF" size="12px" fw="SemiBold">
                {grades.length ? (
                  <>
                    <SpanRightMargin data-cy="grades">Grades</SpanRightMargin>{" "}
                    {grades.join(", ").replace(/O/i, " Other ")}
                  </>
                ) : (
                  ""
                )}

                {subject ? (
                  <>
                    {grades.length ? <SpanLeftMargin>|</SpanLeftMargin> : ""}
                    <Tooltip title={subject} placement="topLeft">
                      <SpanLeftMargin data-cy="subject">{subject}</SpanLeftMargin>
                    </Tooltip>
                  </>
                ) : (
                  ""
                )}
              </TextWrapper>
            </RowWrapperGrade>
            <RowWrapperSTudentCount>
              <TextWrapper data-cy="studentCount" color="#FFFFFF" size="12px" fw="SemiBold">
                {studentCount || 0} {studentCount > 1 ? "Students" : "Student"}
              </TextWrapper>
            </RowWrapperSTudentCount>
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
